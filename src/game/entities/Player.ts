import Phaser from 'phaser';
import { DEPTH } from '../config/constants';
import { TEXTURE_KEYS } from '../config/assetKeys';
import { PLAYER_BODY, PLAYER_MOVEMENT as M } from '../config/playerConfig';
import type { MovementIntent } from '../systems/KeyboardInput';
import { PLAYER_ANIMS, PLAYER_FRAME, registerPlayerAnimations, type PlayerAnimKey } from './playerAnimations';

/** Moves `current` toward `target` by at most `maxDelta`. */
const approach = (current: number, target: number, maxDelta: number) =>
  current < target ? Math.min(current + maxDelta, target) : Math.max(current - maxDelta, target);

/**
 * The player character: arcade-physics sprite with acceleration-based running,
 * coyote time, jump buffering and variable jump height.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private coyoteMs = 0;
  private jumpBufferMs = 0;
  private isJumping = false;

  /** (x, feetY): horizontal centre and the y of the surface the player stands on. */
  constructor(scene: Phaser.Scene, x: number, feetY: number) {
    super(scene, x, feetY - PLAYER_FRAME.height / 2, TEXTURE_KEYS.player, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    registerPlayerAnimations(scene.anims);

    this.setDepth(DEPTH.player);
    this.body
      .setSize(PLAYER_BODY.width, PLAYER_BODY.height)
      .setOffset(PLAYER_BODY.offsetX, PLAYER_BODY.offsetY)
      .setMaxVelocityY(M.maxFallSpeed)
      .setCollideWorldBounds(true);
    this.play(PLAYER_ANIMS.idle);
  }

  /** Instantly moves the player to stand at (x, feetY), at rest. */
  placeAt(x: number, feetY: number): void {
    this.body.reset(x, feetY - PLAYER_FRAME.height / 2);
    this.coyoteMs = 0;
    this.jumpBufferMs = 0;
    this.isJumping = false;
  }

  /** Call once per frame from the scene. */
  move(intent: MovementIntent, deltaMs: number): void {
    const body = this.body;
    const dt = deltaMs / 1000;
    const onGround = body.blocked.down || body.touching.down;

    // Timers for forgiving jumps.
    this.coyoteMs = onGround ? M.coyoteTimeMs : Math.max(0, this.coyoteMs - deltaMs);
    this.jumpBufferMs = intent.jumpPressed ? M.jumpBufferMs : Math.max(0, this.jumpBufferMs - deltaMs);
    if (onGround && body.velocity.y >= 0) this.isJumping = false;

    // Horizontal: accelerate toward the target speed.
    const direction = Number(intent.right) - Number(intent.left);
    const target = direction * M.runSpeed;
    const rate =
      direction !== 0
        ? onGround ? M.groundAcceleration : M.airAcceleration
        : onGround ? M.groundDeceleration : M.airDeceleration;
    body.setVelocityX(approach(body.velocity.x, target, rate * dt));

    // Jump.
    if (this.jumpBufferMs > 0 && this.coyoteMs > 0) {
      body.setVelocityY(-M.jumpVelocity);
      this.jumpBufferMs = 0;
      this.coyoteMs = 0;
      this.isJumping = true;
    } else if (this.isJumping && !intent.jumpHeld && body.velocity.y < 0) {
      body.setVelocityY(body.velocity.y * M.jumpCutMultiplier);
      this.isJumping = false;
    }

    if (direction !== 0) this.setFlipX(direction < 0);
    this.playIfChanged(this.pickAnimation(onGround));
  }

  private pickAnimation(onGround: boolean): PlayerAnimKey {
    if (!onGround) return this.body.velocity.y < 0 ? PLAYER_ANIMS.jump : PLAYER_ANIMS.fall;
    return Math.abs(this.body.velocity.x) > 8 ? PLAYER_ANIMS.walk : PLAYER_ANIMS.idle;
  }

  private playIfChanged(key: PlayerAnimKey): void {
    if (this.anims.currentAnim?.key !== key) this.play(key);
  }
}

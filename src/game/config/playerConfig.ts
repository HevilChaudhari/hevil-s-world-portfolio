/**
 * Player movement tuning. Speeds in px/s, accelerations in px/s², times in ms.
 * World gravity (gameConfig) is 900 px/s², so JUMP_VELOCITY 310 gives a peak
 * jump height of about 53 px (≈ 3.3 tiles).
 */
export const PLAYER_MOVEMENT = {
  runSpeed: 105,
  groundAcceleration: 1400,
  groundDeceleration: 1800,
  airAcceleration: 900,
  airDeceleration: 500,
  jumpVelocity: 310,
  /** Upward velocity is multiplied by this when jump is released early. */
  jumpCutMultiplier: 0.45,
  maxFallSpeed: 420,
  /** Grace period after walking off a ledge during which a jump still works. */
  coyoteTimeMs: 90,
  /** A jump pressed this long before landing still triggers on landing. */
  jumpBufferMs: 110,
} as const;

/** Physics body inside the 16x24 frame (narrower than the art, feet aligned to the bottom). */
export const PLAYER_BODY = { width: 8, height: 20, offsetX: 4, offsetY: 4 } as const;

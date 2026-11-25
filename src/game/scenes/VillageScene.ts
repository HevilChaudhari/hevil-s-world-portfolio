import Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH, PALETTE, REGISTRY_KEYS, SCENE_KEYS, TILE_SIZE } from '../config/constants';
import { TEXTURE_KEYS } from '../config/assetKeys';
import { BUILDINGS } from '@/data/buildings';
import type { ReturnPoint } from '@/utils/villageReturn';
import { NPCS } from '@/data/npcs';
import { paintTexture } from '../assets/placeholders';
import { signboardPainter } from '../assets/placeholders/signboard';
import { Npc } from '../entities/Npc';
import { Player } from '../entities/Player';
import { BUILDING_ART, NPC_ART } from '../world/worldArt';
import { INTERACTABLE_KINDS } from '../interactions/interactableKinds';
import { InteractionSystem, type PlacedInteractable } from '../interactions/InteractionSystem';
import { buildTerrain, type TerrainData } from '../maps/buildTerrain';
import { createTerrainLayers } from '../maps/createTerrainLayers';
import { DECORATION_STYLES } from '../maps/decorationTypes';
import type { MapDefinition } from '../maps/types';
import { validatePlacements } from '../maps/validateMap';
import { VILLAGE_MAP } from '../maps/villageMap';
import { EventBus } from '../systems/EventBus';
import { KeyboardInput, NEUTRAL_INTENT } from '../systems/KeyboardInput';
import { ParallaxBackground } from '../systems/ParallaxBackground';

/** Parallax factor shared by the hills strip and the windmills standing on them. */
const HILLS_SCROLL = 0.5;
/** Degrees per second for windmill sails. */
const WINDMILL_SPIN = 24;

/** Centre x (px) of a map column. */
const colToX = (col: number) => col * TILE_SIZE + TILE_SIZE / 2;

/**
 * The explorable village: tile-based terrain, parallax backdrop, scenery,
 * solid obstacles, interactables and the player, with a following camera.
 */
export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private keyboardInput!: KeyboardInput;
  private parallax!: ParallaxBackground;
  private interactions!: InteractionSystem;
  private windmillBlades: Phaser.GameObjects.Image[] = [];
  private npcs: Npc[] = [];
  private mapDef!: MapDefinition;
  private terrain!: TerrainData;
  /** True while React shows a panel (dialogue, menu...) that owns the keyboard. */
  private uiLocked = false;

  constructor() {
    super(SCENE_KEYS.village);
  }

  create(): void {
    const mapDef = VILLAGE_MAP;
    validatePlacements(mapDef);
    const terrain = buildTerrain(mapDef);
    const worldWidth = mapDef.widthTiles * TILE_SIZE;
    const worldHeight = mapDef.heightTiles * TILE_SIZE;
    const groundY = mapDef.groundRow * TILE_SIZE;

    this.windmillBlades = [];
    this.uiLocked = false;

    this.createBackdrop(mapDef, groundY);

    const { ground } = createTerrainLayers(this, terrain);
    const interactables = [
      ...this.placeBuildings(mapDef, terrain),
      ...this.placeInteractables(mapDef, terrain),
      ...this.placeNpcs(mapDef, terrain),
    ];
    const obstacles = this.placeDecorations(mapDef, terrain);

    // The world bounds act as invisible walls at both ends of the village.
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.terrain = terrain;
    this.mapDef = mapDef;
    const spawnX = this.resolveSpawnX(this.registry.get(REGISTRY_KEYS.spawn) as ReturnPoint | null);
    this.player = new Player(this, spawnX, this.surfaceYAt(spawnX));
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, obstacles);

    this.keyboardInput = new KeyboardInput(this);
    this.interactions = new InteractionSystem(this, interactables);
    this.listenForUiEvents();

    // Camera: locked vertically to the screen height, follows the player horizontally.
    const camera = this.cameras.main;
    camera.setBounds(0, 0, worldWidth, GAME_HEIGHT);
    camera.startFollow(this.player, true, 0.12, 0.12);
    camera.setDeadzone(32, GAME_HEIGHT);
    camera.roundPixels = true;

    EventBus.emit('scene-ready', { sceneKey: SCENE_KEYS.village });
  }

  update(time: number, delta: number): void {
    const animate = this.registry.get(REGISTRY_KEYS.reducedMotion) !== true;
    const input = this.keyboardInput.read();

    const { consumedUp } = this.interactions.update({
      playerX: this.player.x,
      playerFeetY: this.player.body.bottom,
      interactPressed: input.interactPressed,
      upPressed: input.upPressed,
      locked: this.uiLocked,
      time,
      animate,
    });

    // W/Up used to enter a door must not also make the player jump.
    const movement = this.uiLocked ? NEUTRAL_INTENT : consumedUp ? { ...input, jumpPressed: false, jumpHeld: false } : input;
    this.player.move(movement, delta);
    for (const npc of this.npcs) npc.watch(this.player.x);

    this.parallax.update(this.cameras.main.scrollX, delta, animate);
    if (animate) {
      for (const blades of this.windmillBlades) blades.angle += (WINDMILL_SPIN * delta) / 1000;
    }
  }

  private listenForUiEvents(): void {
    const unsubscribers = [
      EventBus.on('ui-modal-changed', ({ open }) => {
        this.uiLocked = open;
      }),
      EventBus.on('ui-travel', ({ building }) => this.teleportTo(this.resolveSpawnX({ building }))),
    ];
    const cleanup = () => unsubscribers.forEach((off) => off());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
  }

  /** Turns a return point into a world x, falling back to the map's spawn column. */
  private resolveSpawnX(point: ReturnPoint | null): number {
    const fallback = colToX(this.mapDef.spawnCol);
    if (!point) return fallback;
    const worldWidth = this.mapDef.widthTiles * TILE_SIZE;
    if (point.x !== undefined && point.x >= TILE_SIZE && point.x <= worldWidth - TILE_SIZE) return point.x;
    const placement = this.mapDef.buildings.find((b) => b.building === point.building);
    return placement ? colToX(placement.col) : fallback;
  }

  private surfaceYAt(x: number): number {
    const col = Phaser.Math.Clamp(Math.floor(x / TILE_SIZE), 0, this.mapDef.widthTiles - 1);
    return this.terrain.surfaceRow[col] * TILE_SIZE;
  }

  /** Fast travel: place the player on the ground at x and snap the camera there. */
  private teleportTo(x: number): void {
    this.player.placeAt(x, this.surfaceYAt(x));
    const camera = this.cameras.main;
    camera.centerOn(x, camera.midPoint.y);
  }

  private createBackdrop(mapDef: MapDefinition, groundY: number): void {
    const sky = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.sky);
    sky.fillGradientStyle(PALETTE.skyTop, PALETTE.skyTop, PALETTE.skyBottom, PALETTE.skyBottom, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const heightOf = (key: string) => this.textures.getFrame(key).height;
    const hillsTop = groundY - heightOf(TEXTURE_KEYS.hills) + 4;

    this.parallax = new ParallaxBackground(this, [
      { key: TEXTURE_KEYS.mountainsFar, y: groundY - heightOf(TEXTURE_KEYS.mountainsFar) - 10, scrollFactor: 0.1, depth: DEPTH.mountainsFar },
      { key: TEXTURE_KEYS.mountainsNear, y: groundY - heightOf(TEXTURE_KEYS.mountainsNear) - 4, scrollFactor: 0.25, depth: DEPTH.mountainsNear },
      { key: TEXTURE_KEYS.clouds, y: 8, scrollFactor: 0.15, depth: DEPTH.clouds, driftSpeed: 5 },
      { key: TEXTURE_KEYS.hills, y: hillsTop, scrollFactor: HILLS_SCROLL, depth: DEPTH.hills },
    ]);

    // Windmills sit behind the hills strip and move at the same parallax rate.
    for (const prop of mapDef.backdropProps) {
      const baseY = groundY - 14;
      this.add
        .image(prop.x, baseY, TEXTURE_KEYS.windmill)
        .setOrigin(0.5, 1)
        .setScrollFactor(HILLS_SCROLL)
        .setDepth(DEPTH.windmills);
      const blades = this.add
        .image(prop.x, baseY - 60, TEXTURE_KEYS.windmillBlades)
        .setScrollFactor(HILLS_SCROLL)
        .setDepth(DEPTH.windmills)
        .setAngle(prop.x % 90);
      this.windmillBlades.push(blades);
    }
  }

  /** Places scenery; returns the static physics group of solid obstacles. */
  private placeDecorations(mapDef: MapDefinition, terrain: TerrainData): Phaser.Physics.Arcade.StaticGroup {
    const obstacles = this.physics.add.staticGroup();
    for (const deco of mapDef.decorations) {
      const style = DECORATION_STYLES[deco.type];
      const x = colToX(deco.col) + (deco.offsetX ?? 0);
      const y = terrain.surfaceRow[deco.col] * TILE_SIZE + style.sink;
      const image = this.add.image(x, y, style.texture).setOrigin(0.5, 1).setDepth(style.depth);
      if (style.solid) obstacles.add(image);
    }
    return obstacles;
  }

  /** Signposts and cottage doors. */
  private placeInteractables(mapDef: MapDefinition, terrain: TerrainData): PlacedInteractable[] {
    return mapDef.interactables.map((def) => {
      const x = colToX(def.col);
      const surfaceY = terrain.surfaceRow[def.col] * TILE_SIZE;
      if (def.kind === 'sign') this.add.image(x, surfaceY + 1, TEXTURE_KEYS.signpost).setOrigin(0.5, 1).setDepth(DEPTH.decorBack);
      const kind = INTERACTABLE_KINDS[def.kind];
      return { id: def.id, kind: def.kind, label: def.label, dialogue: def.dialogue, x, surfaceY, ...kind };
    });
  }

  /** Portfolio buildings: sprite, name board and a door interactable each. */
  private placeBuildings(mapDef: MapDefinition, terrain: TerrainData): PlacedInteractable[] {
    return mapDef.buildings.map(({ building, col, signCol }) => {
      const info = BUILDINGS[building];
      const art = BUILDING_ART[building];
      const x = colToX(col);
      const surfaceY = terrain.surfaceRow[col] * TILE_SIZE;
      this.add.image(x, surfaceY, art.texture).setOrigin(0.5, 1).setDepth(DEPTH.buildings);

      const signKey = `sign-board-${building}`;
      paintTexture(this, signKey, signboardPainter(info.signLines));
      this.add
        .image(colToX(signCol), terrain.surfaceRow[signCol] * TILE_SIZE + 1, signKey)
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.decorBack);

      const kind = INTERACTABLE_KINDS.building;
      return {
        id: `building-${building}`,
        kind: 'building' as const,
        label: `Enter the ${info.name}`,
        dialogue: info.dialogue,
        x,
        surfaceY,
        range: kind.range,
        acceptsUp: kind.acceptsUp,
        promptHeight: art.promptHeight,
      };
    });
  }

  /** Villagers: sprite plus a talk interactable each. */
  private placeNpcs(mapDef: MapDefinition, terrain: TerrainData): PlacedInteractable[] {
    this.npcs = [];
    return mapDef.npcs.map(({ npc, col }, index) => {
      const x = colToX(col);
      const surfaceY = terrain.surfaceRow[col] * TILE_SIZE;
      const texture = NPC_ART[npc].texture;
      this.npcs.push(new Npc(this, x, surfaceY, texture, index));
      return {
        id: `npc-${npc}`,
        kind: 'npc' as const,
        label: `Talk to the ${NPCS[npc].name}`,
        dialogue: `npc-${npc}` as const,
        x,
        surfaceY,
        ...INTERACTABLE_KINDS.npc,
        portrait: { texture, frame: 0 },
      };
    });
  }
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HEVIL'S WORLD: a pixel-art RPG developer portfolio. A Phaser 3 countryside village is the homepage/navigation; buildings open React content pages. Must stay 100% static (GitHub Pages), no backend.

Built in 10 phases (setup → village/movement → collision/interaction → buildings/NPCs/dialogue → React integration/routing → projects → tests/vlogs/resume/experience/about → mobile → performance → deployment). Work one phase at a time; after each phase run checks, fix errors, and report what changed and how to test it.

## Commands

- `npm run dev`: dev server (5173). `npm run preview`: serve `dist/` (4173).
- `npm run check`: typecheck + lint + build. Run this before declaring work done.
- `npm run typecheck` / `npm run lint` / `npm run build` individually.
- No test runner yet (planned for Phase 9).
- Gameplay verification: drive headless Chrome over the DevTools protocol (`--remote-debugging-port`, `Input.dispatchKeyEvent` for keys, `Page.captureScreenshot`, `Runtime.exceptionThrown` for errors) with a Node script kept in the scratchpad, not the repo. Run it against the **dev server**: `window.__HEVIL_GAME__` (dev only) gives access to `scene.getScene('VillageScene').player` for reading/teleporting (`player.body.reset(x, y)`). Headless Chrome stalls frames between CDP calls, so don't sample velocity over time; record values inside the game on `postupdate` (e.g. min feet y to detect a jump).
- Visual verification without a browser tool: headless Chrome (`chrome.exe --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=5000 --screenshot=<scratch>.png http://localhost:4173/#/`). Desktop Chrome can't go below ~500px window width; for mobile widths, load the app in a 390px iframe served over HTTP (not file://).

## Version constraints

- Phaser is pinned to **3.x** (`3.90.0`) on purpose; npm's latest is 4.x. Don't upgrade. The user confirmed this (and TS 5.9 + ESLint) after an accidental `npm create vite` overwrote the config; if config files ever look like the Vite starter again, restore rather than adopt them.
- TypeScript is `~5.9`; TS 7 is not supported by typescript-eslint.
- Tailwind 4 (CSS-first config in `src/styles/index.css` `@theme`). Custom classes used with `@apply` must be declared with `@utility`, not inside `@layer components`.

## Architecture

- **Game and React are separated.** `src/game/` never imports React. The only bridge is the typed `EventBus` (`src/game/systems/EventBus.ts`): add new events to `GameEventMap`, emit from scenes, subscribe in React with `useGameEvent`. Settings flow React→game via `game.registry` (e.g. `reducedMotion`).
- **Game lifecycle** is owned by `src/components/game/GameCanvas.tsx`: it creates the game through `src/game/createGame.ts` on mount and destroys it on unmount (this must keep working under StrictMode double-mount).
- **Pixel-perfect scaling:** Phaser runs at 480x270 with `Scale.NONE`; `GameCanvas` applies an integer zoom via `ResizeObserver` + `computePixelZoom` (fractional only below 1x). Don't switch to `Scale.FIT`.
- **Scenes:** Boot → Preload → Village. Preload loads `IMAGE_ASSETS`/`SPRITESHEET_ASSETS`, then `generatePlaceholderTextures` (`src/game/assets/placeholders/index.ts`) paints every `TEXTURE_KEYS` entry that has no real file. Scenes reference textures only by `TEXTURE_KEYS`. To add art: add a key + painter to the `PAINTERS` record (it's typed as exhaustive); to replace art: add an asset entry with the same key, keeping the painter's size/frame layout.
- **Levels are data, not Tiled yet:** `src/game/maps/villageMap.ts` describes terrain as contiguous column segments (`grass|path|stone|bridge|stream` + elevation) plus decorations by column. `buildTerrain()` (pure, no Phaser) turns it into `ground`/`water` tile grids and a per-column `surfaceRow`; `createTerrainLayers()` makes Phaser tilemap layers and enables collision on `SOLID_TILES`. Tile indices in `maps/tiles.ts` must match the tileset strip order. Decorations and the player are positioned from `surfaceRow`, so they follow elevation changes automatically.
- **Side-scroller physics:** Arcade, gravity 900. `Player.move(intent, delta)` takes a device-independent `MovementIntent` (from `KeyboardInput`; Phase 8 touch controls should produce the same intent). Movement tuning lives in `config/playerConfig.ts`. Houses/scenery are background sprites (player walks in front); only tilemap `ground` collides.
- **Collision model:** only tilemap `ground`, world bounds, and decorations whose `DECORATION_STYLES` entry has `solid: true` (static Arcade group) block the player. Houses/trees are deliberately walk-in-front background; buildings are entered via door interactables.
- **Routing & navigation:** routes are generated in `App.tsx` from `PAGES` (`src/data/pages.ts`, paths) + `PAGE_COMPONENTS` (`src/app/pageComponents.ts`, lazy, typed `Record<PageId, …>`). Ids for pages/buildings are declared explicitly in `src/data/ids.ts`, not inferred, because pages↔buildings↔dialogues reference each other (inferring them caused circular-type errors). All in-app navigation goes through `useSiteNavigation()` (`openPage`, `goToVillage`, `travelTo`) so it gets the pixel transition (`TransitionProvider`, GSAP dynamically imported, instant under reduced motion) and records the **return point** (`utils/villageReturn.ts`, sessionStorage `{ building, x? }`), which `GameCanvas` passes to the game as the spawn. Links keep real `href`s and only intercept plain left clicks (`isPlainClick`). Every page renders inside `PageLayout` (breadcrumb, h1 focus on mount, Back to Village, related pages); unfinished pages show `ComingSoon` rather than invented content.
- **Menu:** `MenuProvider`/`useMenu` state; `SiteMenu` is a native modal `<dialog>`. Esc in the village opens it (`GameHud`), and `GameHud` locks game input while a dialogue *or* the menu is open.
- **Bundle rule:** nothing reachable from `SiteLayout`/`App` may import `phaser` at runtime. That is why `EventBus` is a hand-written emitter, not Phaser's. Verify after changes: `dist/index.html` must not reference the `phaser-*.js` chunk.
- **Content vs game:** `src/data/` (pages, buildings, npcs, dialogues) is framework-free content used by both sides; the game only imports types/ids from it plus names for prompts. Game-only presentation lives in `src/game/world/worldArt.ts` (textures, prompt heights). Keep personal facts out of dialogue text.
- **Interactions:** the scene resolves buildings (`placeBuildings`: sprite + generated name board + door), NPCs (`placeNpcs`: `Npc` sprite + talk) and signs/cottage doors (`placeInteractables`) into `PlacedInteractable`s with id, label, `dialogue` id, range, prompt height and `acceptsUp`. `InteractionSystem` picks the nearest in range, shows the E icon, and emits `interaction-focus` / `interaction-triggered` (`{ dialogue, portrait }`; portrait = NPC frame 0 via `textures.getBase64`, cached). Defaults per kind are in `interactableKinds.ts`. Interactable ids (`building-<id>`, `npc-<id>`, sign ids) must be unique; `validateMap.ts` enforces it. When W/Up triggers a door/building, `update()` returns `consumedUp` and the scene strips that frame's jump.
- **Dialogue (React):** `GameHud` → `DialogueBox` walks the tree from `src/data/dialogues.ts`; `DialogueContent` (remounted per node via `key`) handles typewriter (`useTypewriter`, instant under reduced motion) and keyboard. `open-page` choices navigate via `PAGES[id].path` only when `available` is true; otherwise a synthetic "being prepared" node with Back is shown. Flip `available` in `src/data/pages.ts` when a page ships.
- **Signboards** are generated textures (`sign-board-<buildingId>`) from `signLines` using `assets/pixelFont.ts` (A-Z, space, `'`, `&`; other characters throw).
- **UI lock:** React `GameHud` owns HUD state and emits `ui-modal-changed`; while open, the scene feeds `NEUTRAL_INTENT` to the player and the InteractionSystem ignores input. A 250 ms cooldown after unlock stops the key that closed a panel from re-opening it (React and Phaser both listen on `window`). Any new React panel that captures keys (map, journal, pause) must go through this lock. The HUD overlay is sized to `GAME_WIDTH/HEIGHT × zoom` so it sits exactly over the canvas.
- **EventBus subscriptions** made by scenes/systems must be removed on both `SHUTDOWN` and `DESTROY` (`game.destroy()` only fires the latter); the bus is a module singleton that outlives the game.
- **Parallax:** `ParallaxBackground` uses screen-fixed TileSprites whose `tilePositionX` follows camera scroll × factor (rounded to whole pixels). Windmills are sprites with the same scrollFactor as the hills strip. Backdrop strips must be 480 px wide and wrap seamlessly.
- **Depth** ordering is centralised in `DEPTH` (`config/constants.ts`).
- Dev-only `?debug` query param (before the `#`) turns on Arcade debug drawing.
- **Palette** lives in two places that must stay in sync: `PALETTE` in `src/game/config/constants.ts` and `@theme` colors in `src/styles/index.css`. Art direction: warm countryside, Stardew-like, 16-bit. No cyberpunk/neon/futuristic, no emoji as graphics.
- **Routing:** HashRouter (GitHub Pages has no rewrites). Pages are `lazy()`-loaded in `src/app/App.tsx` so content pages don't download Phaser. `NAV_ROUTES` in `src/app/routes.ts` drives the permanent nav; only add a route there once its page exists (no broken links).
- **Base path:** Vite `base` defaults to `./` (overridable via `VITE_BASE_PATH`) so one build works at `user.github.io/` and `user.github.io/repo/`. Always resolve `public/` files with `assetUrl()` from `src/utils/assetUrl.ts`, never a hardcoded leading `/` or repo name.
- Path alias `@/` → `src/`.

## Project pages (Phase 6)

- Model: `src/types/project.ts`. Field semantics matter: `undefined` = not provided yet → render `<Missing>` ("To be added"); `NOT_APPLICABLE` = hide the section. Don't fill fields with plausible-sounding text.
- Detail page sections are built by `src/pages/ProjectDetails/buildProjectSections.tsx` in the spec's order; the TOC and numbering derive from that array. TOC entries scroll with buttons, never `href="#id"` (the hash belongs to HashRouter).
- `src/data/examples/exampleProject.ts` is a fictional, dev-only fixture served by `getProject()` only when `import.meta.env.DEV`; verify it never lands in `dist/` (`grep "dev preview" dist/assets/*.js` must find nothing). Dev-only checklists use `ContentChecklist` behind `import.meta.env.DEV`.
- Media: always `ImageWithFallback` / `VideoEmbed` (click-to-load youtube-nocookie) and `mediaUrl()` for paths.
- Lint rule `react-refresh/only-export-components`: keep component files components-only (helpers in separate files), which is why `ProjectContent.tsx`, `StatusBadge.tsx`, `ExternalButton.tsx` exist.

## Docs

`README.md` is the public, recruiter-facing front page (overview, screenshots, setup, roadmap). Detailed how-to material (editing the map/content/projects, art sizes, base path) lives in `docs/DEVELOPMENT.md`; update that file, not the README, when workflows change, and tick the README roadmap when a phase ships. Screenshots live in `docs/screenshots/`.

## Content rules

Portfolio content will live in `src/data/*.ts`, data-driven. Never invent personal facts (employment dates, achievements, contact info, test results/statistics). Use clearly marked placeholders and tell the user what to supply.

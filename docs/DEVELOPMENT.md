# Development guide

Everything needed to change the village, its content and its art. For setup and an overview, see the [README](../README.md).

## Contents

- [Commands](#commands)
- [Controls](#controls)
- [Routes](#routes)
- [Editing the village](#editing-the-village)
- [Editing content](#editing-content)
- [Adding and editing projects](#adding-and-editing-projects)
- [Adding a page](#adding-a-page)
- [Replacing placeholder art](#replacing-placeholder-art)
- [GitHub Pages base path](#github-pages-base-path)

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server with hot reload (http://localhost:5173) |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build (http://localhost:4173) |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | ESLint |
| `npm run check` | Type-check, lint and build in one go |

Dev-only helpers:

- `http://localhost:5173/?debug` draws physics bodies and collision boxes.
- `window.__HEVIL_GAME__` exposes the running Phaser game in the browser console (dev server only, stripped from production builds).
- `#/projects/example-project` shows a fully filled, fictional project page, and "Dev only" checklists list missing project fields. Neither appears in production builds.

## Controls

| Key | Action |
|---|---|
| A / ← | Walk left |
| D / → | Walk right |
| W / ↑ / Space | Jump (hold for a higher jump) |
| E | Talk to a villager, read a sign, enter a building (the on-screen prompt can also be clicked or tapped) |
| W / ↑ at a door | Enter instead of jumping (Space always jumps) |
| Esc | Open the site menu (every page plus fast travel); Esc again closes it |
| In dialogue | E / Enter / Space: skip typing, then select · ↑↓ or W/S: move · 1-9: pick a choice · Esc: close |

## Routes

| Route | Page | Building |
|---|---|---|
| `#/` | The village (game) | |
| `#/projects` | Projects | Projects Workshop |
| `#/projects/<slug>` | Project detail | Projects Workshop |
| `#/architecture` | Architecture & Technical Work | Developer's Forge |
| `#/test-cases` | Test Cases | Testing Laboratory |
| `#/vlogs` | Vlogs | Vlog House |
| `#/notes` | Technical Notes | Knowledge Library |
| `#/about` | About Me | My Home |
| `#/resume` | Resume | Resume & Contact Castle |
| `#/experience` | Experience | Resume & Contact Castle |

"Back to Village" returns the player to the door or villager they used, or to the page's building when they arrived another way.

## Editing the village

The level lives in `src/game/maps/villageMap.ts`:

- **`terrain`**: column ranges with a surface (`grass`, `path`, `stone`, `bridge`, `stream`) and an optional `elevation` in tiles. Ranges must cover every column exactly once; otherwise the game throws an error naming the bad segment.
- **`decorations`**: scenery placed on a column (`tree`, `pine`, `bush`, `rock`, `fence`, `tuft`, `flowerRed`, `flowerYellow`, `cottage`, and the solid obstacles `crate` and `barrel`). Decorations sit on the surface automatically, including on hills.
- **`backdropProps`**: windmills in the distant hills.
- **`buildings`**: the seven portfolio buildings: door column (`col`) and name-board column (`signCol`).
- **`npcs`**: villagers and the column they stand on.
- **`interactables`**: signposts and cottage doors, each with an `id`, a `col`, the prompt `label` and the `dialogue` it opens.

Only the ground, the world edges and solid obstacles block the player. Houses, trees and fences are background the player walks in front of; buildings are entered through their door.

Player speed and jump feel are tuned in `src/game/config/playerConfig.ts`.

## Editing content

Everything visitors read lives in `src/data/`:

- **`dialogues.ts`**: every conversation. A dialogue is a set of nodes; each choice can `goto` another node, `open-page` a website page, or `close`. Broken `goto` links throw an error in development.
- **`buildings.ts`**: building names, signboard lines (A-Z, space, `'` and `&` only) and the pages each building leads to.
- **`npcs.ts`**: villager names and roles shown in the dialogue window.
- **`pages.ts`**: website pages (path, title, summary, building). Setting `available: false` hides a page from routes and menus; dialogue choices that lead to it then explain it is coming soon.
- **`projects.ts`** and **`testCases.ts`**: see below.

| Location | Villager | Leads to |
|---|---|---|
| My Home | Village Guide (next to it) | About Me |
| Projects Workshop | Workshop Keeper | Projects, Technical Architecture |
| Developer's Forge | | Architecture & Technical Work |
| Testing Laboratory | QA Engineer | Test Cases |
| Knowledge Library | Village Librarian | Technical Notes |
| Vlog House | Video Creator | Vlogs |
| Resume & Contact Castle | | Resume, Experience |

## Adding and editing projects

Projects live in `src/data/projects.ts`. The top of that file has a commented example of every field; the listing, the detail page, its table of contents and the previous/next links update automatically.

- **Leave a field out** and the page shows a clearly marked *To be added* box for it.
- **Set `api`, `links.github` or `links.demo` to `NOT_APPLICABLE`** to hide that section (for example, no API for a game).
- Images go in `public/assets/projects/<slug>/` and are referenced as `assets/projects/<slug>/file.png`. Missing images show a labelled fallback box.
- Videos: set `youtubeId` (played through youtube-nocookie.com and loaded only when the visitor clicks) or a self-hosted `src`.
- Architecture diagrams: `{ kind: 'layers', layers: [...] }` (drawn automatically) or `{ kind: 'image', image: {...} }`.
- Test results come from `src/data/testCases.ts`, linked by `projectSlug`. Only real, observed results belong there.

## Adding a page

1. Add its id to `src/data/ids.ts`.
2. Add its entry to `PAGES` in `src/data/pages.ts`.
3. Add its lazy component to `src/app/pageComponents.ts`.

TypeScript flags any step that is missing.

## Replacing placeholder art

All art is currently generated in code (`src/game/assets/placeholders/`). To swap in a real file:

1. Put it in the matching `public/assets/` folder.
2. Register it in `src/game/config/assetKeys.ts` with the same key as the placeholder:
   ```ts
   // single image
   IMAGE_ASSETS: [{ key: TEXTURE_KEYS.tree, path: 'assets/environment/tree.png' }]
   // spritesheet
   SPRITESHEET_ASSETS: [{ key: TEXTURE_KEYS.player, path: 'assets/characters/player.png', frameWidth: 16, frameHeight: 24 }]
   ```
3. The placeholder for that key is skipped automatically. If the file fails to load, the placeholder is used and a warning is logged.

Keep the placeholder's size and layout:

| Asset | Key | Size / layout |
|---|---|---|
| Terrain tileset | `tileset` | One row of 16x16 tiles in this order: grass, dirt, cobblestone path, mossy stone top, stone, bridge, water surface, deep water (see `src/game/maps/tiles.ts`) |
| Player | `player` | 8 frames of 16x24, facing right: idle ×2, walk ×4, jump, fall |
| Mountains / hills / clouds | `mountainsFar`, `mountainsNear`, `hills`, `clouds` | 480 px wide, must tile seamlessly left to right |
| Cottage | `cottage` | 64x56, anchored bottom-centre |
| Windmill | `windmill`, `windmillBlades` | 32x72 tower; 56x56 sails rotated around their centre |
| Trees and scenery | `tree`, `pine`, `bush`, `rock`, `fence`, `tuft`, flowers | Any size, anchored bottom-centre (fence: 16 px wide, tiles) |
| Signpost | `signpost` | 18x22, anchored bottom-centre |
| Obstacles | `crate`, `barrel` | 16x16 and 12x16; the physics body matches the image size |
| Interaction icon | `promptKey` | 11x12 "E" keycap floating above the focused object |
| Portfolio buildings | `bldHome`, `bldWorkshop`, `bldForge`, `bldLab`, `bldLibrary`, `bldVlog`, `bldCastle` | Home/Forge/Lab/Vlog 80x64, Workshop 96x68, Library 96x80, Castle 160x112; anchored bottom-centre, **door horizontally centred**. If the door height changes, adjust `promptHeight` in `src/game/world/worldArt.ts` |
| Villagers | `npcGuide`, `npcWorkshopKeeper`, `npcQaEngineer`, `npcLibrarian`, `npcVideoCreator` | 2 idle frames of 16x24, facing right; frame 0 is also the dialogue portrait |

Building name boards are drawn from text with a built-in 5 px pixel font (`src/game/assets/pixelFont.ts`), so they update automatically when a building's `signLines` change.

## GitHub Pages base path

The build uses a relative base (`./`) together with HashRouter (URLs look like `/#/projects`). The same `dist/` therefore works at both `https://USERNAME.github.io/` and `https://USERNAME.github.io/REPOSITORY/`, and the repository name is never hardcoded.

To force an absolute base, set `VITE_BASE_PATH` (see `.env.example`), for example `VITE_BASE_PATH=/my-repo/`.

Always reference files in `public/` through `assetUrl()` (`src/utils/assetUrl.ts`), never with a hardcoded leading `/`.

# Zhu Collector

PWA for collecting kawaii pig stamps ("Zhu" = pig in Chinese). 100 built-in SVG stamps + AI-generated stamps via OpenRouter.

## Stack
- **Framework**: React 19 + Vite 6 + TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite` plugin)
- **Database**: Dexie.js 4 (IndexedDB wrapper, local-only)
- **Routing**: React Router 7 with lazy-loaded pages
- **PWA**: `vite-plugin-pwa` with workbox (installable, offline-capable)
- **AI**: OpenRouter → `google/gemini-3.1-flash-image` via chat completions API
- **Path alias**: `@/` → `src/`

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build + PWA service worker
npm run preview      # Preview production build
npx tsc -b --noEmit  # TypeScript check only
```

## Project structure

```
src/
├── main.tsx              # Entry: seed DB → BrowserRouter → App
├── App.tsx               # Routes with lazy-loaded pages, PageLoader fallback
├── index.css             # Tailwind import + safe-area tokens + theme colors
├── vite-env.d.ts         # Env types (VITE_OPENROUTER_API_KEY)
├── db/
│   ├── database.ts       # Dexie schema v1 (stamps table), Stamp/SvgStampConfig types
│   └── seed.ts           # 100 curated stamp definitions + seedDatabase()
├── stores/
│   └── useStamps.ts      # useLiveQuery hooks: useAllStamps, useStamp, useUnlockedStamps, useStats, useAIGeneratedStamps
├── lib/
│   ├── constants.ts      # App-wide constants
│   ├── replicate.ts      # OpenRouter API client: system prompt + generateZhuStamp()
│   └── svg-generator/
│       ├── types.ts      # Re-exports PigColor, Expression, Accessory, Pose, SvgStampConfig
│       ├── traits.ts     # Color palette (8), expression configs (15), accessories (20), pose configs (12)
│       ├── renderer.tsx  # <StampSVG> React component + renderSVGToString() for seed data URIs
│       ├── pig-body.tsx  # Pose-based body shapes (standing, sleeping, shivering, sitting, etc.)
│       ├── pig-face.tsx  # Expression faces (15 types) + special effects (tears, hearts, sweat, zzz)
│       ├── pig-accessories.tsx  # 20 accessory overlays (hats, props, etc.)
│       └── stamp-border.tsx     # Scalloped stamp border + name banner
├── components/
│   ├── ui/
│   │   ├── StampCard.tsx        # Grid thumbnail (locked/unlocked states)
│   │   ├── StampDisplay.tsx     # Large stamp image
│   │   ├── HoldButton.tsx       # Press-and-hold with circular progress ring
│   │   ├── ProgressRing.tsx     # SVG circular progress indicator
│   │   ├── EncounterCounter.tsx # +/- buttons, clamps to 0
│   │   ├── SafeArea.tsx         # iPhone notch/home-indicator spacers
│   │   └── FilterBar.tsx        # Sort pills for collection page
│   └── layout/
│       ├── AppShell.tsx         # TopBar + <Outlet /> + BottomNav
│       ├── TopBar.tsx           # App title + stats badge
│       └── BottomNav.tsx        # Tab bar: Home | Collection | Generate
└── pages/
    ├── HomePage.tsx             # 3-column grid of collection stamps + stats banner
    ├── StampDetailPage.tsx      # Large display, hold-to-unlock, encounter counter, delete
    ├── CollectionPage.tsx       # Unlocked stamps only, sortable
    └── GeneratePage.tsx         # AI generation form, pending review queue, add/dismiss
```

## Data model (Dexie v1)

```ts
interface Stamp {
  id?: number;              // auto-increment PK
  name: string;
  description: string;
  isBuiltIn: boolean;       // true = on Home (seed or user-added), false = pending generated
  imageData: string;        // Base64 data URI (SVG for built-in, PNG for AI)
  imageType: 'svg' | 'png';
  unlockedAt: Date | null;  // null = locked
  encounterCount: number;
  createdAt: Date;
}
```

Indexes: `++id, isBuiltIn, unlockedAt, encounterCount, createdAt`

## Key behaviors

### Stamp filtering (useStamps hooks)
- **Home page** → `useAllStamps()`: only `isBuiltIn === true` (100 built-in + user-added AI stamps)
- **Collection page** → `useUnlockedStamps()`: `isBuiltIn === true && unlockedAt !== null`
- **Generate page** → `useAIGeneratedStamps()`: `isBuiltIn === false` (pending, not yet added)
- Boolean filtering is done in JS (`.filter()`) — Dexie's `where().equals()` can't match JS booleans in IndexedDB indexes

### Generate flow
1. User describes → press & hold generate → OpenRouter call
2. Result stored with `isBuiltIn: false`, `unlockedAt: null` (locked + pending)
3. Appears in "Pending Review" section on Generate page
4. User taps "Add to Collection" → flips `isBuiltIn: true` → appears on Home as locked stamp
5. User taps "Dismiss" → deletes the stamp

### Unlock flow
- Press & hold the HoldButton for 3 seconds → sets `unlockedAt: Date`
- Encounter counter appears, unlock button hides

### SVG generator
- All 100 built-in stamps are SVGs composed from trait combinations
- Each SVG is pre-rendered to a base64 data URI during seed (`renderSVGToString`)
- Grid uses `<img src={dataUri}>` for performance (not inline SVGs)
- React component `<StampSVG config={...}>` is available for live rendering but not used in the grid

### Seed versioning
- `localStorage` flag: `zhu_seeded_v3`
- Previous versions (v1, v2) are auto-cleared on app load
- DB cleared and re-seeded if flag doesn't match

## PWA details
- `display: standalone`, portrait only, pink theme
- Apple meta tags for iOS: `apple-mobile-web-app-capable`, safe-area insets, no user scaling
- Service worker: CacheFirst for JS/CSS/HTML, precache all static assets
- Icons: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png`

## Env
- `VITE_OPENROUTER_API_KEY` — OpenRouter API key for Gemini image generation
- Copy `.env.example` to `.env` and add your key
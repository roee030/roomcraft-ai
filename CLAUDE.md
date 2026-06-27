# roomcraft-ai — B2B2C 3D Room Planner

> **IKEA Kreativ-style 3D room planning platform.** Businesses embed this as a widget; customers design rooms using the business's product catalog in real-time 3D.

## Product Overview

**RoomCraft AI** is a B2B2C web application that lets businesses (furniture retailers, interior brands) offer their customers an interactive 3D room planner — powered by Three.js with realistic furniture meshes, drag-and-drop placement, color variant swapping, and checkout integration.

### End-User Flow
1. Choose room type + dimensions + style + colors (Setup screen)
2. Browse product catalog (left panel) → click + to place in room
3. Drag furniture anywhere on the floor
4. Rotate, scale, remove items
5. Click furniture → right panel shows variants, similar products, goes-well-with
6. Switch views: Dollhouse / Top / Side (N/S/E/W)
7. "Add all to shopping bag" → postMessage to host checkout

### B2B Integration
- Tenant config: `TenantConfig` interface with theme tokens and catalog endpoint
- CSS variables injected at root for zero-leak theming
- Checkout via `window.postMessage`

## Tech Stack

- **Framework**: React 19 + TypeScript (strict) + Vite 8
- **3D**: Three.js 0.185 + @react-three/fiber 9 + @react-three/drei 10
- **State**: Zustand 5
- **Animations**: Framer Motion 12 (UI only)
- **Styling**: CSS Modules + CSS Custom Properties (tenant tokens)
- **Deploy**: GitHub Pages via GitHub Actions

## Project Structure

```
src/
  types/         # TypeScript interfaces (Product, PlacedItem, RoomConfig, TenantConfig)
  constants/     # catalog.ts (15 products), rooms.ts (presets), tenant.ts (default)
  stores/        # roomStore.ts (placed items, room config), uiStore.ts (view mode, selection)
  hooks/         # useTenant.ts (CSS var injection)
  tenant/        # TenantProvider.tsx
  setup/         # RoomSetupScreen.tsx (room/style/color selection)
  planner/
    PlannerApp.tsx      # Top bar + layout shell
    canvas/             # Three.js 3D engine
      RoomCanvas.tsx    # <Canvas> root
      Room.tsx          # Walls, floor, ceiling geometry
      FurnitureMesh.tsx # Procedural 3D meshes per category
      FurnitureItem.tsx # Placed item with drag + selection
      CameraController  # Smooth view mode transitions (lerp)
      DragController    # Raycaster → floor plane drag
      Lights.tsx        # Ambient + directional + point lights with shadows
    panels/
      ProductList.tsx   # Left panel (List/Favorites tabs, search)
      ProductCard.tsx   # Product with add/remove/favorite
      ProductDetail.tsx # Right panel (images, variants, similar, goes-with)
    ui/
      ViewModeBar.tsx   # Dollhouse / Top / Side views / Rotate / Delete
      VariantSwatcher   # Color variant circles
      CartSummary       # Total price display
```

## Git & Workflow
- Branch: `feat/`, `fix/`, `chore/`
- Commits: conventional (`feat:`, `fix:`, `chore:`)
- GitHub Actions auto-deploys master → GitHub Pages
- Live: `https://roee030.github.io/roomcraft-ai/`
- Base path: `/roomcraft-ai/` in vite.config.ts

## Dev Commands
- `npm run dev` — local dev server
- `npm run build` — type-check + build
- `npx tsc --noEmit` — type check only

## Architecture Rules
- Max ~150 lines per file
- No hardcoded colors — always CSS variables or product variant colors
- Canvas moves = client-side Zustand only (never call backend)
- All product positions stored as Three.js [x, y, z] tuples
- Furniture meshes: procedural Three.js geometry (no external GLTF needed for POC)

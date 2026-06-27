import type { ProductCategory } from '../types'

// [width, height, depth] in meters, derived from actual FurnitureMesh geometry.
// Used in DragController (bounds clamping) and FurnitureItem (selection outline).
export const MESH_BOUNDS: Partial<Record<ProductCategory, [number, number, number]>> = {
  sofa:           [2.35, 1.00, 0.98],
  bed:            [1.65, 0.82, 2.10],
  armchair:       [0.88, 0.87, 0.82],
  'coffee-table': [1.25, 0.46, 0.65],
  dresser:        [1.02, 1.22, 0.52],
  nightstand:     [0.52, 0.65, 0.42],
  shelf:          [1.02, 2.02, 0.32],
  'tv-unit':      [1.85, 0.54, 0.45],
  'lamp-floor':   [0.44, 1.96, 0.44],
  'lamp-table':   [0.28, 0.55, 0.28],
  rug:            [2.05, 0.02, 3.05],
  desk:           [1.45, 0.78, 0.68],
  'office-chair': [0.68, 1.25, 0.56],
  'dining-table': [1.24, 0.78, 1.24],
  'dining-chair': [0.48, 1.10, 0.46],
  wardrobe:       [1.00, 2.00, 0.60],
}

export const DEFAULT_BOUNDS: [number, number, number] = [1.0, 1.0, 1.0]

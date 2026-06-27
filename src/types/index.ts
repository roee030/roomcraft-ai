export type ProductCategory =
  | 'bed' | 'dresser' | 'nightstand' | 'sofa' | 'armchair'
  | 'coffee-table' | 'dining-table' | 'dining-chair' | 'desk'
  | 'office-chair' | 'shelf' | 'tv-unit' | 'lamp-floor'
  | 'lamp-table' | 'rug' | 'wardrobe'

export interface ProductVariant {
  id: string
  name: string
  color: string
}

export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  category: ProductCategory
  dimensions: { w: number; d: number; h: number }
  variants: ProductVariant[]
  thumbnailUrl: string
  images: string[]
  similarIds: string[]
  goesWithIds: string[]
  mustSecureToWall?: boolean
}

export interface PlacedItem {
  instanceId: string
  productId: string
  variantId: string
  position: [number, number, number]
  rotationY: number
  scale: number
}

export type ViewMode = 'dollhouse' | 'top' | 'side-n' | 'side-s' | 'side-e' | 'side-w'

export type RoomStyle = 'modern' | 'scandinavian' | 'industrial' | 'japandi' | 'bohemian'

export type FloorType = 'oak' | 'walnut' | 'concrete' | 'white-tile' | 'herringbone'

export interface RoomConfig {
  name: string
  width: number
  depth: number
  height: number
  style: RoomStyle
  wallColor: string
  floorType: FloorType
}

export interface TenantTheme {
  primary: string
  accent: string
  bg: string
  text: string
  textSecondary: string
  surface: string
  border: string
  font: string
  radiusButton: string
  radiusCard: string
}

export interface TenantConfig {
  tenantId: string
  businessName: string
  theme: TenantTheme
  currency: string
}

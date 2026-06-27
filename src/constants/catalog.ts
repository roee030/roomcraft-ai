import type { Product } from '../types'

export const CATALOG: Product[] = [
  // ── BEDROOM ─────────────────────────────────────────────────────────────────
  {
    id: 'bed-001',
    name: 'HAVEN',
    subtitle: 'Upholstered bed frame, Queen',
    description:
      'A minimalist upholstered bed with a tall padded headboard. Clean lines and a low silhouette keep your space feeling open and airy. Available in three premium fabric tones.',
    price: 599,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 318,
    category: 'bed',
    dimensions: { w: 168, d: 218, h: 110 },
    variants: [
      { id: 'v1', name: 'Light Gray', color: '#C5C0B8' },
      { id: 'v2', name: 'Slate Blue', color: '#7A8FA6' },
      { id: 'v3', name: 'Warm Beige', color: '#D4C5A9' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=700&q=85&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['bed-002'],
    goesWithIds: ['dresser-001', 'nightstand-001', 'lamp-table-001'],
  },
  {
    id: 'bed-002',
    name: 'NORDIC',
    subtitle: 'Solid oak bed frame, Queen',
    description:
      'Crafted from sustainably sourced solid oak with a natural oil finish. The subtle grain and warm tone make this piece the heart of any bedroom.',
    price: 849,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 204,
    category: 'bed',
    dimensions: { w: 165, d: 215, h: 95 },
    variants: [
      { id: 'v1', name: 'Natural Oak', color: '#C8A96E' },
      { id: 'v2', name: 'Dark Walnut', color: '#5C3D2E' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['bed-001'],
    goesWithIds: ['nightstand-001', 'dresser-001', 'lamp-floor-001'],
  },
  {
    id: 'dresser-001',
    name: 'GROVE',
    subtitle: '6-drawer dresser, white',
    description:
      'Six smooth-gliding drawers with soft-close mechanisms. The clean white lacquer finish pairs with any bedroom style, from Japandi to classic contemporary.',
    price: 449,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 512,
    category: 'dresser',
    dimensions: { w: 100, d: 50, h: 120 },
    mustSecureToWall: true,
    variants: [
      { id: 'v1', name: 'White', color: '#F5F3EF' },
      { id: 'v2', name: 'Oak Effect', color: '#C4A97D' },
      { id: 'v3', name: 'Anthracite', color: '#4A4A4A' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['bed-001', 'nightstand-001'],
  },
  {
    id: 'nightstand-001',
    name: 'LUNE',
    subtitle: 'Nightstand with drawer, white/marble',
    description:
      'A compact bedside companion with a genuine white marble top and a deep drawer for your essentials. The powder-coated steel frame adds an industrial touch.',
    price: 189,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 287,
    category: 'nightstand',
    dimensions: { w: 45, d: 40, h: 58 },
    variants: [
      { id: 'v1', name: 'White/Marble', color: '#E8E4DE' },
      { id: 'v2', name: 'Black/Marble', color: '#2D2D2D' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['bed-001', 'bed-002', 'lamp-table-001'],
  },

  // ── LIVING ROOM ─────────────────────────────────────────────────────────────
  {
    id: 'sofa-001',
    name: 'CLOUD',
    subtitle: '3-seat sofa, bouclé',
    description:
      'Sink into ultra-deep seats wrapped in textured bouclé fabric. The curved silhouette softens any living room while the solid beech legs ground the design.',
    price: 1299,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 634,
    category: 'sofa',
    dimensions: { w: 240, d: 98, h: 82 },
    variants: [
      { id: 'v1', name: 'Ivory Bouclé', color: '#F0EBE1' },
      { id: 'v2', name: 'Sage Green', color: '#8BA888' },
      { id: 'v3', name: 'Terracotta', color: '#C5673C' },
      { id: 'v4', name: 'Midnight Blue', color: '#1A2E44' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['armchair-001'],
    goesWithIds: ['coffee-table-001', 'rug-001', 'lamp-floor-001', 'tv-unit-001'],
  },
  {
    id: 'armchair-001',
    name: 'DRIFT',
    subtitle: 'Accent armchair, velvet',
    description:
      'A statement chair with a barrel-shaped back and plush velvet upholstery. Swivel base for versatile placement. Wide enough to curl up with a book.',
    price: 589,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 198,
    category: 'armchair',
    dimensions: { w: 82, d: 85, h: 78 },
    variants: [
      { id: 'v1', name: 'Forest Green', color: '#3D6B4F' },
      { id: 'v2', name: 'Dusty Pink', color: '#C9929B' },
      { id: 'v3', name: 'Ochre', color: '#C49A3C' },
      { id: 'v4', name: 'Charcoal', color: '#3C3C3C' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['sofa-001'],
    goesWithIds: ['coffee-table-001', 'lamp-floor-001'],
  },
  {
    id: 'coffee-table-001',
    name: 'FRAME',
    subtitle: 'Coffee table, smoked glass / black',
    description:
      'Smoked tempered glass top resting on a matte black powder-coated steel frame. The lower shelf provides extra display space. A focal point for any living room.',
    price: 349,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 376,
    category: 'coffee-table',
    dimensions: { w: 120, d: 60, h: 42 },
    variants: [
      { id: 'v1', name: 'Smoked Glass/Black', color: '#3A3A3A' },
      { id: 'v2', name: 'Clear Glass/Brass', color: '#C9A84C' },
      { id: 'v3', name: 'Travertine/Brass', color: '#D4C5A9' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['sofa-001', 'armchair-001', 'rug-001'],
  },
  {
    id: 'tv-unit-001',
    name: 'SLATE',
    subtitle: 'TV unit 180cm, white/oak',
    description:
      'Wide-format media unit with two push-to-open doors and an open center shelf. Cables route invisibly through rear cutouts. Sits on angled solid oak legs.',
    price: 479,
    currency: 'USD',
    rating: 4.3,
    reviewCount: 442,
    category: 'tv-unit',
    dimensions: { w: 180, d: 42, h: 55 },
    variants: [
      { id: 'v1', name: 'White/Oak', color: '#F5F0E8' },
      { id: 'v2', name: 'Black/Walnut', color: '#2B2B2B' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1615529488202-5d50d8d9e74c?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615529488202-5d50d8d9e74c?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['sofa-001', 'rug-001'],
  },
  {
    id: 'rug-001',
    name: 'NEST',
    subtitle: 'Area rug 200×300, low pile',
    description:
      'Hand-tufted from recycled PET yarn. The abstract warm-toned pattern grounds a seating area while hiding everyday wear. Reversible for extended life.',
    price: 249,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 523,
    category: 'rug',
    dimensions: { w: 200, d: 300, h: 1 },
    variants: [
      { id: 'v1', name: 'Beige/Terracotta', color: '#D4B8A5' },
      { id: 'v2', name: 'Charcoal/Cream', color: '#5C5C5C' },
      { id: 'v3', name: 'Sage/Natural', color: '#8BA888' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['sofa-001', 'coffee-table-001'],
  },
  {
    id: 'shelf-001',
    name: 'LOFT',
    subtitle: 'Modular bookshelf, black steel',
    description:
      'Industrial-style open shelving system with adjustable heights. Solid mango wood shelves rest in a black powder-coated steel grid frame. Endlessly configurable.',
    price: 599,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 289,
    category: 'shelf',
    mustSecureToWall: true,
    dimensions: { w: 100, d: 30, h: 200 },
    variants: [
      { id: 'v1', name: 'Black/Mango', color: '#1E1E1E' },
      { id: 'v2', name: 'White/Oak', color: '#F0EBE1' },
      { id: 'v3', name: 'Brass/Walnut', color: '#C9A84C' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['lamp-floor-001', 'lamp-table-001'],
  },

  // ── LAMPS ────────────────────────────────────────────────────────────────────
  {
    id: 'lamp-floor-001',
    name: 'ALTO',
    subtitle: 'Arc floor lamp, brass',
    description:
      'An arc floor lamp that casts a warm pool of light over a seating area. The counterweighted marble base keeps it stable while the polished brass arm makes a design statement.',
    price: 229,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 156,
    category: 'lamp-floor',
    dimensions: { w: 35, d: 35, h: 185 },
    variants: [
      { id: 'v1', name: 'Brass/White', color: '#C9A84C' },
      { id: 'v2', name: 'Matte Black', color: '#1E1E1E' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['lamp-table-001'],
    goesWithIds: ['sofa-001', 'armchair-001'],
  },
  {
    id: 'lamp-table-001',
    name: 'GLOW',
    subtitle: 'Table lamp, ceramic matte black',
    description:
      'Handcrafted ceramic base in a textured matte finish topped with a natural linen shade. Gives off a soft, diffused warmth ideal for bedside or reading nooks.',
    price: 119,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 211,
    category: 'lamp-table',
    dimensions: { w: 22, d: 22, h: 46 },
    variants: [
      { id: 'v1', name: 'Matte Black', color: '#2C2C2C' },
      { id: 'v2', name: 'Sage Green', color: '#7A9E7E' },
      { id: 'v3', name: 'Terracotta', color: '#C26C50' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1513506003901-1e6a35705d4b?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a35705d4b?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: ['lamp-floor-001'],
    goesWithIds: ['nightstand-001', 'desk-001'],
  },

  // ── OFFICE / DINING ─────────────────────────────────────────────────────────
  {
    id: 'desk-001',
    name: 'FOCUS',
    subtitle: 'Writing desk, natural oak top',
    description:
      'A solid oak desktop on slim powder-coated steel legs. The integrated cable tray keeps wires invisible. Available with or without a modesty panel drawer.',
    price: 499,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 327,
    category: 'desk',
    dimensions: { w: 140, d: 65, h: 75 },
    variants: [
      { id: 'v1', name: 'Natural Oak/Black', color: '#C8A96E' },
      { id: 'v2', name: 'White/Black', color: '#F0EBE1' },
      { id: 'v3', name: 'Walnut/Brass', color: '#6B4226' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['office-chair-001', 'lamp-table-001', 'shelf-001'],
  },
  {
    id: 'office-chair-001',
    name: 'FORM',
    subtitle: 'Ergonomic mesh chair, charcoal',
    description:
      'Full-day comfort with lumbar support, adjustable armrests and a breathable 3D mesh back. The 5-star aluminum base rolls silently on hardwood or carpet.',
    price: 399,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 488,
    category: 'office-chair',
    dimensions: { w: 68, d: 65, h: 120 },
    variants: [
      { id: 'v1', name: 'Charcoal', color: '#4A4A4A' },
      { id: 'v2', name: 'All Black', color: '#1A1A1A' },
      { id: 'v3', name: 'White', color: '#F0EBE1' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['desk-001'],
  },
  {
    id: 'dining-table-001',
    name: 'GATHER',
    subtitle: 'Round dining table, natural oak, ⌀120',
    description:
      'A round table that invites everyone in. Solid oak top with visible grain and bevelled edge, on a monolithic turned-oak pedestal. Seats 4–5 comfortably.',
    price: 899,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 142,
    category: 'dining-table',
    dimensions: { w: 120, d: 120, h: 74 },
    variants: [
      { id: 'v1', name: 'Natural Oak', color: '#C8A96E' },
      { id: 'v2', name: 'Painted White', color: '#F5F0E8' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['dining-chair-001'],
  },
  {
    id: 'dining-chair-001',
    name: 'PULL',
    subtitle: 'Dining chair, shell, set of 2',
    description:
      'A one-piece polypropylene shell on solid beech legs. Lightweight, stackable and available in bold contemporary colors. Designed for indoor and covered outdoor use.',
    price: 259,
    currency: 'USD',
    rating: 4.4,
    reviewCount: 376,
    category: 'dining-chair',
    dimensions: { w: 48, d: 52, h: 80 },
    variants: [
      { id: 'v1', name: 'Shell White', color: '#F0EBE1' },
      { id: 'v2', name: 'Clay Pink', color: '#D9A89B' },
      { id: 'v3', name: 'Olive Green', color: '#6B7B5C' },
      { id: 'v4', name: 'Slate Gray', color: '#6B7280' },
    ],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=320&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=700&q=85&auto=format&fit=crop',
    ],
    similarIds: [],
    goesWithIds: ['dining-table-001'],
  },
]

import OpenAI from 'openai'
import { nanoid } from 'nanoid'
import { CATALOG } from '../constants/catalog'
import { MESH_BOUNDS, DEFAULT_BOUNDS } from '../constants/meshBounds'
import type { RoomConfig, PlacedItem, FloorType, RoomStyle } from '../types/index'

// ── API key resolution ────────────────────────────────────────────────────────

export function getStoredApiKey(): string {
  return (
    (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) ||
    localStorage.getItem('openai_api_key') ||
    ''
  )
}

export function saveApiKey(key: string): void {
  localStorage.setItem('openai_api_key', key.trim())
}

// ── Rich catalog description for the AI ──────────────────────────────────────

const CATEGORY_STYLE: Record<string, string> = {
  'bed':           'bedroom centerpiece, placed against a wall, headboard visible',
  'dresser':       'bedroom storage, placed against a wall',
  'nightstand':    'beside the bed, small surface with drawer',
  'sofa':          'living room focal point, placed in center or against back wall',
  'armchair':      'accent seating, corner placement or beside sofa',
  'coffee-table':  'in front of sofa at center, low to the ground',
  'tv-unit':       'against the wall opposite the sofa, media storage',
  'rug':           'flat on the floor beneath seating, large area coverage',
  'shelf':         'wall-mounted or tall standing, display and storage',
  'lamp-floor':    'arc or tall standing lamp near seating area or corner',
  'lamp-table':    'small lamp on nightstand, desk, or side table',
  'desk':          'against a wall or window, workspace',
  'office-chair':  'in front of desk, swivel base',
  'dining-table':  'center of dining area, round or rectangular',
  'dining-chair':  'around the dining table, set of 2',
}

function buildCatalogSummary(): string {
  return CATALOG.map((p) => {
    const variants = p.variants
      .map((v) => `      ${v.id}: "${v.name}" color=${v.color}`)
      .join('\n')
    const style = CATEGORY_STYLE[p.category] ?? p.category
    return [
      `${p.id} [${p.category.toUpperCase()}] "${p.name}" — ${p.subtitle}`,
      `  Style: ${style}`,
      `  Description: ${p.description.slice(0, 100)}`,
      `  Variants:\n${variants}`,
    ].join('\n')
  }).join('\n\n')
}

// ── Position clamping ─────────────────────────────────────────────────────────

function clampPosition(
  x: number,
  z: number,
  productId: string,
  width: number,
  depth: number,
): [number, number, number] {
  const product = CATALOG.find((p) => p.id === productId)
  const [bW, , bD] = product ? (MESH_BOUNDS[product.category] ?? DEFAULT_BOUNDS) : DEFAULT_BOUNDS
  const hw = Math.max(0, width / 2 - bW / 2 - 0.15)
  const hd = Math.max(0, depth / 2 - bD / 2 - 0.15)
  return [Math.max(-hw, Math.min(hw, x)), 0, Math.max(-hd, Math.min(hd, z))]
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface AIItem {
  productId: string
  variantId: string
  x: number
  z: number
  rotationY: number
  reason: string
  photoX: number
  photoY: number
}

interface AIResponse {
  roomName: string
  roomType: string
  width: number
  depth: number
  height: number
  wallColor: string
  floorType: string
  items: AIItem[]
}

export interface AIDesignResult {
  room: RoomConfig
  placedItems: PlacedItem[]
  reasons: Record<string, string>
  photoPositions: Record<string, { x: number; y: number }>
}

// ── Main analysis function ────────────────────────────────────────────────────

const VALID_FLOOR_TYPES: FloorType[] = ['oak', 'walnut', 'concrete', 'white-tile', 'herringbone']

export async function analyzeRoomWithAI(
  imageBase64: string,
  mimeType: string,
): Promise<AIDesignResult> {
  const apiKey = getStoredApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

  const prompt = `You are an expert interior designer and furniture stylist. Analyze this room photo deeply and create a complete, stylistically coherent furniture design using ONLY items from the catalog below.

Respond ONLY with a valid JSON object — no markdown, no code blocks, no explanation.

═══════════════════════════════════════════
STEP 1 — ANALYZE THE ROOM
═══════════════════════════════════════════
Look at the photo and determine:
- Room type (bedroom / living room / dining room / office / mixed)
- Dominant style (Scandinavian / minimalist / Japandi / contemporary / eclectic / warm/cozy / industrial)
- Color palette (wall color, floor tone, existing accents)
- Approximate dimensions
- Lighting quality (bright/natural, dim, artificial)
- What existing features are visible (window, door, built-ins)

═══════════════════════════════════════════
STEP 2 — DESIGN WITH OUR CATALOG
═══════════════════════════════════════════
Select 5–8 furniture items that:
1. Match the room TYPE (only bedroom furniture for bedrooms, etc.)
2. Harmonize with the STYLE — pick variants whose colors complement the room palette
3. Are properly SCALED for the estimated room size
4. Create a COHESIVE LOOK — mix statement pieces with supporting ones

${buildCatalogSummary()}

═══════════════════════════════════════════
STEP 3 — OUTPUT FORMAT
═══════════════════════════════════════════
ROOM COORDINATE SYSTEM (for 3D planner):
- Center is (0,0). X: negative=left wall, positive=right wall. Z: negative=back wall, positive=front.

PHOTO COORDINATE SYSTEM (for overlay hotspots):
- photoX: 0.0=left edge → 1.0=right edge of the photo
- photoY: 0.0=top edge → 1.0=bottom edge of the photo
- Items against back wall appear HIGHER in photo (photoY ~0.2–0.4)
- Items in the foreground appear LOWER (photoY ~0.6–0.85)
- Rugs appear near center-bottom (photoY ~0.55–0.75)
- Place dots where the item's CENTER MASS would appear in THIS specific photo

AVAILABLE FLOOR TYPES: oak | walnut | concrete | white-tile | herringbone

{
  "roomName": "<creative descriptive name, e.g. 'Warm Japandi Retreat'>",
  "roomType": "<bedroom|living-room|dining-room|office>",
  "width": <estimated meters 3.0–6.5>,
  "depth": <estimated meters 3.0–5.5>,
  "height": <ceiling height 2.4–3.0>,
  "wallColor": "<hex color that matches these walls>",
  "floorType": "<best matching floor type>",
  "items": [
    {
      "productId": "<exact id from catalog>",
      "variantId": "<exact variant id — choose color that fits the room palette>",
      "x": <3D X position within ±(width/2 - 0.8)>,
      "z": <3D Z position within ±(depth/2 - 0.8)>,
      "rotationY": <0=faces front, 1.5708=left, 3.1416=back, -1.5708=right>,
      "reason": "<one sentence: WHY this specific item AND variant fits this room's style>",
      "photoX": <0.0–1.0 horizontal position in THIS photo>,
      "photoY": <0.0–1.0 vertical position in THIS photo>
    }
  ]
}

DESIGN RULES:
- Bed headboard against back wall: z ≈ -(depth/2 - 1.2), rotationY=0
- Sofa faces center/TV: z ≈ -(depth/2 - 1.0), rotationY=3.1416
- Rug under center seating: x≈0, z≈0
- Nightstands beside bed, one on each side if space allows
- Large items first (bed/sofa), then supporting (nightstand, lamp, rug)
- Never place 2 beds or 2 sofas
- Choose variants whose colors match: light rooms → light variants, dark/moody rooms → rich dark variants`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'high' },
          },
          { type: 'text', text: prompt },
        ],
      },
    ],
  })

  const raw = response.choices[0]?.message?.content ?? ''
  if (!raw) throw new Error('Empty response from AI. Please try again.')

  let parsed: AIResponse
  try {
    parsed = JSON.parse(raw) as AIResponse
  } catch {
    throw new Error('Could not parse AI response. Please try again with a clearer photo.')
  }

  const floorType = VALID_FLOOR_TYPES.includes(parsed.floorType as FloorType)
    ? (parsed.floorType as FloorType)
    : 'oak'

  const room: RoomConfig = {
    name: parsed.roomName || 'AI Designed Room',
    width: Math.max(3, Math.min(7, Number(parsed.width) || 4.5)),
    depth: Math.max(3, Math.min(6, Number(parsed.depth) || 4.0)),
    height: Math.max(2.2, Math.min(3.5, Number(parsed.height) || 2.7)),
    wallColor: /^#[0-9A-Fa-f]{3,6}$/.test(parsed.wallColor ?? '') ? parsed.wallColor : '#F5F0E8',
    floorType,
    style: 'modern' as RoomStyle,
  }

  const reasons: Record<string, string> = {}
  const photoPositions: Record<string, { x: number; y: number }> = {}
  const placedItems: PlacedItem[] = []

  for (const item of parsed.items ?? []) {
    const product = CATALOG.find((p) => p.id === item.productId)
    if (!product) continue

    const variant =
      product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]

    const instanceId = nanoid()
    placedItems.push({
      instanceId,
      productId: product.id,
      variantId: variant.id,
      position: clampPosition(
        Number(item.x) || 0,
        Number(item.z) || 0,
        product.id,
        room.width,
        room.depth,
      ),
      rotationY: typeof item.rotationY === 'number' ? item.rotationY : 0,
      scale: 1,
    })
    reasons[instanceId] = item.reason || ''
    photoPositions[instanceId] = {
      x: Math.max(0.05, Math.min(0.95, Number(item.photoX) || 0.5)),
      y: Math.max(0.05, Math.min(0.95, Number(item.photoY) || 0.5)),
    }
  }

  return { room, placedItems, reasons, photoPositions }
}

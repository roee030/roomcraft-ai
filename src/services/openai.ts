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

// ── Catalog summary for the prompt ───────────────────────────────────────────

function buildCatalogSummary(): string {
  return CATALOG.map(
    (p) =>
      `${p.id} [${p.category}] "${p.name}": ${p.variants.map((v) => `${v.id}=${v.name}`).join(', ')}`,
  ).join('\n')
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
}

interface AIResponse {
  roomName: string
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

  const prompt = `You are an expert interior designer. Analyze this room photo and create a furnished 3D room layout.

Respond ONLY with a valid JSON object — no markdown, no code blocks, no explanation.

ROOM COORDINATE SYSTEM:
- Center is (0,0). X: negative=left wall, positive=right wall. Z: negative=back wall, positive=front.

AVAILABLE FLOOR TYPES: oak | walnut | concrete | white-tile | herringbone

FURNITURE CATALOG (use ONLY these exact productId and variantId values):
${buildCatalogSummary()}

JSON FORMAT:
{
  "roomName": "<creative name e.g. 'Warm Scandinavian Bedroom'>",
  "width": <estimated width in meters 3.0–6.5>,
  "depth": <estimated depth in meters 3.0–5.5>,
  "height": <ceiling height 2.4–3.0>,
  "wallColor": "<hex color matching room walls>",
  "floorType": "<one of the floor types above>",
  "items": [
    {
      "productId": "<exact id from catalog>",
      "variantId": "<exact variant id for that product>",
      "x": <X position — keep within ±(width/2 - 1.0)>,
      "z": <Z position — keep within ±(depth/2 - 1.0)>,
      "rotationY": <radians: 0=faces front, 1.5708=faces left, 3.1416=faces back, -1.5708=faces right>,
      "reason": "<one sentence why this piece fits>"
    }
  ]
}

DESIGN RULES:
- Suggest 5–8 items that match this room's type and style
- Large items (bed, sofa, wardrobe) sit against walls: place near room edges in Z or X
- Center pieces (rug, coffee table, dining table) go near x=0, z=0
- Space items at least 0.8m apart to avoid overlap
- A bed's headboard faces the back wall: use rotationY=0, place at negative Z
- A sofa faces center: rotationY=3.1416, place at negative Z
- Match variant colors to the room's existing palette`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'low' },
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
  }

  return { room, placedItems, reasons }
}

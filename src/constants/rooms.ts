import type { RoomConfig } from '../types'

export const ROOM_PRESETS: RoomConfig[] = [
  {
    name: 'Living Room',
    width: 5.5,
    depth: 4.5,
    height: 2.7,
    style: 'modern',
    wallColor: '#F5F0E8',
    floorType: 'oak',
  },
  {
    name: 'Bedroom',
    width: 4.5,
    depth: 4.0,
    height: 2.7,
    style: 'scandinavian',
    wallColor: '#EAE5DC',
    floorType: 'oak',
  },
  {
    name: 'Home Office',
    width: 3.5,
    depth: 3.5,
    height: 2.7,
    style: 'industrial',
    wallColor: '#E8E4E0',
    floorType: 'concrete',
  },
  {
    name: 'Dining Room',
    width: 4.5,
    depth: 4.0,
    height: 2.7,
    style: 'modern',
    wallColor: '#F0EBE1',
    floorType: 'herringbone',
  },
]

export const WALL_COLORS = [
  { name: 'Warm White', value: '#F5F0E8' },
  { name: 'Linen', value: '#EAE5DC' },
  { name: 'Stone', value: '#D8D0C4' },
  { name: 'Sage Mist', value: '#D4DDD5' },
  { name: 'Sky Blue', value: '#D5E0EA' },
  { name: 'Blush', value: '#EDD8D4' },
  { name: 'Charcoal', value: '#4A4A4A' },
  { name: 'Pure White', value: '#FAFAFA' },
]

export const FLOOR_MATERIALS = [
  { id: 'oak', label: 'Light Oak', color: '#C8A96E', color2: '#B8944E' },
  { id: 'walnut', label: 'Dark Walnut', color: '#6B4226', color2: '#5C3820' },
  { id: 'concrete', label: 'Concrete', color: '#AEADB0', color2: '#9E9DA0' },
  { id: 'white-tile', label: 'White Tile', color: '#F0EDE8', color2: '#E0DDD8' },
  { id: 'herringbone', label: 'Herringbone', color: '#C2A476', color2: '#B09466' },
] as const

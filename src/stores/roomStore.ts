import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { PlacedItem, RoomConfig } from '../types'
import { ROOM_PRESETS } from '../constants/rooms'

interface RoomState {
  room: RoomConfig
  placedItems: PlacedItem[]
  history: PlacedItem[][]

  setRoom: (room: RoomConfig) => void
  addItem: (productId: string, variantId: string) => PlacedItem
  removeItem: (instanceId: string) => void
  duplicateItem: (instanceId: string) => void
  updateItemPosition: (instanceId: string, position: [number, number, number]) => void
  updateItemRotation: (instanceId: string, rotationY: number) => void
  rotateItem90: (instanceId: string) => void
  updateItemVariant: (instanceId: string, variantId: string) => void
  undo: () => void
}

export const useRoomStore = create<RoomState>()((set, get) => ({
  room: ROOM_PRESETS[0],
  placedItems: [],
  history: [],

  setRoom: (room) => set({ room }),

  addItem: (productId, variantId) => {
    const item: PlacedItem = {
      instanceId: nanoid(),
      productId,
      variantId,
      position: [(Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2],
      rotationY: 0,
      scale: 1,
    }
    set((s) => ({
      history: [...s.history, s.placedItems],
      placedItems: [...s.placedItems, item],
    }))
    return item
  },

  removeItem: (instanceId) =>
    set((s) => ({
      history: [...s.history, s.placedItems],
      placedItems: s.placedItems.filter((i) => i.instanceId !== instanceId),
    })),

  duplicateItem: (instanceId) => {
    const original = get().placedItems.find((i) => i.instanceId === instanceId)
    if (!original) return
    const copy: PlacedItem = {
      ...original,
      instanceId: nanoid(),
      position: [original.position[0] + 0.8, 0, original.position[2] + 0.8],
    }
    set((s) => ({
      history: [...s.history, s.placedItems],
      placedItems: [...s.placedItems, copy],
    }))
  },

  updateItemPosition: (instanceId, position) =>
    set((s) => ({
      placedItems: s.placedItems.map((i) =>
        i.instanceId === instanceId ? { ...i, position } : i
      ),
    })),

  updateItemRotation: (instanceId, rotationY) =>
    set((s) => ({
      placedItems: s.placedItems.map((i) =>
        i.instanceId === instanceId ? { ...i, rotationY } : i
      ),
    })),

  rotateItem90: (instanceId) =>
    set((s) => ({
      placedItems: s.placedItems.map((i) =>
        i.instanceId === instanceId ? { ...i, rotationY: i.rotationY + Math.PI / 2 } : i
      ),
    })),

  updateItemVariant: (instanceId, variantId) =>
    set((s) => ({
      placedItems: s.placedItems.map((i) =>
        i.instanceId === instanceId ? { ...i, variantId } : i
      ),
    })),

  undo: () =>
    set((s) => {
      if (s.history.length === 0) return s
      const prev = s.history[s.history.length - 1]
      return { placedItems: prev, history: s.history.slice(0, -1) }
    }),
}))

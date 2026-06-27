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
  updateItemPosition: (instanceId: string, position: [number, number, number]) => void
  updateItemRotation: (instanceId: string, rotationY: number) => void
  updateItemVariant: (instanceId: string, variantId: string) => void
  undo: () => void
}

export const useRoomStore = create<RoomState>()((set) => ({
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

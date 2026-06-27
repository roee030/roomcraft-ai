import { create } from 'zustand'
import type { ViewMode } from '../types'

type Screen = 'welcome' | 'setup' | 'planner' | 'ai-generate'
type PanelTab = 'list' | 'favorites'

interface UiState {
  screen: Screen
  viewMode: ViewMode
  selectedInstanceId: string | null
  hoveredInstanceId: string | null
  isDragging: boolean
  panelTab: PanelTab
  favoriteIds: Set<string>
  isRotating: boolean

  setScreen: (s: Screen) => void
  setViewMode: (v: ViewMode) => void
  setSelectedInstanceId: (id: string | null) => void
  setHoveredInstanceId: (id: string | null) => void
  setIsDragging: (v: boolean) => void
  setPanelTab: (t: PanelTab) => void
  toggleFavorite: (productId: string) => void
  setIsRotating: (v: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  screen: 'welcome',
  viewMode: 'dollhouse',
  selectedInstanceId: null,
  hoveredInstanceId: null,
  isDragging: false,
  panelTab: 'list',
  favoriteIds: new Set(),
  isRotating: false,

  setScreen: (screen) => set({ screen }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedInstanceId: (selectedInstanceId) => set({ selectedInstanceId }),
  setHoveredInstanceId: (hoveredInstanceId) => set({ hoveredInstanceId }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setPanelTab: (panelTab) => set({ panelTab }),
  toggleFavorite: (productId) =>
    set((s) => {
      const next = new Set(s.favoriteIds)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return { favoriteIds: next }
    }),
  setIsRotating: (isRotating) => set({ isRotating }),
}))

import { useEffect } from 'react'
import type { TenantConfig } from '../types'

export const useTenant = (config: TenantConfig) => {
  useEffect(() => {
    const root = document.documentElement
    const { theme } = config
    root.style.setProperty('--tenant-primary', theme.primary)
    root.style.setProperty('--tenant-accent', theme.accent)
    root.style.setProperty('--tenant-bg', theme.bg)
    root.style.setProperty('--tenant-text', theme.text)
    root.style.setProperty('--tenant-text-secondary', theme.textSecondary)
    root.style.setProperty('--tenant-surface', theme.surface)
    root.style.setProperty('--tenant-border', theme.border)
    root.style.setProperty('--tenant-font', theme.font)
    root.style.setProperty('--tenant-radius-button', theme.radiusButton)
    root.style.setProperty('--tenant-radius-card', theme.radiusCard)
  }, [config])
}

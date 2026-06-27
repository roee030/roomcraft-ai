import type { TenantConfig } from '../types'

export const DEFAULT_TENANT: TenantConfig = {
  tenantId: 'modernhome',
  businessName: 'ModernHome',
  theme: {
    primary: '#1A1A1A',
    accent: '#0058A3',
    bg: '#FFFFFF',
    text: '#111111',
    textSecondary: '#767676',
    surface: '#F5F0E8',
    border: '#E5E1DB',
    font: 'Inter, sans-serif',
    radiusButton: '24px',
    radiusCard: '8px',
  },
  currency: 'USD',
}

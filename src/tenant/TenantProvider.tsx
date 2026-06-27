import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_TENANT } from '../constants/tenant'
import { useTenant } from '../hooks/useTenant'
import type { TenantConfig } from '../types'

const TenantCtx = createContext<TenantConfig>(DEFAULT_TENANT)

export const useTenantConfig = () => useContext(TenantCtx)

export const TenantProvider = ({
  config = DEFAULT_TENANT,
  children,
}: {
  config?: TenantConfig
  children: ReactNode
}) => {
  useTenant(config)
  return <TenantCtx.Provider value={config}>{children}</TenantCtx.Provider>
}

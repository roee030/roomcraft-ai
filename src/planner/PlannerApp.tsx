import { useRoomStore } from '../stores/roomStore'
import { useUiStore } from '../stores/uiStore'
import { CATALOG } from '../constants/catalog'
import { RoomCanvas } from './canvas/RoomCanvas'
import { ProductList } from './panels/ProductList'
import { ProductDetail } from './panels/ProductDetail'
import { ViewModeBar } from './ui/ViewModeBar'
import { useTenantConfig } from '../tenant/TenantProvider'
import styles from './PlannerApp.module.css'

const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)
const IconSave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

export const PlannerApp = () => {
  const room = useRoomStore((s) => s.room)
  const placedItems = useRoomStore((s) => s.placedItems)
  const setScreen = useUiStore((s) => s.setScreen)
  const tenant = useTenantConfig()

  const total = placedItems.reduce((sum, item) => {
    const p = CATALOG.find((c) => c.id === item.productId)
    return sum + (p?.price ?? 0)
  }, 0)

  return (
    <div className={styles.app}>
      {/* Top bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} onClick={() => setScreen('setup')}>
            <IconBack />
          </button>
          <span className={styles.roomName}>{room.name}</span>
        </div>
        <div className={styles.headerCenter}>
          <span className={styles.brandName}>{tenant.businessName}</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><IconCamera /></button>
          <button className={styles.iconBtn}><IconSave /></button>
          {placedItems.length > 0 && (
            <span className={styles.totalBadge}>${total.toLocaleString()}</span>
          )}
          <button className={styles.summaryBtn}>
            Summary <IconArrow />
          </button>
          <button className={styles.iconBtn}><IconClose /></button>
        </div>
      </header>

      {/* Main layout */}
      <div className={styles.main}>
        <ProductList />
        <div className={styles.canvasArea}>
          <RoomCanvas />
          <ViewModeBar />
        </div>
        <ProductDetail />
      </div>
    </div>
  )
}

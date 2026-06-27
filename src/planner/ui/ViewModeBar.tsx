import { useState } from 'react'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'
import type { ViewMode } from '../../types'
import styles from './ViewModeBar.module.css'

const SIDE_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: 'North', value: 'side-n' },
  { label: 'South', value: 'side-s' },
  { label: 'East', value: 'side-e' },
  { label: 'West', value: 'side-w' },
]

const IconDollhouse = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconTop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
)
const IconSide = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <line x1="8" y1="4" x2="8" y2="20"/>
    <line x1="16" y1="4" x2="16" y2="20"/>
  </svg>
)
const IconRotate = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
  </svg>
)
const IconMove = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>
    <polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>
    <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
  </svg>
)
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const IconChevron = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    <path d="M5 7L1 3h8z"/>
  </svg>
)

export const ViewModeBar = () => {
  const viewMode = useUiStore((s) => s.viewMode)
  const setViewMode = useUiStore((s) => s.setViewMode)
  const selectedId = useUiStore((s) => s.selectedInstanceId)
  const isRotating = useUiStore((s) => s.isRotating)
  const setIsRotating = useUiStore((s) => s.setIsRotating)
  const removeItem = useRoomStore((s) => s.removeItem)
  const setSelectedId = useUiStore((s) => s.setSelectedInstanceId)
  const [sideOpen, setSideOpen] = useState(false)

  const activeSide = SIDE_OPTIONS.find((o) => o.value === viewMode)

  const handleDelete = () => {
    if (!selectedId) return
    removeItem(selectedId)
    setSelectedId(null)
  }

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <button
          className={`${styles.viewBtn} ${viewMode === 'dollhouse' ? styles.active : ''}`}
          onClick={() => setViewMode('dollhouse')}
        >
          <IconDollhouse /><span>Dollhouse</span>
        </button>

        <button
          className={`${styles.viewBtn} ${viewMode === 'top' ? styles.active : ''}`}
          onClick={() => setViewMode('top')}
        >
          <IconTop /><span>Top view</span>
        </button>

        <div className={styles.sideWrap}>
          <button
            className={`${styles.viewBtn} ${activeSide ? styles.active : ''}`}
            onClick={() => setSideOpen((v) => !v)}
          >
            <IconSide />
            <span>{activeSide?.label ?? 'Side views'}</span>
            <IconChevron />
          </button>
          {sideOpen && (
            <div className={styles.sideDropdown}>
              {SIDE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`${styles.dropItem} ${viewMode === o.value ? styles.dropActive : ''}`}
                  onClick={() => { setViewMode(o.value); setSideOpen(false) }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        {selectedId && (
          <>
            <button
              className={`${styles.actionBtn} ${isRotating ? styles.actionActive : ''}`}
              onMouseDown={() => setIsRotating(true)}
              onMouseUp={() => setIsRotating(false)}
            >
              <IconRotate /><span>Rotate</span>
            </button>
            <button className={styles.actionBtn}>
              <IconMove /><span>Move to</span>
            </button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete}>
              <IconTrash />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

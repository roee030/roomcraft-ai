import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import { CATALOG } from '../../constants/catalog'
import { FurnitureMesh } from './FurnitureMesh'
import type { ProductCategory } from '../../types'
import styles from './FurnitureGizmo.module.css'

// Approximate gizmo Y offset above each category's mesh center
const GIZMO_Y: Partial<Record<ProductCategory, number>> = {
  'lamp-floor': 2.3,
  wardrobe: 2.1,
  shelf: 1.9,
  dresser: 1.6,
  'office-chair': 1.5,
  sofa: 1.4,
  armchair: 1.4,
  bed: 1.2,
  'dining-chair': 1.2,
  desk: 1.1,
  'dining-table': 1.1,
  nightstand: 1.0,
  'tv-unit': 0.8,
  'lamp-table': 0.8,
  'coffee-table': 0.65,
  rug: 0.35,
}

const IconRotate = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
)
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
)

interface Props { instanceId: string }

export const FurnitureItem = ({ instanceId }: Props) => {
  const item = useRoomStore((s) => s.placedItems.find((i) => i.instanceId === instanceId))
  const isSelected = useUiStore((s) => s.selectedInstanceId === instanceId)
  const isHovered = useUiStore((s) => s.hoveredInstanceId === instanceId)
  const setSelected = useUiStore((s) => s.setSelectedInstanceId)
  const setHovered = useUiStore((s) => s.setHoveredInstanceId)
  const setIsDragging = useUiStore((s) => s.setIsDragging)
  const removeItem = useRoomStore((s) => s.removeItem)
  const duplicateItem = useRoomStore((s) => s.duplicateItem)
  const rotateItem90 = useRoomStore((s) => s.rotateItem90)
  const updateVariant = useRoomStore((s) => s.updateItemVariant)
  const groupRef = useRef<THREE.Group>(null!)

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setSelected(instanceId)
      setIsDragging(true)
    },
    [instanceId, setSelected, setIsDragging]
  )
  const handlePointerEnter = useCallback(() => setHovered(instanceId), [instanceId, setHovered])
  const handlePointerLeave = useCallback(() => setHovered(null), [setHovered])

  if (!item) return null
  const product = CATALOG.find((p) => p.id === item.productId)
  if (!product) return null

  const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]
  const gizmoY = GIZMO_Y[product.category] ?? 1.2

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={[0, item.rotationY, 0]}
      scale={item.scale}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <FurnitureMesh category={product.category} color={variant.color} />

      {/* Selection / hover outline */}
      {(isSelected || isHovered) && (
        <mesh>
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshBasicMaterial
            color={isSelected ? '#0058A3' : '#FFC300'}
            transparent
            opacity={0.07}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.5, 2.5, 2.5)]} />
          <lineBasicMaterial color="#0058A3" linewidth={2} />
        </lineSegments>
      )}

      {/* Floating inline gizmo — shown when item is selected */}
      {isSelected && (
        <Html
          center
          position={[0, gizmoY, 0]}
          zIndexRange={[300, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={styles.gizmo} onClick={(e) => e.stopPropagation()}>

            {/* Color variant circles */}
            {product.variants.length > 1 && (
              <div className={styles.variantRow}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`${styles.variantDot} ${v.id === item.variantId ? styles.variantActive : ''}`}
                    style={{ background: v.color }}
                    title={v.name}
                    onClick={(e) => { e.stopPropagation(); updateVariant(instanceId, v.id) }}
                  />
                ))}
              </div>
            )}

            {/* Action toolbar */}
            <div className={styles.actionBar}>
              <button
                className={styles.actionBtn}
                onClick={(e) => { e.stopPropagation(); rotateItem90(instanceId) }}
                title="Rotate 90°"
              >
                <IconRotate />
                <span>Rotate</span>
              </button>

              <div className={styles.sep} />

              <button
                className={styles.actionBtn}
                onClick={(e) => { e.stopPropagation(); duplicateItem(instanceId) }}
                title="Copy"
              >
                <IconCopy />
                <span>Copy</span>
              </button>

              <div className={styles.sep} />

              <button
                className={`${styles.actionBtn} ${styles.removeBtn}`}
                onClick={(e) => {
                  e.stopPropagation()
                  removeItem(instanceId)
                  setSelected(null)
                }}
                title="Remove"
              >
                <IconTrash />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

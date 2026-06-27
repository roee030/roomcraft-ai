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

// Tight bounding box [W, H, D] derived from actual FurnitureMesh geometry dimensions.
// Used for selection outline + gizmo height offset.
const MESH_BOUNDS: Partial<Record<ProductCategory, [number, number, number]>> = {
  sofa:           [2.35, 1.00, 0.98],
  bed:            [1.65, 0.82, 2.10],
  armchair:       [0.88, 0.87, 0.82],
  'coffee-table': [1.25, 0.46, 0.65],
  dresser:        [1.02, 1.22, 0.52],
  nightstand:     [0.52, 0.65, 0.42],
  shelf:          [1.02, 2.02, 0.32],
  'tv-unit':      [1.85, 0.54, 0.45],
  'lamp-floor':   [0.44, 1.96, 0.44],
  'lamp-table':   [0.28, 0.55, 0.28],
  rug:            [2.05, 0.02, 3.05],
  desk:           [1.45, 0.78, 0.68],
  'office-chair': [0.68, 1.25, 0.56],
  'dining-table': [1.24, 0.78, 1.24],
  'dining-chair': [0.48, 1.10, 0.46],
  wardrobe:       [1.00, 2.00, 0.60],
}
const DEFAULT_BOUNDS: [number, number, number] = [1.0, 1.0, 1.0]
const PAD = 0.10 // padding around tight bounds for selection box

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
      document.body.style.cursor = 'grabbing'
    },
    [instanceId, setSelected, setIsDragging]
  )
  const handlePointerEnter = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      setHovered(instanceId)
      document.body.style.cursor = 'grab'
    },
    [instanceId, setHovered]
  )
  const handlePointerLeave = useCallback(() => {
    setHovered(null)
    document.body.style.cursor = ''
  }, [setHovered])

  if (!item) return null
  const product = CATALOG.find((p) => p.id === item.productId)
  if (!product) return null

  const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]
  const [bW, bH, bD] = MESH_BOUNDS[product.category] ?? DEFAULT_BOUNDS

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

      {/* Floor-level grab dot — always visible as interaction handle */}
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, 0.11, 24]} />
        <meshBasicMaterial
          color={isSelected ? '#0058A3' : isHovered ? '#1A1A1A' : '#666666'}
          transparent
          opacity={isSelected ? 1 : isHovered ? 0.85 : 0.45}
        />
      </mesh>

      {/* Selection / hover outline — tight-fitting box per category */}
      {(isSelected || isHovered) && (
        <mesh position={[0, bH / 2, 0]}>
          <boxGeometry args={[bW + PAD, bH + PAD * 0.5, bD + PAD]} />
          <meshBasicMaterial
            color={isSelected ? '#0058A3' : '#1A1A1A'}
            transparent
            opacity={isSelected ? 0.07 : 0.04}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      {(isSelected || isHovered) && (
        <lineSegments position={[0, bH / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(bW + PAD, bH + PAD * 0.5, bD + PAD)]} />
          <lineBasicMaterial
            color={isSelected ? '#0058A3' : '#555555'}
            transparent
            opacity={isSelected ? 1 : 0.5}
          />
        </lineSegments>
      )}

      {/* Floating inline gizmo */}
      {isSelected && (
        <Html
          center
          position={[0, bH + 0.35, 0]}
          zIndexRange={[300, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={styles.gizmo} onClick={(e) => e.stopPropagation()}>

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

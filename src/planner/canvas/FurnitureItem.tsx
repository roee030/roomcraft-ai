import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import { CATALOG } from '../../constants/catalog'
import { MESH_BOUNDS, DEFAULT_BOUNDS } from '../../constants/meshBounds'
import { FurnitureMesh } from './FurnitureMesh'
import styles from './FurnitureGizmo.module.css'

const PAD = 0.08

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

  // Compute bounds before early returns so hooks are called unconditionally
  const product = item ? CATALOG.find((p) => p.id === item.productId) : null
  const [bW, bH, bD] = product ? (MESH_BOUNDS[product.category] ?? DEFAULT_BOUNDS) : DEFAULT_BOUNDS

  // Projects the item's top to 2D screen space so the gizmo sits directly above the
  // furniture regardless of camera angle — no perspective drift.
  const calculateGizmoPosition = useCallback(
    (el: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }): [number, number] => {
      const pos = new THREE.Vector3()
      el.getWorldPosition(pos)  // Html at [0,0,0] local → item floor center in world
      pos.y += bH               // step up to item top
      pos.project(camera)
      return [
        (pos.x * 0.5 + 0.5) * size.width,
        (-pos.y * 0.5 + 0.5) * size.height - 10,  // 10px gap above item top
      ]
    },
    [bH],
  )

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setSelected(instanceId)
      setIsDragging(true)
      document.body.style.cursor = 'grabbing'
    },
    [instanceId, setSelected, setIsDragging],
  )
  const handlePointerEnter = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      setHovered(instanceId)
      document.body.style.cursor = 'grab'
    },
    [instanceId, setHovered],
  )
  const handlePointerLeave = useCallback(() => {
    setHovered(null)
    document.body.style.cursor = ''
  }, [setHovered])

  if (!item) return null
  if (!product) return null

  const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]

  const borderColor = isSelected ? '#0058A3' : '#E8A000'
  const borderOpacity = isSelected ? 1 : 0.75

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

      {/* Floor grab dot — depthTest=false ensures it's always visible above the furniture
          base mesh (which starts at y=0 and would otherwise occlude the dot) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <circleGeometry args={[0.13, 24]} />
        <meshBasicMaterial
          color={isSelected ? '#0058A3' : isHovered ? '#111111' : '#555555'}
          transparent
          opacity={isSelected ? 0.95 : isHovered ? 0.80 : 0.60}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Tight bounding box outline — correct size per category, sits on floor */}
      {(isSelected || isHovered) && (
        <mesh position={[0, bH / 2, 0]}>
          <boxGeometry args={[bW + PAD, bH + PAD * 0.5, bD + PAD]} />
          <meshBasicMaterial
            color={borderColor}
            transparent
            opacity={isSelected ? 0.07 : 0.04}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      {(isSelected || isHovered) && (
        <lineSegments position={[0, bH / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(bW + PAD, bH + PAD * 0.5, bD + PAD)]} />
          <lineBasicMaterial color={borderColor} transparent opacity={borderOpacity} />
        </lineSegments>
      )}

      {/* Hover tooltip — "Click for options" (IKEA-style), hidden when selected */}
      {isHovered && !isSelected && (
        <Html
          center
          position={[0, 0.05, 0]}
          zIndexRange={[250, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(20,20,20,0.82)',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'var(--tenant-font)',
            padding: '5px 11px',
            borderRadius: 5,
            whiteSpace: 'nowrap',
            letterSpacing: 0.01,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            Click to access more options
          </div>
        </Html>
      )}

      {/* Full inline gizmo — color swatches + action toolbar — persists while selected.
          calculatePosition pins it to item top in 2D screen space; translate(-50%,-100%)
          bottom-anchors so the gizmo floats ABOVE the item rather than overlapping it. */}
      {isSelected && (
        <Html
          calculatePosition={calculateGizmoPosition}
          position={[0, 0, 0]}
          zIndexRange={[300, 0]}
          style={{ transform: 'translate(-50%, -100%)' }}
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

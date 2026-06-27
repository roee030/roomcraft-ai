import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import { CATALOG } from '../../constants/catalog'
import { FurnitureMesh } from './FurnitureMesh'

interface Props {
  instanceId: string
}

export const FurnitureItem = ({ instanceId }: Props) => {
  const item = useRoomStore((s) => s.placedItems.find((i) => i.instanceId === instanceId))
  const isSelected = useUiStore((s) => s.selectedInstanceId === instanceId)
  const isHovered = useUiStore((s) => s.hoveredInstanceId === instanceId)
  const setSelected = useUiStore((s) => s.setSelectedInstanceId)
  const setHovered = useUiStore((s) => s.setHoveredInstanceId)
  const setIsDragging = useUiStore((s) => s.setIsDragging)
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

      {/* Selection / hover outline box */}
      {(isSelected || isHovered) && (
        <mesh>
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshBasicMaterial
            color={isSelected ? '#0058A3' : '#FFC300'}
            transparent
            opacity={0.08}
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
    </group>
  )
}

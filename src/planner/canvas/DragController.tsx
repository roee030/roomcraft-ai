import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'
import { CATALOG } from '../../constants/catalog'
import { MESH_BOUNDS, DEFAULT_BOUNDS } from '../../constants/meshBounds'

const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const WALL_MARGIN = 0.05 // 5 cm clearance from walls

export const DragController = () => {
  const { camera, raycaster, pointer } = useThree()
  const isDragging = useUiStore((s) => s.isDragging)
  const selectedId = useUiStore((s) => s.selectedInstanceId)
  const isRotating = useUiStore((s) => s.isRotating)
  const updatePosition = useRoomStore((s) => s.updateItemPosition)
  const updateRotation = useRoomStore((s) => s.updateItemRotation)
  const getState = useRoomStore.getState

  const intersectPt = useRef(new THREE.Vector3())
  const lastPointer = useRef(new THREE.Vector2())
  // Grab offset: distance from floor-projection of grab point to item center.
  // Subtracting this prevents the item jumping to the pointer on drag start.
  const dragOffset = useRef(new THREE.Vector3())
  const wasDragging = useRef(false)
  const prevSelectedId = useRef<string | null>(null)

  useFrame(() => {
    if (!selectedId) return
    const { room, placedItems } = getState()
    const item = placedItems.find((i) => i.instanceId === selectedId)

    if (isDragging && !isRotating) {
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.ray.intersectPlane(FLOOR_PLANE, intersectPt.current)

      if (hit) {
        // On first drag frame: record offset between grab point and item center
        const isNewDrag = !wasDragging.current || selectedId !== prevSelectedId.current
        if (isNewDrag && item) {
          dragOffset.current.set(
            intersectPt.current.x - item.position[0],
            0,
            intersectPt.current.z - item.position[2],
          )
        }

        // Per-furniture bounds: clamp center so edges stay inside room walls
        const product = item ? CATALOG.find((p) => p.id === item.productId) : null
        const [bW, , bD] = product ? (MESH_BOUNDS[product.category] ?? DEFAULT_BOUNDS) : DEFAULT_BOUNDS
        const hw = Math.max(0, room.width / 2 - bW / 2 - WALL_MARGIN)
        const hd = Math.max(0, room.depth / 2 - bD / 2 - WALL_MARGIN)

        // Reject far intersections (ray nearly parallel to floor)
        if (camera.position.distanceTo(intersectPt.current) < 35) {
          updatePosition(selectedId, [
            Math.max(-hw, Math.min(hw, intersectPt.current.x - dragOffset.current.x)),
            0,
            Math.max(-hd, Math.min(hd, intersectPt.current.z - dragOffset.current.z)),
          ])
        }
      }
    }

    if (isRotating && item) {
      const dx = pointer.x - lastPointer.current.x
      updateRotation(selectedId, item.rotationY + dx * Math.PI * 2)
    }

    wasDragging.current = isDragging && !isRotating
    prevSelectedId.current = selectedId
    lastPointer.current.copy(pointer)
  })

  return null
}

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'

const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

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
  // Drag offset: difference between floor-projection of click point and item center.
  // Applied so the item moves with the cursor at the grab point, not jumping to center.
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
        // First frame of this drag — record the grab offset
        const isNewDrag = !wasDragging.current || selectedId !== prevSelectedId.current
        if (isNewDrag && item) {
          dragOffset.current.set(
            intersectPt.current.x - item.position[0],
            0,
            intersectPt.current.z - item.position[2],
          )
        }

        // Reject far intersections (ray nearly parallel to floor → wild coordinates)
        if (camera.position.distanceTo(intersectPt.current) < 35) {
          const hw = room.width / 2 - 0.3
          const hd = room.depth / 2 - 0.3
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

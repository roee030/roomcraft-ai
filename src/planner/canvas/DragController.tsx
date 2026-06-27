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

  useFrame(() => {
    if (!selectedId) return
    const { room, placedItems } = getState()

    if (isDragging && !isRotating) {
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.ray.intersectPlane(FLOOR_PLANE, intersectPt.current)
      // Sanity check: reject intersections unreasonably far from camera
      // (happens when ray is near-parallel to floor, causing wild teleports)
      if (hit && camera.position.distanceTo(intersectPt.current) < 35) {
        const hw = room.width / 2 - 0.3
        const hd = room.depth / 2 - 0.3
        updatePosition(selectedId, [
          Math.max(-hw, Math.min(hw, intersectPt.current.x)),
          0,
          Math.max(-hd, Math.min(hd, intersectPt.current.z)),
        ])
      }
    }

    if (isRotating) {
      const dx = pointer.x - lastPointer.current.x
      const item = placedItems.find((i) => i.instanceId === selectedId)
      if (item) {
        updateRotation(selectedId, item.rotationY + dx * Math.PI * 2)
      }
    }

    lastPointer.current.copy(pointer)
  })

  return null
}

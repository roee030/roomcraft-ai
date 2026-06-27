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

  const intersectPt = useRef(new THREE.Vector3())
  const lastPointer = useRef(new THREE.Vector2())

  useFrame(() => {
    if (!selectedId) return

    if (isDragging && !isRotating) {
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.ray.intersectPlane(FLOOR_PLANE, intersectPt.current)
      if (hit) {
        updatePosition(selectedId, [
          intersectPt.current.x,
          0,
          intersectPt.current.z,
        ])
      }
    }

    if (isRotating) {
      const dx = pointer.x - lastPointer.current.x
      updateRotation(selectedId, dx * Math.PI * 2)
    }

    lastPointer.current.copy(pointer)
  })

  return null
}

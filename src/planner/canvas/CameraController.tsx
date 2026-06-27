import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'

interface CameraConfig {
  position: [number, number, number]
  target: [number, number, number]
}

const getCameraConfig = (
  viewMode: string,
  w: number,
  d: number,
  h: number
): CameraConfig => {
  const cx = 0
  const cz = 0
  const ht = h * 0.5

  switch (viewMode) {
    case 'dollhouse':
      return {
        position: [w * 0.8 + 3, h * 2.2 + 3, d * 0.8 + 4],
        target: [cx, ht * 0.4, cz],
      }
    case 'top':
      return {
        position: [cx, h * 4.5, 0.0001],
        target: [cx, 0, cz],
      }
    case 'side-n':
      return { position: [cx, ht, d * 0.5 + 5], target: [cx, ht, cz] }
    case 'side-s':
      return { position: [cx, ht, -(d * 0.5 + 5)], target: [cx, ht, cz] }
    case 'side-e':
      return { position: [w * 0.5 + 5, ht, cz], target: [cx, ht, cz] }
    case 'side-w':
      return { position: [-(w * 0.5 + 5), ht, cz], target: [cx, ht, cz] }
    default:
      return { position: [6, 7, 7], target: [0, 0.5, 0] }
  }
}

export const CameraController = () => {
  const { camera } = useThree()
  const viewMode = useUiStore((s) => s.viewMode)
  const { width, depth, height } = useRoomStore((s) => s.room)

  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())

  useEffect(() => {
    const cfg = getCameraConfig(viewMode, width, depth, height)
    targetPos.current.set(...cfg.position)
    targetLookAt.current.set(...cfg.target)
  }, [viewMode, width, depth, height])

  useEffect(() => {
    const cfg = getCameraConfig('dollhouse', width, depth, height)
    camera.position.set(...cfg.position)
    currentLookAt.current.set(...cfg.target)
    camera.lookAt(currentLookAt.current)
    targetPos.current.set(...cfg.position)
    targetLookAt.current.set(...cfg.target)
  }, [])

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.06)
    currentLookAt.current.lerp(targetLookAt.current, 0.06)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

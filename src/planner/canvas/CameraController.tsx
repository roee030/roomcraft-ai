import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'

const getCfg = (mode: string, w: number, d: number, h: number) => {
  const ht = h * 0.5
  switch (mode) {
    case 'top':     return { pos: [0, h * 4.5, 0.0001] as const, look: [0, 0, 0] as const }
    case 'side-n':  return { pos: [0, ht, d * 0.5 + 5] as const, look: [0, ht, 0] as const }
    case 'side-s':  return { pos: [0, ht, -(d * 0.5 + 5)] as const, look: [0, ht, 0] as const }
    case 'side-e':  return { pos: [w * 0.5 + 5, ht, 0] as const, look: [0, ht, 0] as const }
    case 'side-w':  return { pos: [-(w * 0.5 + 5), ht, 0] as const, look: [0, ht, 0] as const }
    default:        return { pos: [w * 0.8 + 3, h * 2.2 + 3, d * 0.8 + 4] as const, look: [0, ht * 0.4, 0] as const }
  }
}

export const CameraController = () => {
  const controlsRef = useRef<any>(null!)
  const { camera } = useThree()
  const viewMode = useUiStore((s) => s.viewMode)
  const isDragging = useUiStore((s) => s.isDragging)
  const { width, depth, height } = useRoomStore((s) => s.room)

  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const [isAnimating, setIsAnimating] = useState(true)

  // Initial camera placement
  useEffect(() => {
    const cfg = getCfg('dollhouse', width, depth, height)
    camera.position.set(...cfg.pos)
    camera.lookAt(...cfg.look)
  }, [])

  // Animate to preset on view mode change
  useEffect(() => {
    const cfg = getCfg(viewMode, width, depth, height)
    targetPos.current.set(...cfg.pos)
    targetLook.current.set(...cfg.look)
    setIsAnimating(true)
  }, [viewMode, width, depth, height])

  useFrame(() => {
    if (!isAnimating) return
    camera.position.lerp(targetPos.current, 0.09)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.09)
      controlsRef.current.update()
    }
    if (camera.position.distanceTo(targetPos.current) < 0.06) {
      camera.position.copy(targetPos.current)
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLook.current)
        controlsRef.current.update()
      }
      setIsAnimating(false)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isDragging && !isAnimating}
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={28}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2 - 0.03}
      zoomSpeed={0.8}
      rotateSpeed={0.6}
    />
  )
}

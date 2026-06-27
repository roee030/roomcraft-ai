import { useRef } from 'react'
import * as THREE from 'three'
import { useRoomStore } from '../../stores/roomStore'

export const Lights = () => {
  const { width, depth, height } = useRoomStore((s) => s.room)
  const dirRef = useRef<THREE.DirectionalLight>(null!)

  return (
    <>
      <ambientLight intensity={0.6} color="#fff5e6" />
      <directionalLight
        ref={dirRef}
        position={[width * 0.6, height * 2.5, depth * 0.6]}
        intensity={1.4}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <pointLight
        position={[0, height * 0.9, 0]}
        intensity={0.5}
        color="#fffbe6"
        distance={12}
      />
      <pointLight
        position={[-width * 0.4, height * 0.8, -depth * 0.3]}
        intensity={0.3}
        color="#e6f0ff"
        distance={8}
      />
    </>
  )
}

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import { Room } from './Room'
import { FurnitureItem } from './FurnitureItem'
import { Lights } from './Lights'
import { CameraController } from './CameraController'
import { DragController } from './DragController'
import styles from './RoomCanvas.module.css'

export const RoomCanvas = () => {
  const placedItems = useRoomStore((s) => s.placedItems)
  const setIsDragging = useUiStore((s) => s.setIsDragging)
  const setSelected = useUiStore((s) => s.setSelectedInstanceId)

  // Track whether pointerUp ended a real drag (vs a click on empty canvas).
  // Prevents the canvas onClick from deselecting right after every drag release.
  const justDraggedRef = useRef(false)

  const stopDrag = () => {
    const { isDragging } = useUiStore.getState()
    if (isDragging) justDraggedRef.current = true
    setIsDragging(false)
    document.body.style.cursor = ''
  }

  const handleCanvasClick = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return  // drag release — keep selection
    }
    setSelected(null)
  }

  return (
    <div className={styles.canvasWrap}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        onClick={handleCanvasClick}
        style={{ background: '#D6D2CB' }}
      >
        <color attach="background" args={['#D6D2CB']} />
        <fog attach="fog" args={['#D6D2CB', 18, 35]} />
        <Suspense fallback={null}>
          <Lights />
          <CameraController />
          <DragController />
          <Room />
          {placedItems.map((item) => (
            <FurnitureItem key={item.instanceId} instanceId={item.instanceId} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  )
}

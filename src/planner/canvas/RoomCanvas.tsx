import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
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

  const handleCanvasClick = () => setSelected(null)
  const stopDrag = () => setIsDragging(false)

  return (
    <div className={styles.canvasWrap}>
      <Canvas
        shadows
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

import { useRoomStore } from '../../stores/roomStore'

export const FloorGrid = () => {
  const { width, depth } = useRoomStore((s) => s.room)
  return (
    <gridHelper
      args={[Math.max(width, depth) * 1.5, Math.max(width, depth) * 3, '#C8C2B8', '#DDD8D0']}
      position={[0, 0.001, 0]}
    />
  )
}

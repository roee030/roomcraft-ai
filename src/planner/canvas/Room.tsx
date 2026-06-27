import { useRoomStore } from '../../stores/roomStore'
import { FLOOR_MATERIALS } from '../../constants/rooms'
import { useUiStore } from '../../stores/uiStore'

const WALL_THICKNESS = 0.08

const FloorMesh = ({ w, d, floorType }: { w: number; d: number; floorType: string }) => {
  const mat = FLOOR_MATERIALS.find((f) => f.id === floorType) ?? FLOOR_MATERIALS[0]
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={mat.color} roughness={0.65} metalness={0.02} />
    </mesh>
  )
}

const WallMesh = ({
  position,
  rotation,
  size,
  color,
  opacity,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size: [number, number, number]
  color: string
  opacity?: number
}) => (
  <mesh position={position} rotation={rotation} receiveShadow castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      roughness={0.9}
      metalness={0}
      transparent={opacity !== undefined}
      opacity={opacity ?? 1}
    />
  </mesh>
)

export const Room = () => {
  const { width, depth, height, wallColor, floorType } = useRoomStore((s) => s.room)
  const viewMode = useUiStore((s) => s.viewMode)
  const showCeiling = viewMode.startsWith('side')
  const hw = width / 2
  const hd = depth / 2
  const hh = height / 2

  return (
    <group>
      <FloorMesh w={width} d={depth} floorType={floorType} />

      {/* Back wall */}
      <WallMesh
        position={[0, hh, -hd]}
        size={[width + WALL_THICKNESS * 2, height, WALL_THICKNESS]}
        color={wallColor}
      />
      {/* Left wall */}
      <WallMesh
        position={[-hw, hh, 0]}
        size={[WALL_THICKNESS, height, depth]}
        color={wallColor}
      />
      {/* Right wall (slightly transparent so it's visible from inside) */}
      <WallMesh
        position={[hw, hh, 0]}
        size={[WALL_THICKNESS, height, depth]}
        color={wallColor}
        opacity={0.35}
      />
      {/* Front wall */}
      <WallMesh
        position={[0, hh, hd]}
        size={[width + WALL_THICKNESS * 2, height, WALL_THICKNESS]}
        color={wallColor}
        opacity={0.0}
      />

      {/* Ceiling – only in side views */}
      {showCeiling && (
        <WallMesh
          position={[0, height, 0]}
          size={[width, WALL_THICKNESS, depth]}
          color={wallColor}
        />
      )}

      {/* Baseboard trim */}
      <mesh position={[0, 0.06, -hd + 0.01]} castShadow>
        <boxGeometry args={[width, 0.12, 0.018]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.5} />
      </mesh>
      <mesh position={[-hw + 0.01, 0.06, 0]} castShadow>
        <boxGeometry args={[0.018, 0.12, depth]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.5} />
      </mesh>
    </group>
  )
}

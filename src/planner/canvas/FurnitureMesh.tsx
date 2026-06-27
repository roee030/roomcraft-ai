import type { ReactElement } from 'react'
import type { ProductCategory } from '../../types'

interface MeshProps {
  color: string
}

const BedMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.65, 0.26, 2.1]} />
      <meshStandardMaterial color="#C8A96E" roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.46, -1.0]} castShadow>
      <boxGeometry args={[1.65, 0.7, 0.1]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.55, 0.05]} castShadow receiveShadow>
      <boxGeometry args={[1.52, 0.22, 1.88]} />
      <meshStandardMaterial color="#F5F0E8" roughness={0.9} />
    </mesh>
    {[-0.3, 0.3].map((x, i) => (
      <mesh key={i} position={[x, 0.64, -0.72]} castShadow>
        <boxGeometry args={[0.55, 0.14, 0.44]} />
        <meshStandardMaterial color="#FFFBF5" roughness={0.95} />
      </mesh>
    ))}
  </group>
)

const SofaMesh = ({ color }: MeshProps) => (
  <group>
    {/* Base */}
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.35, 0.44, 0.95]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.72, -0.42]} castShadow>
      <boxGeometry args={[2.35, 0.55, 0.14]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
    {/* Arms */}
    {[-1.1, 1.1].map((x, i) => (
      <mesh key={i} position={[x, 0.38, 0]} castShadow>
        <boxGeometry args={[0.14, 0.25, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
    ))}
    {/* Cushions */}
    {[-0.74, 0, 0.74].map((x, i) => (
      <mesh key={i} position={[x, 0.49, 0.06]} castShadow>
        <boxGeometry args={[0.7, 0.18, 0.72]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
    ))}
    {/* Legs */}
    {[[-1.05, -0.38], [-1.05, 0.38], [1.05, -0.38], [1.05, 0.38]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.05, z]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
        <meshStandardMaterial color="#C8A96E" roughness={0.4} metalness={0.1} />
      </mesh>
    ))}
  </group>
)

const ArmchairMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.88, 0.4, 0.82]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
    <mesh position={[0, 0.62, -0.36]} castShadow>
      <boxGeometry args={[0.88, 0.48, 0.12]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
    {[-0.42, 0.42].map((x, i) => (
      <mesh key={i} position={[x, 0.32, 0]} castShadow>
        <boxGeometry args={[0.1, 0.22, 0.82]} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
    ))}
    {[[-0.38, -0.35], [-0.38, 0.35], [0.38, -0.35], [0.38, 0.35]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.05, z]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <meshStandardMaterial color="#C8A96E" roughness={0.4} />
      </mesh>
    ))}
  </group>
)

const CoffeeTableMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.43, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.25, 0.06, 0.65]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.3} />
    </mesh>
    {/* Lower shelf */}
    <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.1, 0.04, 0.52]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.3} />
    </mesh>
    {[[-0.56, -0.28], [-0.56, 0.28], [0.56, -0.28], [0.56, 0.28]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.22, z]} castShadow>
        <boxGeometry args={[0.03, 0.44, 0.03]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
    ))}
  </group>
)

const DresserMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.02, 1.2, 0.52]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    {/* Drawer dividers */}
    {[0.1, 0.3, 0.5, 0.7, 0.9, 1.1].map((y, i) => (
      <mesh key={i} position={[0, y, 0.265]} castShadow>
        <boxGeometry args={[0.96, 0.015, 0.01]} />
        <meshStandardMaterial color="#E0DDD8" roughness={0.5} />
      </mesh>
    ))}
    {/* Handles */}
    {[0.2, 0.6, 1.0].map((y, i) =>
      [-0.25, 0.25].map((x, j) => (
        <mesh key={`${i}-${j}`} position={[x, y, 0.275]} castShadow>
          <boxGeometry args={[0.08, 0.018, 0.018]} />
          <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.8} />
        </mesh>
      ))
    )}
    {[[-0.46, -0.22], [-0.46, 0.22], [0.46, -0.22], [0.46, 0.22]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.04, z]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    ))}
  </group>
)

const NightstandMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.52, 0.62, 0.42]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.32, 0.215]} castShadow>
      <boxGeometry args={[0.06, 0.018, 0.018]} />
      <meshStandardMaterial color="#C9A84C" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Marble top */}
    <mesh position={[0, 0.635, 0]} castShadow>
      <boxGeometry args={[0.54, 0.025, 0.44]} />
      <meshStandardMaterial color="#E8E4DE" roughness={0.2} metalness={0.05} />
    </mesh>
  </group>
)

const ShelfMesh = ({ color }: MeshProps) => (
  <group>
    {/* Frame */}
    <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.02, 2.02, 0.32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} wireframe={false} />
    </mesh>
    {/* Back */}
    <mesh position={[0, 1.0, 0.15]} castShadow>
      <boxGeometry args={[0.98, 1.98, 0.018]} />
      <meshStandardMaterial color="#1A1A1A" roughness={0.4} />
    </mesh>
    {/* Shelves */}
    {[0.2, 0.6, 1.0, 1.4, 1.8].map((y, i) => (
      <mesh key={i} position={[0, y, 0]} receiveShadow>
        <boxGeometry args={[0.96, 0.025, 0.28]} />
        <meshStandardMaterial color="#C8A96E" roughness={0.5} />
      </mesh>
    ))}
  </group>
)

const TvUnitMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.85, 0.52, 0.45]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    {/* Door lines */}
    {[-0.46, 0.46].map((x, i) => (
      <mesh key={i} position={[x, 0.28, 0.228]}>
        <boxGeometry args={[0.82, 0.48, 0.01]} />
        <meshStandardMaterial color="#E0DDD8" roughness={0.5} />
      </mesh>
    ))}
    {[[-0.82, -0.18], [-0.82, 0.18], [0.82, -0.18], [0.82, 0.18]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.06, z]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color="#C8A96E" roughness={0.3} metalness={0.2} />
      </mesh>
    ))}
  </group>
)

const FloorLampMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.025, 0]} castShadow>
      <cylinderGeometry args={[0.14, 0.17, 0.05, 16]} />
      <meshStandardMaterial color="#2C2C2C" roughness={0.3} metalness={0.5} />
    </mesh>
    <mesh position={[0, 0.88, 0]} castShadow>
      <cylinderGeometry args={[0.016, 0.016, 1.7, 8]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
    </mesh>
    <mesh position={[0, 1.78, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.22, 0.35, 16]} />
      <meshStandardMaterial color="#F5F0E8" roughness={0.9} side={2} />
    </mesh>
  </group>
)

const TableLampMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.08, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.09, 0.16, 14]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.22, 0]} castShadow>
      <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
    <mesh position={[0, 0.42, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.14, 0.25, 14]} />
      <meshStandardMaterial color="#F5F0E8" roughness={0.9} side={2} />
    </mesh>
  </group>
)

const RugMesh = ({ color }: MeshProps) => (
  <mesh position={[0, 0.005, 0]} receiveShadow>
    <boxGeometry args={[2.05, 0.014, 3.05]} />
    <meshStandardMaterial color={color} roughness={0.98} />
  </mesh>
)

const DeskMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.755, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.45, 0.045, 0.68]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    {[[-0.66, -0.29], [-0.66, 0.29], [0.66, -0.29], [0.66, 0.29]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]} castShadow>
        <boxGeometry args={[0.045, 0.73, 0.045]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.3} metalness={0.4} />
      </mesh>
    ))}
  </group>
)

const OfficechairMesh = ({ color }: MeshProps) => (
  <group>
    {/* Seat */}
    <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.58, 0.08, 0.56]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.88, -0.22]} castShadow>
      <boxGeometry args={[0.58, 0.72, 0.07]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
    {/* Gas lift */}
    <mesh position={[0, 0.26, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.035, 0.5, 8]} />
      <meshStandardMaterial color="#888" roughness={0.2} metalness={0.7} />
    </mesh>
    {/* Star base */}
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh
        key={i}
        position={[
          Math.cos((i * Math.PI * 2) / 5) * 0.26,
          0.04,
          Math.sin((i * Math.PI * 2) / 5) * 0.26,
        ]}
        castShadow
      >
        <boxGeometry args={[0.26, 0.025, 0.04]} />
        <meshStandardMaterial color="#555" roughness={0.2} metalness={0.8} />
      </mesh>
    ))}
  </group>
)

const DiningTableMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.62, 0.62, 0.045, 48]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 0.74, 16]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.03, 0]} castShadow>
      <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  </group>
)

const DiningChairMesh = ({ color }: MeshProps) => (
  <group>
    <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.48, 0.06, 0.46]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.78, -0.18]} castShadow>
      <boxGeometry args={[0.46, 0.62, 0.06]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    {[[-0.2, -0.18], [-0.2, 0.18], [0.2, -0.18], [0.2, 0.18]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.23, z]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.46, 8]} />
        <meshStandardMaterial color="#C8A96E" roughness={0.4} />
      </mesh>
    ))}
  </group>
)

const MESH_MAP: Partial<Record<ProductCategory, (props: MeshProps) => ReactElement>> = {
  bed: BedMesh,
  sofa: SofaMesh,
  armchair: ArmchairMesh,
  'coffee-table': CoffeeTableMesh,
  dresser: DresserMesh,
  nightstand: NightstandMesh,
  shelf: ShelfMesh,
  'tv-unit': TvUnitMesh,
  'lamp-floor': FloorLampMesh,
  'lamp-table': TableLampMesh,
  rug: RugMesh,
  desk: DeskMesh,
  'office-chair': OfficechairMesh,
  'dining-table': DiningTableMesh,
  'dining-chair': DiningChairMesh,
}

interface FurnitureMeshProps {
  category: ProductCategory
  color: string
}

export const FurnitureMesh = ({ category, color }: FurnitureMeshProps) => {
  const Comp = MESH_MAP[category]
  if (!Comp) return null
  return <Comp color={color} />
}

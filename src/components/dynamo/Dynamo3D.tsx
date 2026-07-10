'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export interface DynamoPartsVisibility {
  housing: boolean
  magnets: boolean
  armature: boolean
  windings: boolean
  commutator: boolean
  brushes: boolean
  shaft: boolean
  bearings: boolean
  terminals: boolean
}

export interface DynamoLabels {
  housing: boolean
  magnets: boolean
  armature: boolean
  windings: boolean
  commutator: boolean
  brushes: boolean
  shaft: boolean
  bearings: boolean
  terminals: boolean
}

interface Dynamo3DProps {
  rotationSpeed: number // rad/s
  isGenerating: boolean
  visible: DynamoPartsVisibility
  labels: DynamoLabels
  explode: number // 0 = assembled, 1 = fully exploded
}

// ---------- Materials ----------
function useMaterials() {
  return useMemo(() => {
    // Classic industrial dark teal/green paint (like old DC machines)
    const housingPaint = new THREE.MeshStandardMaterial({
      color: '#1d3a3d',
      metalness: 0.45,
      roughness: 0.55,
    })
    // Lighter teal for end bells
    const endBellPaint = new THREE.MeshStandardMaterial({
      color: '#264747',
      metalness: 0.5,
      roughness: 0.5,
    })
    // Cut surface - shows the iron/steel of the housing wall (lighter gray)
    const cutSurface = new THREE.MeshStandardMaterial({
      color: '#6a6e74',
      metalness: 0.85,
      roughness: 0.4,
    })
    // Cast iron base
    const castIron = new THREE.MeshStandardMaterial({
      color: '#252a30',
      metalness: 0.7,
      roughness: 0.65,
    })
    // Polished steel shaft
    const steel = new THREE.MeshStandardMaterial({
      color: '#d8dde2',
      metalness: 0.95,
      roughness: 0.18,
    })
    // Dark steel for inside parts
    const darkSteel = new THREE.MeshStandardMaterial({
      color: '#3a3f47',
      metalness: 0.85,
      roughness: 0.45,
    })
    // Armature laminated core - dull steel
    const armatureCore = new THREE.MeshStandardMaterial({
      color: '#5a6068',
      metalness: 0.9,
      roughness: 0.4,
    })
    // Copper windings - dull (with varnish coating look)
    const copper = new THREE.MeshStandardMaterial({
      color: '#9c5a26',
      metalness: 0.7,
      roughness: 0.5,
    })
    // Copper bright (commutator bars, polished)
    const copperBright = new THREE.MeshStandardMaterial({
      color: '#d4823a',
      metalness: 0.9,
      roughness: 0.3,
      emissive: '#3a1d08',
      emissiveIntensity: 0.15,
    })
    // Copper glowing when generating
    const copperGlowing = new THREE.MeshStandardMaterial({
      color: '#ffb060',
      metalness: 0.6,
      roughness: 0.25,
      emissive: '#ff7a1a',
      emissiveIntensity: 0.85,
    })
    // North pole magnet - red
    const northPole = new THREE.MeshStandardMaterial({
      color: '#a83020',
      metalness: 0.35,
      roughness: 0.65,
      emissive: '#3a1008',
      emissiveIntensity: 0.2,
    })
    // South pole magnet - blue
    const southPole = new THREE.MeshStandardMaterial({
      color: '#1a4a8a',
      metalness: 0.35,
      roughness: 0.65,
      emissive: '#0a1838',
      emissiveIntensity: 0.2,
    })
    // Carbon brushes
    const carbon = new THREE.MeshStandardMaterial({
      color: '#15171a',
      metalness: 0.25,
      roughness: 0.88,
    })
    // Brass for bearings, terminals
    const brass = new THREE.MeshStandardMaterial({
      color: '#b89030',
      metalness: 0.9,
      roughness: 0.35,
    })
    // Black insulation
    const insulation = new THREE.MeshStandardMaterial({
      color: '#0e0f12',
      metalness: 0.1,
      roughness: 0.92,
    })
    // Red terminal
    const redTerm = new THREE.MeshStandardMaterial({
      color: '#9c1a20',
      metalness: 0.3,
      roughness: 0.5,
      emissive: '#2a080a',
      emissiveIntensity: 0.25,
    })
    // Black terminal
    const blackTerm = new THREE.MeshStandardMaterial({
      color: '#080a0c',
      metalness: 0.3,
      roughness: 0.6,
    })
    // Bolt heads (dark steel)
    const bolt = new THREE.MeshStandardMaterial({
      color: '#3a3f47',
      metalness: 0.85,
      roughness: 0.4,
    })
    // Label plate
    const labelPlate = new THREE.MeshStandardMaterial({
      color: '#c9b878',
      metalness: 0.6,
      roughness: 0.45,
    })
    return {
      housingPaint,
      endBellPaint,
      cutSurface,
      castIron,
      steel,
      darkSteel,
      armatureCore,
      copper,
      copperBright,
      copperGlowing,
      northPole,
      southPole,
      carbon,
      brass,
      insulation,
      redTerm,
      blackTerm,
      bolt,
      labelPlate,
    }
  }, [])
}

// ---------- Labels ----------
function Label({ position, visible, text, color }: { position: [number, number, number]; visible: boolean; text: string; color?: string }) {
  if (!visible) return null
  return (
    <Html position={position} center distanceFactor={9} zIndexRange={[20, 0]}>
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.94)',
          color: color || '#fbbf24',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: `1px solid ${color || '#fbbf24'}66`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backdropFilter: 'blur(4px)',
        }}
      >
        {text}
      </div>
    </Html>
  )
}

// ---------- Bolt head helper ----------
function BoltHead({ position, rotation, size = 0.1, material }: { position: [number, number, number]; rotation?: [number, number, number]; size?: number; material: THREE.Material }) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow>
      <cylinderGeometry args={[size, size, 0.06, 6]} />
    </mesh>
  )
}

// ---------- Component ----------
export default function Dynamo3D({ rotationSpeed, isGenerating, visible, labels, explode }: Dynamo3DProps) {
  const rotorRef = useRef<THREE.Group>(null)
  const mats = useMaterials()

  // Animate rotor rotation
  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += rotationSpeed * delta
    }
  })

  const ex = explode
  // Cutaway configuration: 270° shell, 90° open on the front
  const CUT_START = Math.PI * 0.15 // start angle
  const CUT_LENGTH = Math.PI * 2.5 // 270° shell

  return (
    <group rotation={[0, Math.PI / 7, 0]} position={[0, 0, 0]}>
      {/* ====================== HOUSING ASSEMBLY ====================== */}
      {visible.housing && (
        <group position={[0, 0, ex * 2.2]}>

          {/* ----- Main housing body (cutaway cylinder) ----- */}
          {/* Outer shell - 270° arc */}
          <mesh castShadow receiveShadow material={mats.housingPaint}>
            <cylinderGeometry args={[1.55, 1.55, 3.2, 96, 1, false, CUT_START, CUT_LENGTH]} />
          </mesh>
          {/* Inner shell showing wall thickness on the cut surface */}
          <mesh castShadow material={mats.cutSurface}>
            <cylinderGeometry args={[1.45, 1.45, 3.2, 96, 1, false, CUT_START, CUT_LENGTH]} />
          </mesh>
          {/* Two cut faces (flat planes at start and end of arc) */}
          <mesh
            position={[0, 0, 0]}
            rotation={[0, 0, CUT_START + Math.PI / 2]}
            material={mats.cutSurface}
            castShadow
          >
            <planeGeometry args={[3.2, 0.1]} />
          </mesh>
          <mesh
            position={[0, 0, 0]}
            rotation={[0, 0, CUT_START + CUT_LENGTH + Math.PI / 2]}
            material={mats.cutSurface}
            castShadow
          >
            <planeGeometry args={[3.2, 0.1]} />
          </mesh>

          {/* Cooling fins - external radial fins along the body */}
          {Array.from({ length: 22 }).map((_, i) => {
            const x = -1.5 + i * 0.14
            return (
              <mesh
                key={`fin-${i}`}
                position={[x, 0, 0]}
                rotation={[0, 0, 0]}
                material={mats.housingPaint}
                castShadow
              >
                {/* Fin as a thin ring with cutaway */}
                <cylinderGeometry args={[1.62, 1.62, 0.04, 96, 1, false, CUT_START, CUT_LENGTH]} />
              </mesh>
            )
          })}

          {/* Top label plate */}
          <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.labelPlate} castShadow>
            <boxGeometry args={[0.9, 0.02, 0.5]} />
          </mesh>

          {/* ===== Left End Bell (nắp bell trái) ===== */}
          <group position={[-1.6, 0, 0]}>
            {/* Bell-shaped end cap */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.endBellPaint}>
              <cylinderGeometry args={[1.62, 1.55, 0.35, 96]} />
            </mesh>
            {/* Recessed center */}
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.endBellPaint}>
              <cylinderGeometry args={[0.7, 0.85, 0.15, 64]} />
            </mesh>
            {/* Bearing boss */}
            <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
              <cylinderGeometry args={[0.5, 0.5, 0.4, 48]} />
            </mesh>
            {/* Bolt circle - 8 bolts around end bell */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const r = 1.25
              return (
                <BoltHead
                  key={`lb-${i}`}
                  position={[-0.2, Math.sin(angle) * r, Math.cos(angle) * r]}
                  rotation={[0, 0, 0]}
                  size={0.1}
                  material={mats.bolt}
                />
              )
            })}
          </group>

          {/* ===== Right End Bell (nắp bell phải - có cửa sổ chổi than) ===== */}
          <group position={[1.6, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.endBellPaint}>
              <cylinderGeometry args={[1.62, 1.55, 0.35, 96]} />
            </mesh>
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.endBellPaint}>
              <cylinderGeometry args={[0.7, 0.85, 0.15, 64]} />
            </mesh>
            <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
              <cylinderGeometry args={[0.5, 0.5, 0.4, 48]} />
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const r = 1.25
              return (
                <BoltHead
                  key={`rb-${i}`}
                  position={[0.2, Math.sin(angle) * r, Math.cos(angle) * r]}
                  rotation={[0, 0, 0]}
                  size={0.1}
                  material={mats.bolt}
                />
              )
            })}
            {/* Brush access cover (small rectangular plate on top) */}
            <mesh position={[0, 1.4, 0]} castShadow material={mats.darkSteel}>
              <boxGeometry args={[0.4, 0.1, 0.5]} />
            </mesh>
            <BoltHead position={[0, 1.45, 0.18]} size={0.04} material={mats.bolt} />
            <BoltHead position={[0, 1.45, -0.18]} size={0.04} material={mats.bolt} />
          </group>

          {/* ===== Through-bolts (4 long bolts connecting end bells) ===== */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
            const r = 1.4
            // Only show bolts that aren't in the cutaway section
            const inCutSection = angle > CUT_START && angle < CUT_START + CUT_LENGTH
            if (!inCutSection) return null
            return (
              <mesh
                key={`tb-${i}`}
                position={[0, Math.sin(angle) * r, Math.cos(angle) * r]}
                rotation={[0, 0, Math.PI / 2]}
                material={mats.bolt}
                castShadow
              >
                <cylinderGeometry args={[0.06, 0.06, 3.5, 12]} />
              </mesh>
            )
          })}

          {/* ===== Terminal Box (Hộp cực trên nóc) ===== */}
          <group position={[0.4, 1.7, 0]}>
            {/* Box body */}
            <mesh castShadow material={mats.endBellPaint}>
              <boxGeometry args={[0.9, 0.5, 0.7]} />
            </mesh>
            {/* Box lid (slightly raised) */}
            <mesh position={[0, 0.27, 0]} castShadow material={mats.housingPaint}>
              <boxGeometry args={[0.95, 0.06, 0.75]} />
            </mesh>
            {/* Lid bolts (4 corners) */}
            {[
              [0.4, 0.3, 0.3], [-0.4, 0.3, 0.3], [0.4, 0.3, -0.3], [-0.4, 0.3, -0.3]
            ].map(([x, y, z], i) => (
              <BoltHead key={`tbx-${i}`} position={[x, y, z]} size={0.05} material={mats.bolt} />
            ))}
            {/* Two cable glands exiting the box (going up) */}
            <mesh position={[0.2, 0.4, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.08, 0.1, 0.18, 16]} />
            </mesh>
            <mesh position={[-0.2, 0.4, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.08, 0.1, 0.18, 16]} />
            </mesh>
          </group>

          {/* ===== Cast Iron Base / Feet ===== */}
          <group position={[0, -1.65, 0]}>
            {/* Main base plate */}
            <mesh castShadow receiveShadow material={mats.castIron}>
              <boxGeometry args={[4.2, 0.3, 1.8]} />
            </mesh>
            {/* Side rails */}
            <mesh position={[0, 0.2, 0.85]} castShadow material={mats.castIron}>
              <boxGeometry args={[4.2, 0.4, 0.15]} />
            </mesh>
            <mesh position={[0, 0.2, -0.85]} castShadow material={mats.castIron}>
              <boxGeometry args={[4.2, 0.4, 0.15]} />
            </mesh>
            {/* Mounting bolt holes (4 corners) */}
            {[
              [-1.8, -0.1, 0.7], [1.8, -0.1, 0.7], [-1.8, -0.1, -0.7], [1.8, -0.1, -0.7]
            ].map(([x, y, z], i) => (
              <group key={`mh-${i}`} position={[x, y, z]}>
                <mesh material={mats.bolt} castShadow>
                  <cylinderGeometry args={[0.14, 0.14, 0.1, 6]} />
                </mesh>
                <mesh position={[0, 0.07, 0]} material={mats.bolt} castShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.05, 6]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* ===== Manufacturer label on side ===== */}
          <mesh position={[-0.5, 1.05, 1.42]} rotation={[0, 0, 0]} material={mats.labelPlate} castShadow>
            <boxGeometry args={[0.5, 0.3, 0.01]} />
          </mesh>

          <Label position={[0, 2.2, 0]} visible={labels.housing} text="Vỏ ngoài (Stator housing)" color="#94a3b8" />
        </group>
      )}

      {/* ====================== MAGNETS (Nam châm vĩnh cửu - gắn trong vỏ) ====================== */}
      {visible.magnets && (
        <group position={[0, 0, ex * 1.5]}>
          {/* North pole magnet (top inside) - curved shoe shape */}
          <mesh position={[0, 0.95, 0]} castShadow material={mats.northPole}>
            <cylinderGeometry args={[1.45, 1.45, 2.4, 64, 1, false, Math.PI * 0.35, Math.PI * 0.3]} />
          </mesh>
          {/* Inner curve of N magnet */}
          <mesh position={[0, 0.95, 0]} castShadow material={mats.northPole}>
            <cylinderGeometry args={[1.15, 1.15, 2.4, 64, 1, false, Math.PI * 0.35, Math.PI * 0.3]} />
          </mesh>
          {/* N label */}
          <mesh position={[-0.4, 1.35, 0.9]} rotation={[0, -0.4, 0]} material={mats.labelPlate} castShadow>
            <boxGeometry args={[0.25, 0.04, 0.25]} />
          </mesh>

          {/* South pole magnet (bottom inside) */}
          <mesh position={[0, -0.95, 0]} castShadow material={mats.southPole}>
            <cylinderGeometry args={[1.45, 1.45, 2.4, 64, 1, false, Math.PI * 1.35, Math.PI * 0.3]} />
          </mesh>
          <mesh position={[0, -0.95, 0]} castShadow material={mats.southPole}>
            <cylinderGeometry args={[1.15, 1.15, 2.4, 64, 1, false, Math.PI * 1.35, Math.PI * 0.3]} />
          </mesh>
          {/* S label */}
          <mesh position={[-0.4, -1.35, 0.9]} rotation={[0, -0.4, 0]} material={mats.labelPlate} castShadow>
            <boxGeometry args={[0.25, 0.04, 0.25]} />
          </mesh>

          <Label position={[1.0, 1.4, 0.7]} visible={labels.magnets} text="Nam châm cực N" color="#f87171" />
          <Label position={[1.0, -1.4, 0.7]} visible={labels.magnets} text="Nam châm cực S" color="#60a5fa" />
        </group>
      )}

      {/* ====================== ROTOR ASSEMBLY (rotates together) ====================== */}
      <group ref={rotorRef}>
        {/* ---------- Shaft ---------- */}
        {visible.shaft && (
          <group>
            {/* Main shaft */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.18, 0.18, 5.0, 32]} />
            </mesh>
            {/* Shaft shoulders */}
            <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
            </mesh>
            <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
            </mesh>
            {/* Shaft key (then chìa) */}
            <mesh position={[-2.4, 0.18, 0]} castShadow material={mats.darkSteel}>
              <boxGeometry args={[0.4, 0.05, 0.08]} />
            </mesh>

            {/* Drive pulley (bánh đai) on left end */}
            <group position={[-2.6, 0, 0]}>
              {/* Pulley hub */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
                <cylinderGeometry args={[0.35, 0.35, 0.4, 32]} />
              </mesh>
              {/* Pulley main wheel */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
                <cylinderGeometry args={[0.8, 0.8, 0.18, 48]} />
              </mesh>
              {/* Pulley V-groove edges */}
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
                <cylinderGeometry args={[0.85, 0.85, 0.04, 48]} />
              </mesh>
              <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
                <cylinderGeometry args={[0.85, 0.85, 0.04, 48]} />
              </mesh>
              <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
                <cylinderGeometry args={[0.85, 0.85, 0.04, 48]} />
              </mesh>
              {/* Keyway */}
              <mesh position={[0, 0.3, 0]} castShadow material={mats.darkSteel}>
                <boxGeometry args={[0.4, 0.08, 0.1]} />
              </mesh>
            </group>

            <Label position={[-2.6, 1.05, 0]} visible={labels.shaft} text="Trục + Bánh đai (Shaft)" color="#cbd5e1" />
          </group>
        )}

        {/* ---------- Armature core ---------- */}
        {visible.armature && (
          <group>
            {/* Main armature body */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.armatureCore}>
              <cylinderGeometry args={[0.85, 0.85, 2.0, 48]} />
            </mesh>
            {/* Lamination rings - dense stack of thin rings */}
            {Array.from({ length: 21 }).map((_, i) => (
              <mesh
                key={`lam-${i}`}
                position={[-0.95 + i * 0.095, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
                material={mats.darkSteel}
              >
                <torusGeometry args={[0.85, 0.015, 6, 48]} />
              </mesh>
            ))}
            {/* Armature slots (dark grooves) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <mesh
                  key={`slot-${i}`}
                  position={[0, Math.sin(angle) * 0.78, Math.cos(angle) * 0.78]}
                  rotation={[0, -angle, 0]}
                  material={mats.insulation}
                >
                  <boxGeometry args={[2.0, 0.16, 0.22]} />
                </mesh>
              )
            })}
            {/* End winding retention rings */}
            <mesh position={[-1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
              <cylinderGeometry args={[0.88, 0.88, 0.06, 48]} />
            </mesh>
            <mesh position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.darkSteel}>
              <cylinderGeometry args={[0.88, 0.88, 0.06, 48]} />
            </mesh>

            <Label position={[0, 0, 1.25]} visible={labels.armature} text="Lõi rô-to (Armature core)" color="#cbd5e1" />
          </group>
        )}

        {/* ---------- Copper Windings ---------- */}
        {visible.windings && (
          <group>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              const y = Math.sin(angle) * 0.92
              const z = Math.cos(angle) * 0.92
              return (
                <group key={`wind-${i}`} position={[0, y, z]} rotation={[0, -angle, 0]}>
                  {/* Multiple coil rings along the slot to look like a real coil bundle */}
                  {Array.from({ length: 7 }).map((_, j) => (
                    <mesh key={`coil-${i}-${j}`} position={[-0.85 + j * 0.28, 0, 0]}>
                      <torusGeometry args={[0.16, 0.06, 8, 24]} />
                      <meshStandardMaterial
                        color={isGenerating ? '#ffc878' : '#9c5a26'}
                        metalness={0.75}
                        roughness={0.4}
                        emissive={isGenerating ? '#ff7a1a' : '#000000'}
                        emissiveIntensity={isGenerating ? 0.85 : 0}
                      />
                    </mesh>
                  ))}
                  {/* End winding loop (connects to commutator) */}
                  <mesh position={[1.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.18, 0.05, 8, 24, Math.PI]} />
                    <meshStandardMaterial
                      color={isGenerating ? '#ffc878' : '#9c5a26'}
                      metalness={0.75}
                      roughness={0.4}
                      emissive={isGenerating ? '#ff7a1a' : '#000000'}
                      emissiveIntensity={isGenerating ? 0.7 : 0}
                    />
                  </mesh>
                </group>
              )
            })}
            <Label position={[1.0, 0.7, 1.0]} visible={labels.windings} text="Cuộn dây đồng (Windings)" color="#fbbf24" />
          </group>
        )}

        {/* ---------- Commutator (Cổ góp) ---------- */}
        {visible.commutator && (
          <group position={[1.25, 0, 0]}>
            {/* Insulation base cylinder */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.insulation}>
              <cylinderGeometry args={[0.42, 0.42, 0.7, 32]} />
            </mesh>
            {/* Commutator segments (12 copper bars) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <mesh
                  key={`comm-${i}`}
                  position={[0, Math.sin(angle) * 0.43, Math.cos(angle) * 0.43]}
                  rotation={[0, -angle, 0]}
                  castShadow
                  material={isGenerating ? mats.copperGlowing : mats.copperBright}
                >
                  <boxGeometry args={[0.72, 0.06, 0.18]} />
                </mesh>
              )
            })}
            {/* End insulation ring */}
            <mesh position={[0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.insulation}>
              <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
            </mesh>
            <Label position={[0, 0.85, 0]} visible={labels.commutator} text="Cổ góp (Commutator)" color="#fbbf24" />
          </group>
        )}
      </group>

      {/* ====================== BRUSHES (Chổi than - tĩnh) ====================== */}
      {visible.brushes && (
        <group position={[1.25 + ex * 0.7, 0, 0]}>
          {/* Top brush holder assembly */}
          <group position={[0, 0.55, 0]}>
            {/* Brush holder box */}
            <mesh castShadow material={mats.darkSteel}>
              <boxGeometry args={[0.42, 0.35, 0.32]} />
            </mesh>
            {/* Carbon brush (inside) */}
            <mesh position={[0, -0.18, 0]} castShadow material={mats.carbon}>
              <boxGeometry args={[0.32, 0.35, 0.26]} />
            </mesh>
            {/* Spring cap */}
            <mesh position={[0, 0.25, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            </mesh>
            {/* Brush pigtail (copper wire) */}
            <mesh position={[0.25, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow material={mats.copper}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
            </mesh>
          </group>

          {/* Bottom brush holder assembly */}
          <group position={[0, -0.55, 0]}>
            <mesh castShadow material={mats.darkSteel}>
              <boxGeometry args={[0.42, 0.35, 0.32]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow material={mats.carbon}>
              <boxGeometry args={[0.32, 0.35, 0.26]} />
            </mesh>
            <mesh position={[0, -0.25, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            </mesh>
            <mesh position={[0.25, -0.3, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow material={mats.copper}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
            </mesh>
          </group>

          <Label position={[-0.5, 1.0, 0.3]} visible={labels.brushes} text="Chổi than + Lò xo (Brush)" color="#cbd5e1" />
        </group>
      )}

      {/* ====================== BEARINGS (Vòng bi - tĩnh) ====================== */}
      {visible.bearings && (
        <>
          {/* Left bearing */}
          <group position={[-1.55 - ex * 0.4, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.45, 0.45, 0.22, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.22, 0.22, 0.26, 32]} />
            </mesh>
            {/* Bearing balls */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <mesh key={`b1-${i}`} position={[0, Math.sin(angle) * 0.32, Math.cos(angle) * 0.32]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.18} />
                </mesh>
              )
            })}
          </group>
          {/* Right bearing */}
          <group position={[1.55 + ex * 0.4, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.45, 0.45, 0.22, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.steel}>
              <cylinderGeometry args={[0.22, 0.22, 0.26, 32]} />
            </mesh>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <mesh key={`b2-${i}`} position={[0, Math.sin(angle) * 0.32, Math.cos(angle) * 0.32]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.18} />
                </mesh>
              )
            })}
          </group>
          <Label position={[-1.55, 0.75, 0.45]} visible={labels.bearings} text="Vòng bi (Bearing)" color="#fcd34d" />
        </>
      )}

      {/* ====================== TERMINALS (Cực đầu ra - trong hộp cực) ====================== */}
      {visible.terminals && (
        <group position={[0.4 + ex * 0.2, 1.95, 0]}>
          {/* Positive terminal post */}
          <group position={[0.2, 0, 0]}>
            <mesh castShadow material={mats.redTerm}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow material={mats.redTerm}>
              <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
            </mesh>
            {/* Nut on top */}
            <mesh position={[0, 0.23, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.13, 0.13, 0.05, 6]} />
            </mesh>
            {/* Plus sign marker */}
            <mesh position={[0.18, 0.18, 0]}>
              <boxGeometry args={[0.04, 0.16, 0.04]} />
              <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0.18, 0.18, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.16]} />
              <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.4} />
            </mesh>
          </group>

          {/* Negative terminal post */}
          <group position={[-0.2, 0, 0]}>
            <mesh castShadow material={mats.blackTerm}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow material={mats.blackTerm}>
              <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
            </mesh>
            <mesh position={[0, 0.23, 0]} castShadow material={mats.brass}>
              <cylinderGeometry args={[0.13, 0.13, 0.05, 6]} />
            </mesh>
            <mesh position={[-0.18, 0.18, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.16]} />
              <meshStandardMaterial color="#e5e7eb" emissive="#e5e7eb" emissiveIntensity={0.4} />
            </mesh>
          </group>

          <Label position={[0.65, 0.2, 0]} visible={labels.terminals} text="Cực (+)" color="#f87171" />
          <Label position={[-0.65, 0.2, 0]} visible={labels.terminals} text="Cực (-)" color="#cbd5e1" />
        </group>
      )}

      {/* Power flow sparks when generating */}
      {isGenerating && rotationSpeed > 0 && <PowerArcs />}
    </group>
  )
}

// ---------- Power Arcs visual effect ----------
function PowerArcs() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        if (mat) {
          mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 10 + i * 0.7) * 0.4
        }
      })
    }
  })
  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={`arc-${i}`} position={[1.25, Math.sin(angle) * 0.55, Math.cos(angle) * 0.55]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#ffe082" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Motif } from "@/lib/museum-data";

/**
 * Procedural 3D models cho 32 motif hiện vật.
 * Mỗi model là một nhóm mesh dùng primitive THREE — không load file ngoài.
 * Tông màu: kim loại vàng/đồng + phát sáng theo phase accent.
 */

interface ModelProps {
  accent: string;
  spinning?: boolean;
}

const metal = (color: string, emissive = "#000", ei = 0) => ({
  color,
  metalness: 0.85,
  roughness: 0.28,
  emissive,
  emissiveIntensity: ei,
});

const matte = (color: string) => ({
  color,
  metalness: 0.1,
  roughness: 0.8,
});

function Gear({ accent }: ModelProps) {
  const teeth = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0));
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.18, 32]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {teeth.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, 0.09]}>
            <boxGeometry args={[0.18, 0.32, 0.18]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
        ))}
        <mesh>
          <torusGeometry args={[0.35, 0.1, 16, 32]} />
          <meshStandardMaterial {...metal("#8a6a2e")} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.04, 12, 48]} />
        <meshStandardMaterial {...metal(accent, accent, 0.4)} />
      </mesh>
    </group>
  );
}

function SteamEngine({ accent, spinning }: ModelProps) {
  // Animated Watt steam engine — recognizable boiler + cylinder/piston + flywheel + frame
  const flywheelRef = useRef<THREE.Group>(null);
  const crankRef = useRef<THREE.Mesh>(null);
  const pistonRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!spinning) return;
    if (flywheelRef.current) {
      flywheelRef.current.rotation.z += delta * 1.8;
    }
    // crank-piston: flywheel angle → piston x-offset
    const t = flywheelRef.current ? flywheelRef.current.rotation.z : 0;
    const crankX = Math.cos(t) * 0.22;
    const pistonX = -0.95 + Math.cos(t) * 0.22;
    if (crankRef.current) {
      crankRef.current.position.x = 1.55 + crankX;
      crankRef.current.scale.y = 1;
      // orient the connecting rod from crank pin to piston pin
      const dx = pistonX - (1.55 + crankX);
      const dy = 0.55 - 0.55;
      const len = Math.hypot(dx, dy);
      crankRef.current.scale.x = len / 0.9;
      crankRef.current.rotation.z = Math.atan2(dy, dx);
    }
    if (pistonRef.current) {
      pistonRef.current.position.x = pistonX;
    }
    // steam puffs drift
    if (steamRef.current) {
      const arr = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += delta * 0.35;
        arr[i] += Math.sin((arr[i + 2] + arr[i + 1]) * 2) * delta * 0.05;
        if (arr[i + 1] > 1.8) {
          arr[i + 1] = 0.6 + Math.random() * 0.1;
          arr[i] = -1.3 + (Math.random() - 0.5) * 0.2;
          arr[i + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Steam puff particles
  const steamPositions = useMemo(() => {
    const n = 40;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = -1.3 + (Math.random() - 0.5) * 0.2;
      arr[i * 3 + 1] = 0.6 + Math.random() * 1.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return arr;
  }, []);

  const brass = metal("#b8893f");
  const darkBrass = metal("#7a5a2e");
  const copper = metal("#c9762e");
  const iron = metal("#3a2a1a");
  const steel = metal("#9a9a9a");

  return (
    <group rotation={[0, 0, 0.02]}>
      {/* ===== Cast-iron basebed (heavy foundation) ===== */}
      <mesh position={[0, -1.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 0.28, 1.6]} />
        <meshStandardMaterial {...iron} roughness={0.7} />
      </mesh>
      {/* basebed top trim */}
      <mesh position={[0, -0.84, 0]}>
        <boxGeometry args={[4.5, 0.06, 1.7]} />
        <meshStandardMaterial {...metal("#5a4222")} roughness={0.5} />
      </mesh>
      {/* basebed feet */}
      {[-2.0, -0.7, 0.7, 2.0].map((x, i) => (
        <mesh key={i} position={[x, -1.18, 0]} castShadow>
          <boxGeometry args={[0.3, 0.18, 1.4]} />
          <meshStandardMaterial {...iron} roughness={0.7} />
        </mesh>
      ))}

      {/* ===== Horizontal boiler (large riveted cylinder, left side) ===== */}
      <group position={[-1.3, 0.0, 0]}>
        {/* main boiler shell */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 1.8, 48]} />
          <meshStandardMaterial {...metal("#8a6a2e")} roughness={0.45} />
        </mesh>
        {/* front end cap (dome) */}
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.62, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...metal("#9a7a3e")} roughness={0.4} />
        </mesh>
        {/* back end cap */}
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.62, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...metal("#9a7a3e")} roughness={0.4} />
        </mesh>
        {/* rivet rings (3 bands) */}
        {[-0.6, 0, 0.6].map((y, i) => (
          <mesh key={i} position={[y, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.64, 0.025, 8, 48]} />
            <meshStandardMaterial {...metal("#caa05a")} roughness={0.35} />
          </mesh>
        ))}
        {/* rivet bumps along the rings */}
        {[-0.6, 0, 0.6].flatMap((y, ri) =>
          Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <mesh
                key={`${ri}-${i}`}
                position={[y, Math.cos(a) * 0.64, Math.sin(a) * 0.64]}
              >
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial {...metal("#e0c076")} roughness={0.3} />
              </mesh>
            );
          })
        )}
        {/* steam dome (small cylinder on top of boiler) */}
        <mesh position={[0.1, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.3, 24]} />
          <meshStandardMaterial {...copper} roughness={0.35} />
        </mesh>
        <mesh position={[0.1, 0.9, 0]}>
          <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...copper} roughness={0.3} />
        </mesh>
        {/* chimney */}
        <mesh position={[-0.5, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.5, 16]} />
          <meshStandardMaterial {...darkBrass} roughness={0.6} />
        </mesh>
        <mesh position={[-0.5, 1.18, 0]}>
          <cylinderGeometry args={[0.14, 0.13, 0.08, 16]} />
          <meshStandardMaterial {...iron} roughness={0.7} />
        </mesh>
        {/* pressure gauge (small dial on front) */}
        <mesh position={[-0.95, 0.25, 0.45]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
          <meshStandardMaterial {...brass} roughness={0.3} />
        </mesh>
        <mesh position={[-0.98, 0.25, 0.45]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
          <meshStandardMaterial color="#f5e8c8" emissive={accent} emissiveIntensity={0.3} />
        </mesh>
        {/* steam pipe from boiler to cylinder */}
        <mesh position={[0.7, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial {...copper} roughness={0.35} />
        </mesh>
      </group>

      {/* ===== Steam cylinder + piston (right side, vertical) ===== */}
      <group ref={pistonRef} position={[-0.95, 0, 0]}>
        {/* cylinder block */}
        <mesh position={[0, 0.0, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.9, 32]} />
          <meshStandardMaterial {...metal("#6a4a22")} roughness={0.5} />
        </mesh>
        {/* cylinder top cap */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.30, 0.28, 0.12, 32]} />
          <meshStandardMaterial {...brass} roughness={0.35} />
        </mesh>
        {/* cylinder bottom cap (valve chest) */}
        <mesh position={[0, -0.48, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.32, 0.18, 32]} />
          <meshStandardMaterial {...darkBrass} roughness={0.45} />
        </mesh>
        {/* valve chest front plate */}
        <mesh position={[0, -0.48, 0.33]}>
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshStandardMaterial {...brass} roughness={0.3} />
        </mesh>
        {/* piston rod (going up through cylinder) */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial {...steel} roughness={0.2} metalness={0.95} />
        </mesh>
        {/* crosshead (block where rod meets connecting rod) */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.14, 0.22]} />
          <meshStandardMaterial {...darkBrass} roughness={0.4} />
        </mesh>
        {/* crosshead guide rails (two parallel bars) */}
        <mesh position={[0, 0.95, 0.18]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial {...steel} roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, -0.18]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial {...steel} roughness={0.25} metalness={0.9} />
        </mesh>
      </group>

      {/* ===== Connecting rod (from crosshead to crank pin) ===== */}
      <mesh ref={crankRef} position={[1.55, 0.55, 0]}>
        <boxGeometry args={[1.0, 0.07, 0.12]} />
        <meshStandardMaterial {...metal("#d4b06a")} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* ===== Flywheel + crank shaft (far right) ===== */}
      <group position={[1.95, 0.55, 0]}>
        {/* main bearing support (A-frame pillar) */}
        <mesh position={[0, -0.75, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 0.9]} />
          <meshStandardMaterial {...iron} roughness={0.65} />
        </mesh>
        {/* bearing top */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.14, 24]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial {...brass} roughness={0.3} />
        </mesh>
        {/* crank shaft (horizontal axle) */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
          <meshStandardMaterial {...steel} roughness={0.2} metalness={0.95} />
        </mesh>

        {/* flywheel (the big spinning wheel) */}
        <group ref={flywheelRef} position={[0, -0.3, 0]} rotation={[0, 0, 0]}>
          {/* outer rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.55, 0.07, 16, 64]} />
            <meshStandardMaterial {...metal("#8a6a2e", accent, 0.15)} roughness={0.35} />
          </mesh>
          {/* inner hub */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
            <meshStandardMaterial {...brass} roughness={0.3} />
          </mesh>
          {/* spokes (6) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[0, Math.cos(a) * 0.3, Math.sin(a) * 0.3]}
                rotation={[Math.cos(a), 0, 0]}
              >
                <boxGeometry args={[0.14, 0.5, 0.04]} />
                <meshStandardMaterial {...darkBrass} roughness={0.4} />
              </mesh>
            );
          })}
          {/* crank pin (offset, where connecting rod attaches) */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial {...steel} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ===== Governor (Watt's iconic centrifugal governor, top right) ===== */}
      <group position={[1.4, 0.55, 0]}>
        {/* governor central post */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial {...brass} roughness={0.3} />
        </mesh>
        {/* governor top pivot */}
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial {...brass} roughness={0.3} />
        </mesh>
        {/* two balls on arms */}
        {[-1, 1].map((s, i) => (
          <group key={i} position={[0, 0.8, 0]} rotation={[0, 0, s * 0.5]}>
            <mesh position={[s * 0.22, -0.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
              <meshStandardMaterial {...steel} roughness={0.2} />
            </mesh>
            <mesh position={[s * 0.34, -0.18, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial {...metal("#b8893f")} roughness={0.3} metalness={0.85} />
            </mesh>
          </group>
        ))}
        {/* governor base bevel gear */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.08, 16]} />
          <meshStandardMaterial {...darkBrass} roughness={0.45} />
        </mesh>
      </group>

      {/* ===== Steam puffs (animated particles from chimney) ===== */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[steamPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#f5ebd8"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Loom({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.18, 1.6, 0.9]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0.9, 0, 0]}>
        <boxGeometry args={[0.18, 1.6, 0.9]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      {[-0.4, 0, 0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.9, 12]} />
          <meshStandardMaterial {...metal(accent, accent, 0.2)} />
        </mesh>
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -0.35 + i * 0.0875]}>
          <boxGeometry args={[1.9, 0.02, 0.02]} />
          <meshStandardMaterial color="#d4b888" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Locomotive({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.7, 0.7]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      <mesh position={[-0.7, 0.7, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.66]} />
        <meshStandardMaterial {...matte("#4a2f14")} />
      </mesh>
      <mesh position={[0.95, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.4, 24]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[0.5, 0.95, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.4, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      {[0.6, 0, -0.6].map((x, i) => (
        <group key={i} position={[x, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.12, 24]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.18, 0.04, 8, 24]} />
            <meshStandardMaterial {...metal(accent, accent, 0.4)} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CottonGin({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial {...matte("#4a2f14")} />
      </mesh>
      {[-0.3, 0.3].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
          {Array.from({ length: 8 }).map((_, j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0]}>
                <boxGeometry args={[0.04, 0.04, 1.25]} />
                <meshStandardMaterial {...metal(accent, accent, 0.3)} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function PuddlingFurnace({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.4, 0.6, 1.0]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...metal("#5a2a10", accent, 0.6)} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.8, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ff7a2a" emissive="#ff5a1a" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function GasLamp({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.6, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 16]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#fff4c0"
          emissive={accent}
          emissiveIntensity={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.2, 0.18, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <pointLight position={[0, 0.6, 0]} color={accent} intensity={2} distance={4} />
    </group>
  );
}

function ThamesShield({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.12, 16, 32, Math.PI]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      {[-0.5, -0.16, 0.16, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial {...metal(accent, accent, 0.3)} />
        </mesh>
      ))}
    </group>
  );
}

function Bolt({ accent }: ModelProps) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 1.6, 24]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} wireframe />
      </mesh>
      <pointLight color={accent} intensity={1.5} distance={3} />
    </group>
  );
}

function Assembly({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.5]} />
        <meshStandardMaterial {...metal("#5a4222")} />
      </mesh>
      {[-0.7, -0.2, 0.3, 0.8].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.35]} />
          <meshStandardMaterial {...metal(i % 2 ? accent : "#b8893f")} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial {...metal(accent, accent, 0.3)} />
      </mesh>
    </group>
  );
}

function Dynamo({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 32]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.62, 0.04, 8, 32]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.3, 16]} />
        <meshStandardMaterial {...metal(accent, accent, 0.5)} />
      </mesh>
      <pointLight color={accent} intensity={1.2} distance={3} />
    </group>
  );
}

function OttoEngine({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.2, 0.7, 0.7]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      {[0.35, 0, -0.35].map((z, i) => (
        <group key={i} position={[0, 0.35, z]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.5, 16]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
            <meshStandardMaterial {...metal(accent, accent, 0.3)} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.35, 0.06, 12, 32]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
    </group>
  );
}

function Marconi({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 16]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[0, 0.1 + y, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 12]} />
          <meshStandardMaterial {...metal(accent, accent, 0.4)} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.6, 0.01, 8, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.9, 0.01, 8, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} transparent opacity={0.3} />
      </mesh>
      <pointLight color={accent} intensity={1} distance={4} />
    </group>
  );
}

function EdisonMeter({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.0, 1.2, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.2, 0.22]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      {[-0.18, 0, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.27]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshStandardMaterial {...metal(accent, accent, 0.5)} />
        </mesh>
      ))}
      <mesh position={[0, -0.4, 0.22]}>
        <boxGeometry args={[0.5, 0.3, 0.06]} />
        <meshStandardMaterial {...matte("#1a0f08")} />
      </mesh>
    </group>
  );
}

function LightBulb({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#fff8d0"
          emissive={accent}
          emissiveIntensity={0.9}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0}
        />
      </mesh>
      <group position={[0, 0.25, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0]}>
              <torusGeometry args={[0.12, 0.012, 8, 16]} />
              <meshStandardMaterial color="#fff" emissive="#fff5c0" emissiveIntensity={2} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.3, 24]} />
        <meshStandardMaterial {...metal("#9a7a3e")} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.18, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <pointLight position={[0, 0.25, 0]} color={accent} intensity={3} distance={5} />
    </group>
  );
}

function Bulb({ accent }: ModelProps) {
  return <LightBulb accent={accent} />;
}

function Network({ accent }: ModelProps) {
  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const n = 8;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      arr.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * 0.8,
          Math.sin(theta) * Math.sin(phi) * 0.8,
          Math.cos(phi) * 0.8
        )
      );
    }
    return arr;
  }, []);
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Chip({ accent }: ModelProps) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.0, 0.12, 1.0]} />
        <meshStandardMaterial {...metal("#1a1a1a")} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={0.3} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const side = Math.floor(i / 4);
        const t = (i % 4) - 1.5;
        const pos =
          side === 0 ? [0.55, 0, t * 0.22] : side === 1 ? [-0.55, 0, t * 0.22] : side === 2 ? [t * 0.22, 0, 0.55] : [t * 0.22, 0, -0.55];
        return (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.04, 0.04, 0.18]} />
            <meshStandardMaterial {...metal("#caa05a")} />
          </mesh>
        );
      })}
    </group>
  );
}

function Monitor({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.4, 1.0, 0.12]} />
        <meshStandardMaterial {...matte("#1a0f08")} />
      </mesh>
      <mesh position={[0, 0.1, 0.07]}>
        <boxGeometry args={[1.25, 0.85, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.78, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.3]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
    </group>
  );
}

function Upc({ accent }: ModelProps) {
  const widths = [0.04, 0.02, 0.06, 0.03, 0.04, 0.02, 0.05, 0.03, 0.04, 0.06, 0.02, 0.03];
  return (
    <group>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.4, 0.9, 0.02]} />
        <meshStandardMaterial {...matte("#f0ead0")} />
      </mesh>
      {widths.map((w, i) => {
        const x = -0.6 + i * 0.09;
        return (
          <mesh key={i} position={[x, 0, 0.01]}>
            <boxGeometry args={[w, 0.7, 0.01]} />
            <meshStandardMaterial color="#1a0f08" />
          </mesh>
        );
      })}
      <mesh position={[0, -0.55, 0.01]}>
        <boxGeometry args={[0.3, 0.1, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Www({ accent }: ModelProps) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#0a1a2a" emissive={accent} emissiveIntensity={0.3} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color="#0a1422" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.005, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.7, 0.005, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      <pointLight color={accent} intensity={1.2} distance={3} />
    </group>
  );
}

function Phone({ accent }: ModelProps) {
  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <mesh>
        <boxGeometry args={[1.4, 0.35, 0.28]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.8, 0.04, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Gps({ accent }: ModelProps) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[-0.55, 0, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.04]} />
        <meshStandardMaterial color="#1a3a5a" emissive={accent} emissiveIntensity={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.04]} />
        <meshStandardMaterial color="#1a3a5a" emissive={accent} emissiveIntensity={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <pointLight color={accent} intensity={1} distance={3} />
    </group>
  );
}

function Brain({ accent }: ModelProps) {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="#d8b890" roughness={0.6} metalness={0.1} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 0.85;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.7, Math.sin(a * 2) * 0.3]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
          </mesh>
        );
      })}
      <pointLight color={accent} intensity={1} distance={4} />
    </group>
  );
}

function Cloud({ accent }: ModelProps) {
  return (
    <group>
      {[
        [0, 0, 0, 0.5],
        [0.5, -0.1, 0, 0.4],
        [-0.5, -0.05, 0, 0.42],
        [0.2, 0.25, 0, 0.35],
        [-0.2, 0.22, 0, 0.32],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          <meshStandardMaterial color="#e8e0d0" emissive={accent} emissiveIntensity={0.15} roughness={0.8} />
        </mesh>
      ))}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, -0.7, 0]}>
          <boxGeometry args={[0.02, 0.5, 0.02]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

function Printer({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.7]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.15, 0.5]} rotation={[Math.PI / 8, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 12]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0, -0.32, 0.2]}>
        <boxGeometry args={[0.4, 0.06, 0.4]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
      </mesh>
      <pointLight position={[0, 0.2, 0.5]} color={accent} intensity={1} distance={3} />
    </group>
  );
}

function Car({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.4, 0.7]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[-0.1, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.3, 0.65]} />
        <meshStandardMaterial {...metal("#5a3a1a")} />
      </mesh>
      <mesh position={[-0.1, 0.35, 0.33]}>
        <boxGeometry args={[0.7, 0.2, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.3, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial {...metal("#1a0f08")} />
          </mesh>
          <mesh position={[x, -0.3, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial {...metal("#1a0f08")} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.2, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function Smartphone({ accent }: ModelProps) {
  return (
    <group rotation={[0.1, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.7, 1.4, 0.08]} />
        <meshStandardMaterial {...metal("#1a0f08")} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.62, 1.3, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0.045]}>
        <boxGeometry args={[0.15, 0.04, 0.01]} />
        <meshStandardMaterial color="#1a0f08" />
      </mesh>
      <pointLight color={accent} intensity={0.8} distance={2} />
    </group>
  );
}

function Transformer({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial {...metal("#5a4222")} />
      </mesh>
      {[-0.18, 0, 0.18].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25, 0.04, 8, 32]} />
          <meshStandardMaterial {...metal("#caa05a", accent, 0.3)} />
        </mesh>
      ))}
      <pointLight color={accent} intensity={0.8} distance={3} />
    </group>
  );
}

function Rocket({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 24]} />
        <meshStandardMaterial {...metal("#e0e0e0")} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.2, 0.4, 24]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.2, -0.35, Math.sin(a) * 0.2]} rotation={[0, -a, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.18]} />
          <meshStandardMaterial {...metal("#3a2410")} />
        </mesh>
      ))}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.18, 0.5, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, -0.7, 0]} color={accent} intensity={2} distance={4} />
    </group>
  );
}

function Robot({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.4]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[-0.1, 0.6, 0.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.1, 0.6, 0.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.35]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]} rotation={[0, 0, i ? -0.1 : 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial {...metal("#b8893f")} />
        </mesh>
      ))}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.6, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          <meshStandardMaterial {...metal("#5a4222")} />
        </mesh>
      ))}
    </group>
  );
}

function NeuralNet({ accent }: ModelProps) {
  const layers = [4, 6, 6, 3];
  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3; layer: number }[] = [];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * 0.25;
        arr.push({ pos: new THREE.Vector3((li - 1.5) * 0.6, y, 0), layer: li });
      }
    });
    return arr;
  }, []);
  return (
    <group>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
        </mesh>
      ))}
      {nodes.map((n, i) =>
        nodes
          .filter((m) => m.layer === n.layer + 1)
          .map((m, j) => (
            <ConnectionLine key={`${i}-${j}`} from={n.pos} to={m.pos} accent={accent} />
          ))
      )}
      <pointLight color={accent} intensity={1.2} distance={4} />
    </group>
  );
}

function ConnectionLine({ from, to, accent }: { from: THREE.Vector3; to: THREE.Vector3; accent: string }) {
  const { mid, len } = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5);
    const len = from.distanceTo(to);
    return { mid, len };
  }, [from, to]);
  return (
    <mesh position={mid}>
      <boxGeometry args={[0.01, 0.01, len]} />
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} transparent opacity={0.4} />
    </mesh>
  );
}

const MODEL_MAP: Record<Motif, React.FC<ModelProps>> = {
  steam: SteamEngine,
  loom: Loom,
  gear: Gear,
  locomotive: Locomotive,
  "cotton-gin": CottonGin,
  puddling: PuddlingFurnace,
  "gas-lamp": GasLamp,
  "thames-shield": ThamesShield,
  bolt: Bolt,
  assembly: Assembly,
  dynamo: Dynamo,
  otto: OttoEngine,
  marconi: Marconi,
  "edison-meter": EdisonMeter,
  "light-bulb": LightBulb,
  bulb: Bulb,
  network: Network,
  chip: Chip,
  monitor: Monitor,
  upc: Upc,
  www: Www,
  phone: Phone,
  gps: Gps,
  brain: Brain,
  cloud: Cloud,
  printer: Printer,
  car: Car,
  smartphone: Smartphone,
  transformer: Transformer,
  rocket: Rocket,
  robot: Robot,
  "neural-net": NeuralNet,
};

export function ArtifactModel({ motif, accent, spinning }: { motif: Motif; accent: string; spinning?: boolean }) {
  const Cmp = MODEL_MAP[motif] ?? Gear;
  return <Cmp accent={accent} spinning={spinning} />;
}

export function motifHasModel(motif: Motif): boolean {
  return motif in MODEL_MAP;
}

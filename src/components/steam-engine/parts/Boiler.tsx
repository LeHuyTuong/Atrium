"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  makeCastIron,
  makeCopper,
  makeDullBrass,
  makePolishedBrass,
  makeSteel,
} from "./materials";

const BOILER_POS: [number, number, number] = [-5.6, 1.45, 0];

/** Watt-era wagon-top / Cornish boiler with firebox, steam dome, chimney,
 *  furnace door (glowing) and steam take-off pipe. */
export function Boiler({ fireOn = true }: { fireOn?: boolean }) {
  return (
    <group position={BOILER_POS}>
      {/* Barrel (horizontal along Z) */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 2.1, 40]} />
        <primitive object={makeDullBrass()} attach="material" />
      </mesh>

      {/* Domed end caps */}
      <mesh position={[0, 0, 1.05]} castShadow>
        <sphereGeometry args={[0.78, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={makeDullBrass()} attach="material" />
      </mesh>
      <mesh
        position={[0, 0, -1.05]}
        rotation={[Math.PI, 0, 0]}
        castShadow
      >
        <sphereGeometry args={[0.78, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={makeDullBrass()} attach="material" />
      </mesh>

      {/* Riveted reinforcing bands */}
      {[0.55, 0.2, -0.2, -0.55].map((z) => (
        <mesh key={`band-${z}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.785, 0.035, 8, 40]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}

      {/* Rivets (dots) along bands — instanced small spheres */}
      <RivetRing z={0.55} radius={0.79} count={24} />
      <RivetRing z={-0.55} radius={0.79} count={24} />

      {/* Steam dome on top */}
      <group position={[0, 0.78, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.3, 24]} />
          <primitive object={makeDullBrass()} attach="material" />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.26, 24, 16]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      </group>

      {/* Chimney (tall vertical flue) */}
      <group position={[0, 0.7, -0.6]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 2.2, 20]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.18, 0.18, 20]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
      </group>

      {/* Furnace door (front, +Z side) with glowing firebox */}
      <group position={[0, -0.05, 1.06]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.6, 0.06]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.18, 0, 0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
        {/* Glowing slot */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.42, 0.46]} />
          <meshStandardMaterial
            color="#ff7a1a"
            emissive="#ff5a00"
            emissiveIntensity={fireOn ? 2.4 : 0.2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Ash-pan glow underneath the firebox */}
      {fireOn && (
        <mesh position={[0, -0.5, 0.6]}>
          <planeGeometry args={[0.8, 1.6]} />
          <meshBasicMaterial
            color="#ff6a00"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Internal fire glow (visible through door) */}
      {fireOn && <FireFlicker />}

      {/* Boiler support saddles */}
      {[-0.7, 0.7].map((z) => (
        <mesh key={`saddle-${z}`} position={[0, -0.7, z]} castShadow>
          <boxGeometry args={[1.0, 0.2, 0.3]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
      ))}

      {/* Pressure gauge on the side */}
      <group position={[0.6, 0.5, 1.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.09, 24]} />
          <meshStandardMaterial color="#f4ecd6" emissive="#f4ecd6" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function RivetRing({
  z,
  radius,
  count,
}: {
  z: number;
  radius: number;
  count: number;
}) {
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push([Math.cos(a) * radius, Math.sin(a) * radius, z]);
    }
    return arr;
  }, [z, radius, count]);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={`r-${z}-${i}`} position={p}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/** A flickering point light + small cone of fire visible through the furnace door. */
function FireFlicker() {
  const lightRef = useRef<THREE.PointLight>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const flick = 0.7 + 0.3 * Math.sin(t.current * 11) + 0.2 * Math.sin(t.current * 23);
    if (lightRef.current) lightRef.current.intensity = 2 + flick * 2.5;
    if (coreRef.current) {
      const s = 0.9 + 0.18 * flick;
      coreRef.current.scale.set(s, s, s);
    }
  });
  return (
    <group position={[0, -0.15, 0.6]}>
      <pointLight
        ref={lightRef}
        color="#ff6a1a"
        intensity={3}
        distance={4}
        decay={1.6}
      />
      <mesh ref={coreRef} position={[0, 0, 0.4]}>
        <coneGeometry args={[0.28, 0.6, 16, 1, true]} />
        <meshBasicMaterial
          color="#ff8a2a"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** The steam pipe routing from the boiler dome to the cylinder steam chest. */
export function SteamPipe() {
  // From boiler dome top (-5.6, 2.45, 0.3) → up → right → into steam chest (-2.4, 2.7, 0)
  return (
    <group>
      {/* Vertical riser from dome */}
      <mesh position={[-5.3, 2.7, 0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* 90° elbow */}
      <mesh position={[-5.3, 2.95, 0.3]} castShadow>
        <torusGeometry args={[0.1, 0.1, 12, 16, Math.PI / 2]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Horizontal run toward cylinder */}
      <mesh position={[-3.85, 3.05, 0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.9, 16]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Down-elbow into steam chest */}
      <mesh position={[-2.4, 2.95, 0.3]} rotation={[0, 0, Math.PI]} castShadow>
        <torusGeometry args={[0.1, 0.1, 12, 16, Math.PI / 2]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Drop into steam chest */}
      <mesh position={[-2.4, 2.78, 0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.35, 16]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Flange joints */}
      {[-5.3, -4.4, -3.3, -2.4].map((x) => (
        <mesh key={`flange-${x}`} position={[x, 3.05, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
          <primitive object={makeSteel()} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

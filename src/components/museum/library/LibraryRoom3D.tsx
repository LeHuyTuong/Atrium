"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";

function Bookshelf({ x }: { x: number }) {
  return (
    <group position={[x, 0, -3.5]} rotation={[0, x > 0 ? -0.1 : 0.1, 0]}>
      <mesh position={[0, 2, -0.3]}>
        <boxGeometry args={[5, 5, 0.2]} />
        <meshStandardMaterial color="#2a1810" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4].map((shelf) => (
        <group key={shelf} position={[0, 0.4 + shelf * 1.0, 0]}>
          <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.8, 0.04, 0.4]} />
            <meshStandardMaterial color="#4a2f14" roughness={0.7} />
          </mesh>
          {Array.from({ length: 14 }).map((_, i) => {
            const w = 0.12 + Math.random() * 0.08;
            const h = 0.5 + Math.random() * 0.35;
            const colors = ["#8a3a1a", "#3a4a8a", "#5a2a3a", "#2a5a3a", "#6a4a1a", "#4a2a4a", "#8a6a2a"];
            const c = colors[(i + shelf) % colors.length];
            const xPos = -2.2 + i * 0.32;
            return (
              <mesh key={i} position={[xPos, h / 2, 0]} castShadow>
                <boxGeometry args={[w, h, 0.22]} />
                <meshStandardMaterial color={c} roughness={0.75} metalness={0.05} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function StudyDesk() {
  return (
    <group position={[0, -1.0, 0]}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a2f14" roughness={0.6} />
      </mesh>
      {[[-1.1, 0.4, -0.5], [1.1, 0.4, -0.5], [-1.1, 0.4, 0.5], [1.1, 0.4, 0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#3a2410" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.86, 0]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.03, 0.55]} />
        <meshStandardMaterial color="#e8d5a8" roughness={0.85} />
      </mesh>
      <mesh position={[-0.18, 0.875, 0]} rotation={[0, 0, 0.02]}>
        <boxGeometry args={[0.34, 0.005, 0.5]} />
        <meshStandardMaterial color="#f5ebd8" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.875, 0]} rotation={[0, 0, -0.02]}>
        <boxGeometry args={[0.34, 0.005, 0.5]} />
        <meshStandardMaterial color="#f5ebd8" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 0.86, -0.3]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#3a2410" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.9, 1.18, -0.3]} castShadow>
        <coneGeometry args={[0.18, 0.2, 16, 1, true]} />
        <meshStandardMaterial color="#b8893f" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} emissive="#ffd870" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0.9, 1.15, -0.3]} color="#ffd870" intensity={2.5} distance={3} />
    </group>
  );
}

function LibraryFloor() {
  return (
    <group position={[0, -1.4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a1810" roughness={0.95} />
      </mesh>
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[0, 0.001, (i - 9) * 1.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 0.03]} />
          <meshStandardMaterial color="#3a2410" roughness={0.9} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DustMotes() {
  const ref = useRef<THREE.Points>(null);
  const count = 180;
  const positions = useRef(new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 18));
  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.12 * (0.5 + (i % 3) * 0.2);
      arr[i * 3] += Math.sin((arr[i * 3 + 2] + arr[i * 3 + 1]) * 1.5) * delta * 0.03;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ffd870" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function LibraryRoom3D() {
  const reduced = usePrefersReducedMotion();
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 0.5, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} color="#ffd870" />
        <hemisphereLight args={["#ffd870", "#2a160a", 0.35]} />
        <spotLight position={[0, 5, 2]} angle={0.6} penumbra={0.9} intensity={3.5} color="#ffd870" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3, 1, 1]} intensity={0.6} color="#ff9a4a" distance={8} />
        <pointLight position={[3, 1, 1]} intensity={0.6} color="#ff9a4a" distance={8} />
        <Bookshelf x={-3.2} />
        <Bookshelf x={3.2} />
        <StudyDesk />
        <LibraryFloor />
        <DustMotes />
        {!reduced && <Sparkles count={80} scale={[14, 5, 8]} size={2.5} speed={0.2} opacity={0.5} color="#ffd870" />}
        <Environment preset="sunset" environmentIntensity={0.25} />
        <fog attach="fog" args={["#1a1408", 6, 16]} />
      </Suspense>
    </Canvas>
  );
}

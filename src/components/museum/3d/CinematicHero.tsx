"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ArtifactModel } from "./ArtifactModels";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";

const SETTLE_EPS = 0.0015;

function CameraRig({ settled }: { settled: (v: boolean) => void }) {
  const { camera } = useThree();
  const start = useRef(new THREE.Vector3(-6, 2.5, 9));
  const target = useRef(new THREE.Vector3(2.6, 0.4, 5));
  const t = useRef(0);
  useEffect(() => {
    camera.position.copy(start.current);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, delta) => {
    t.current = Math.min(1, t.current + delta * 0.32);
    const ease = 1 - Math.pow(1 - t.current, 3);
    camera.position.lerpVectors(start.current, target.current, ease);
    camera.lookAt(0, 0.1, 0);
    if (t.current >= 1 - SETTLE_EPS) settled(true);
  });
  return null;
}

function DustMotes({ accent }: { accent: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 220;
  const positions = useRef(
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 16)
  );
  useFrame((state, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.18 * (0.5 + (i % 3) * 0.2);
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={accent}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function CinematicHero({ accent = "#e89446" }: { accent?: string }) {
  const reduced = usePrefersReducedMotion();
  const [settled, setSettled] = useState(false);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [-6, 2.5, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <spotLight
            position={[2, 7, 3]}
            angle={0.6}
            penumbra={0.9}
            intensity={4}
            color="#fff2d0"
            castShadow
          />
          <pointLight position={[-4, 1, -3]} intensity={1.2} color={accent} />
          <pointLight position={[4, -1, 3]} intensity={0.6} color="#ffcf80" />

          {/* Hero: Watt steam engine */}
          <group position={[0, 0, 0]} scale={1.1}>
            <ArtifactModel motif="steam" accent={accent} spinning={!reduced} />
          </group>

          {/* floor disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]} receiveShadow>
            <circleGeometry args={[7, 64]} />
            <meshStandardMaterial color="#1a0f08" metalness={0.2} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.39, 0]}>
            <ringGeometry args={[2.2, 2.35, 64]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>

          {!reduced && <DustMotes accent={accent} />}
          {!reduced && (
            <Sparkles count={60} scale={[12, 6, 12]} size={2.5} speed={0.25} opacity={0.5} color={accent} />
          )}

          <Environment preset="sunset" environmentIntensity={0.3} />

          {!reduced && <CameraRig settled={setSettled} />}
        </Suspense>
      </Canvas>

      {/* fade overlay during fly-in */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, #100804 90%)",
          opacity: settled ? 0.5 : 0.9,
        }}
      />
    </div>
  );
}

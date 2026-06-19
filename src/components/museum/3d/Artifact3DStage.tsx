"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ArtifactModel } from "./ArtifactModels";
import { Motif } from "@/lib/museum-data";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";
import { useIsDark } from "@/hooks/museum/use-is-dark";

interface StageProps {
  motif: Motif;
  accent: string;
  hero?: boolean;
  height?: number;
  interactive?: boolean;
}

function Pedestal({ accent, dark }: { accent: string; dark: boolean }) {
  const top = dark ? "#2a1c10" : "#c9b896";
  const mid = dark ? "#1f1408" : "#b8a684";
  const base = dark ? "#170e06" : "#a8957a";
  return (
    <group position={[0, -1.05, 0]}>
      {/* top tier */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 48]} />
        <meshStandardMaterial color={top} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* mid tier */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.18, 48]} />
        <meshStandardMaterial color={mid} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* base */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.4, 1.45, 0.16, 48]} />
        <meshStandardMaterial color={base} metalness={0.2} roughness={0.8} />
      </mesh>
      {/* glowing accent ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dark ? 1.2 : 0.7} side={THREE.DoubleSide} transparent opacity={dark ? 0.8 : 0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.24, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dark ? 0.6 : 0.35} side={THREE.DoubleSide} transparent opacity={dark ? 0.4 : 0.25} />
      </mesh>
    </group>
  );
}

function SpotlightCone({ accent }: { accent: string }) {
  return (
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.0, 4.2, 32, 1, true]} />
      <meshBasicMaterial color={accent} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SpinningWrapper({ children, spin }: { children: React.ReactNode; spin: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return <group ref={ref}>{children}</group>;
}

export function Artifact3DStage({ motif, accent, hero, height = 320, interactive = true }: StageProps) {
  const reduced = usePrefersReducedMotion();
  const dark = useIsDark();
  const bgTop = dark ? "#1a0f08" : "#f5ebd8";
  const bgBot = dark ? "#100804" : "#e8dcc4";
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ height }}
      aria-label="Mô hình 3D hiện vật"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 28%, " +
            accent +
            (dark ? "22" : "18") +
            " 0%, transparent 55%), linear-gradient(180deg, " +
            bgTop +
            " 0%, " +
            bgBot +
            " 100%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.6, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={dark ? 0.55 : 0.85} />
          <hemisphereLight args={["#fff5d8", dark ? "#3a2410" : "#8a6a3e", dark ? 0.4 : 0.6]} />
          <spotLight
            position={[0, 6, 2]}
            angle={0.5}
            penumbra={0.8}
            intensity={dark ? 5 : 3}
            color="#fff5d8"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 1.5, -2]} intensity={dark ? 1.2 : 0.6} color={accent} />
          <pointLight position={[3, -0.5, 2]} intensity={dark ? 0.8 : 0.4} color="#ffcf80" />
          <pointLight position={[0, 1, 4]} intensity={dark ? 0.6 : 0.3} color="#fff5e0" />
          <directionalLight position={[2, 4, 3]} intensity={dark ? 0.6 : 0.9} color="#ffe9c0" />

          <SpotlightCone accent={accent} />

          <Float
            speed={reduced ? 0 : 1.4}
            rotationIntensity={reduced ? 0 : 0.25}
            floatIntensity={reduced ? 0 : 0.5}
            floatingRange={reduced ? [0, 0] : [-0.08, 0.08]}
          >
            <SpinningWrapper spin={!reduced}>
              <group position={[0, 0.1, 0]} scale={hero ? 1.05 : 0.95}>
                <ArtifactModel motif={motif} accent={accent} spinning={!reduced} />
              </group>
            </SpinningWrapper>
          </Float>

          <Pedestal accent={accent} dark={dark} />

          <ContactShadows
            position={[0, -1.06, 0]}
            opacity={dark ? 0.55 : 0.25}
            scale={6}
            blur={2.4}
            far={4}
            color={dark ? "#000" : "#5a4222"}
          />

          {!reduced && (
            <Sparkles
              count={36}
              scale={[5, 4, 5]}
              size={2}
              speed={0.3}
              opacity={0.5}
              color={accent}
            />
          )}

          <Environment preset="sunset" environmentIntensity={0.25} />

          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom
              minDistance={2.6}
              maxDistance={6}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 1.9}
              autoRotate={!reduced}
              autoRotateSpeed={0.6}
              makeDefault
            />
          )}
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 vignette-overlay rounded-xl" />
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        Kéo để xoay · Cuộn để phóng to
      </div>
    </div>
  );
}

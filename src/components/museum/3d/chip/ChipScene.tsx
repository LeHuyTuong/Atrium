"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Sparkles, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Intel4004 } from "./Intel4004";
import { Annotations } from "./Annotations";
import { palette } from "./palette";
import type { ChipPart, ChipPartId } from "@/lib/chip-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: ChipPartId | null;
  onPartClick: (id: ChipPartId) => void;
  showAnnotations: boolean;
  parts: ChipPart[];
  autoRotate: boolean;
  resetSignal: number;
  height?: number;
};

/** Sàn lab điện tử — bo mạch xanh lớn dưới chân chip. */
function LabFloor() {
  return (
    <group position={[0, -0.21, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#04130a" roughness={0.95} metalness={0} />
      </mesh>
      {/* Lưới vân PCB — các đường dọc */}
      {Array.from({ length: 16 }).map((_, i) => {
        const z = (i - 8) * 1.0;
        return (
          <mesh key={i} position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[24, 0.02]} />
            <meshStandardMaterial
              color={palette.accentDim}
              roughness={0.8}
              transparent
              opacity={0.18}
              emissive={palette.accentDim}
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}
      {/* Lưới vân PCB — các đường ngang */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = (i - 8) * 1.0;
        return (
          <mesh key={`x-${i}`} position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.02, 24]} />
            <meshStandardMaterial
              color={palette.accentDim}
              roughness={0.8}
              transparent
              opacity={0.12}
              emissive={palette.accentDim}
              emissiveIntensity={0.12}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Bóng đổ mềm dưới chip. */
function Grounding() {
  return (
    <ContactShadows
      position={[0, -0.19, 0]}
      opacity={0.6}
      scale={6}
      blur={2.6}
      far={3}
      color="#000000"
    />
  );
}

export function ChipScene({
  playing,
  speed,
  selectedPart,
  onPartClick,
  showAnnotations,
  parts,
  autoRotate,
  resetSignal,
  height = 320,
}: Props) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (resetSignal > 0) controlsRef.current?.reset();
  }, [resetSignal]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
      {/* Background gradient — xanh đen pha xanh lá */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, #4ade8018 0%, transparent 55%), linear-gradient(180deg, #0a1410 0%, #050a08 100%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.5, 1.8, 3.2], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(palette.fogColor, 0.04);
        }}
      >
        {/* Ánh sáng ấm + lạnh — mix kiểu lab điện tử */}
        <ambientLight intensity={0.45} color="#e0f5e8" />
        <hemisphereLight args={["#a8f5c8", "#021008", 0.55]} />
        {/* Key light — từ trên cao */}
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.5}
          color="#e8f5e0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0004}
        />
        {/* Point light — accent xanh lá từ phía dưới (glow của die) */}
        <pointLight
          position={[0, 0.1, 0]}
          intensity={0.6}
          color={palette.accent}
          distance={3}
        />
        {/* SpotLight — spotlight từ trên đỉnh chip */}
        <spotLight
          position={[0, 4.5, 0.5]}
          angle={0.6}
          penumbra={0.7}
          intensity={1.6}
          color="#c8f5d6"
          distance={10}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Fill lạnh — từ phía sau */}
        <pointLight position={[-3, 2, -2.5]} intensity={0.4} color="#7fd8a0" distance={10} />

        <Suspense fallback={null}>
          <group position={[0, 0.2, 0]}>
            <Intel4004
              playing={playing}
              speed={speed}
              selectedPart={selectedPart}
              onPartClick={onPartClick}
            />
            {showAnnotations && (
              <Annotations parts={parts} selected={selectedPart} onSelect={onPartClick} />
            )}
          </group>
          <LabFloor />
          <Grounding />
          {/* Tia lửa điện — hạt xanh bay nhẹ */}
          <Sparkles
            count={50}
            scale={[6, 3, 6]}
            position={[0, 1.5, 0]}
            size={2}
            speed={0.35}
            color={palette.accent}
            opacity={0.55}
          />
          {/* Bụi lab trôi nhẹ */}
          <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[-2.4, 2.0, -1.4]}>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshStandardMaterial
                color={palette.accent}
                emissive={palette.accent}
                emissiveIntensity={0.6}
              />
            </mesh>
          </Float>
          <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.5}>
            <mesh position={[2.5, 1.7, 1.2]}>
              <boxGeometry args={[0.035, 0.035, 0.035]} />
              <meshStandardMaterial
                color={palette.accent}
                emissive={palette.accent}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
          <Environment preset="city" environmentIntensity={0.25} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.4}
          maxDistance={8}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          target={[0, 0.1, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        Kéo để xoay · Cuộn để phóng to
      </div>
    </div>
  );
}

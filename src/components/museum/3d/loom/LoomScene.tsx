"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Sparkles, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { PowerLoom } from "./PowerLoom";
import { Annotations } from "./Annotations";
import { palette } from "./palette";
import type { LoomPart, LoomPartId } from "@/lib/loom-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: LoomPartId | null;
  onPartClick: (id: LoomPartId) => void;
  showAnnotations: boolean;
  parts: LoomPart[];
  autoRotate: boolean;
  resetSignal: number;
  height?: number;
};

/** Sàn gỗ xưởng dệt — các ván ghép. */
function WorkshopFloor() {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={palette.floorWood} roughness={0.95} metalness={0} />
      </mesh>
      {/* ván gỗ */}
      {Array.from({ length: 16 }).map((_, i) => {
        const z = (i - 8) * 1.1;
        return (
          <mesh key={i} position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[24, 0.04]} />
            <meshStandardMaterial color={palette.floorWoodLight} roughness={0.9} transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Bóng đổ mềm dưới máy. */
function Grounding() {
  return (
    <ContactShadows
      position={[0, -1.18, 0]}
      opacity={0.55}
      scale={9}
      blur={2.4}
      far={4}
      color="#1a0f06"
    />
  );
}

export function LoomScene({
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
      {/* Background gradient + grain */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 28%, #e8b53a18 0%, transparent 55%), linear-gradient(180deg, #1c130b 0%, #100804 100%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [3.6, 1.6, 4.2], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(palette.fogColor, 0.04);
        }}
      >
        {/* ánh sáng ấm kiểu đèn xưởng */}
        <ambientLight intensity={0.45} color="#ffe9c2" />
        <hemisphereLight args={["#ffd9a0", "#2a160a", 0.5]} />
        <directionalLight
          position={[5, 7, 4]}
          intensity={1.6}
          color="#fff0d0"
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
        {/* đèn giếng treo phía trên máy */}
        <spotLight
          position={[0, 4.6, 1.2]}
          angle={0.7}
          penumbra={0.7}
          intensity={2.0}
          color="#ffcf8a"
          distance={12}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* fill lạnh từ phía sau */}
        <pointLight position={[-4, 2, -3]} intensity={0.5} color="#9fc0ff" distance={12} />

        <Suspense fallback={null}>
          <group position={[0, 0.2, 0]}>
            <PowerLoom
              playing={playing}
              speed={speed}
              selectedPart={selectedPart}
              onPartClick={onPartClick}
            />
            {showAnnotations && (
              <Annotations parts={parts} selected={selectedPart} onSelect={onPartClick} />
            )}
          </group>
          <WorkshopFloor />
          <Grounding />
          {/* hạt bụi cưa bay trong ánh sáng */}
          <Sparkles count={60} scale={[7, 4, 7]} position={[0, 1.8, 0]} size={2} speed={0.3} color="#ffd9a0" opacity={0.5} />
          {/* một vài mẩu sợi vải trôi nổi nhẹ */}
          <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
            <mesh position={[-2.6, 2.4, -1.5]}>
              <torusGeometry args={[0.08, 0.012, 8, 24]} />
              <meshStandardMaterial color={palette.warpRed} roughness={0.8} />
            </mesh>
          </Float>
          <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.5}>
            <mesh position={[2.8, 2.1, 1.4]}>
              <torusGeometry args={[0.07, 0.01, 8, 24]} />
              <meshStandardMaterial color={palette.cloth} roughness={0.9} />
            </mesh>
          </Float>
          <Environment preset="sunset" environmentIntensity={0.25} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3}
          maxDistance={9}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          target={[0, 0.5, 0]}
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

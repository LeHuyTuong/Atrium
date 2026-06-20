"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { NeuralNet } from "./NeuralNet";
import { Annotations } from "./Annotations";
import { palette } from "./palette";
import type { NeuralPart, NeuralPartId } from "@/lib/neural-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: NeuralPartId | null;
  onPartClick: (id: NeuralPartId) => void;
  showAnnotations: boolean;
  parts: NeuralPart[];
  autoRotate: boolean;
  resetSignal: number;
  height?: number;
};

/** Sàn tối dưới mạng — plane lớn tím đen. */
function DarkFloor() {
  return (
    <group position={[0, -1.0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color={palette.floorColor} roughness={0.95} metalness={0} />
      </mesh>
      {/* lưới mờ — kiểu grid cyber */}
      <gridHelper
        args={[28, 28, palette.accentDim, "#2a0f28"]}
        position={[0, 0.001, 0]}
      />
    </group>
  );
}

/** Bóng đổ mềm dưới mạng. */
function Grounding() {
  return (
    <ContactShadows
      position={[0, -0.92, 0]}
      opacity={0.65}
      scale={9}
      blur={2.6}
      far={4}
      color="#0a0510"
    />
  );
}

export function NeuralScene({
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
      {/* Background gradient — purple radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 35%, #e879f920 0%, transparent 55%), linear-gradient(180deg, #0a0510 0%, #050208 100%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(palette.fogColor, 0.05);
        }}
      >
        {/* ===== Lighting — purple/pink-tinted ===== */}
        <ambientLight intensity={0.4} color="#f0c4f5" />
        <hemisphereLight args={["#e879f9", "#1a0a18", 0.45]} />
        {/* pointLight hồng từ giữa */}
        <pointLight
          position={[0, 1.0, 2.0]}
          intensity={2.4}
          color={palette.accent}
          distance={14}
          decay={2}
        />
        {/* pointLight tím từ phía sau */}
        <pointLight
          position={[0, 2.0, -3.0]}
          intensity={1.8}
          color={palette.accentDim}
          distance={14}
          decay={2}
        />
        {/* directional nhẹ cho shadow */}
        <directionalLight
          position={[3, 6, 4]}
          intensity={0.5}
          color="#f0c4f5"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0004}
        />

        <Suspense fallback={null}>
          <group position={[0, 0.1, 0]}>
            <NeuralNet
              playing={playing}
              speed={speed}
              selectedPart={selectedPart}
              onPartClick={onPartClick}
            />
            {showAnnotations && (
              <Annotations parts={parts} selected={selectedPart} onSelect={onPartClick} />
            )}
          </group>
          <DarkFloor />
          <Grounding />
          {/* Sparkles hồng — hoạt động điện */}
          <Sparkles
            count={80}
            scale={[8, 4, 8]}
            position={[0, 1.2, 0]}
            size={2.4}
            speed={0.4}
            color={palette.accent}
            opacity={0.6}
          />
          {/* Sparkles vàng — xung dữ liệu rải rác */}
          <Sparkles
            count={30}
            scale={[6, 3, 6]}
            position={[0, 1.0, 0.5]}
            size={1.8}
            speed={0.3}
            color={palette.dataPulse}
            opacity={0.5}
          />
          {/* Hạt trôi nổi nhẹ — kiểu "tensor" bay */}
          <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh position={[-3.0, 1.8, -1.2]}>
              <icosahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color={palette.accent} wireframe />
            </mesh>
          </Float>
          <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[3.2, 2.2, 0.8]}>
              <octahedronGeometry args={[0.07, 0]} />
              <meshBasicMaterial color={palette.accentDim} wireframe />
            </mesh>
          </Float>
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.7}>
            <mesh position={[2.4, -0.4, 1.6]}>
              <tetrahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color={palette.accent} wireframe />
            </mesh>
          </Float>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-fuchsia-200/40">
        Kéo để xoay · Cuộn để phóng to
      </div>
    </div>
  );
}

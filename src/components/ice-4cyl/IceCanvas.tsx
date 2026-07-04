"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EngineModel } from "./EngineModel";
import { useEngineStore } from "./useEngineStore";

const VIEW_PRESETS: Record<
  string,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  hero: { pos: [4, 2.5, 5], target: [0.2, 1.5, 0] },
  side: { pos: [0, 2, 7], target: [0.2, 1.5, 0] },
  top: { pos: [0.01, 7, 0.01], target: [0, 0.5, 0] },
  cutaway: { pos: [2, 2.5, 4], target: [0, 1.5, 0] },
  crankshaft: { pos: [0, 1.5, 4], target: [0, 1.0, 0.8] },
};

function CameraRig({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const viewPreset = useEngineStore((s) => s.viewPreset);
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...VIEW_PRESETS[viewPreset].target));
  const pos = useRef(new THREE.Vector3(...VIEW_PRESETS[viewPreset].pos));
  const goal = VIEW_PRESETS[viewPreset];

  useEffect(() => {
    pos.current.set(...goal.pos);
    target.current.set(...goal.target);
  }, [viewPreset]);

  useFrame((_, dt) => {
    const lerp = 1 - Math.pow(0.001, dt);
    camera.position.lerp(pos.current, lerp);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(target.current, lerp);
      controlsRef.current.update();
    }
  });
  return null;
}

function Lighting() {
  return (
    <>
      <hemisphereLight args={["#ffe9c4", "#2a2018", 0.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-5, 6, 4]}
        intensity={2.1}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10, 0.1, 30]}
        />
      </directionalLight>
      <directionalLight
        position={[6, 3, 5]}
        intensity={0.8}
        color="#a9c4ff"
      />
      <pointLight
        position={[0, 4, -5]}
        intensity={1.2}
        color="#ff8a3a"
        distance={20}
      />
    </>
  );
}

export default function IceCanvas() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const quality = useEngineStore((s) => s.quality);
  const isHigh = quality === "high";

  return (
    <Canvas
      shadows={isHigh}
      dpr={isHigh ? [1, 2] : [0.75, 1]}
      gl={{
        antialias: isHigh,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
        powerPreference: "high-performance",
      }}
      camera={{ position: VIEW_PRESETS.hero.pos, fov: 40, near: 0.1, far: 50 }}
      onPointerMissed={() => useEngineStore.getState().setSelectedPart(null)}
    >
      <color attach="background" args={["#3a322a"]} />
      <fog attach="fog" args={["#3a322a", 12, 25]} />

      <Lighting />

      <Suspense fallback={null}>
        <EngineModel />
      </Suspense>

      {isHigh && (
        <ContactShadows
          position={[0, 0.015, 0]}
          scale={14}
          far={6}
          blur={2.6}
          opacity={0.4}
          color="#000000"
          resolution={1024}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        target={[0.2, 1.5, 0]}
      />
      <CameraRig controlsRef={controlsRef} />
      {isHigh && <AdaptiveDpr pixelated />}
    </Canvas>
  );
}

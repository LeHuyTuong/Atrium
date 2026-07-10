"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EngineModel } from "./EngineModel";
import { useEngineStore, ViewPreset, TimeOfDay } from "./useEngineStore";

const VIEW_PRESETS: Record<
  ViewPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  hero: { pos: [8.5, 4.5, 9.5], target: [0.3, 2.4, 0] },
  side: { pos: [0, 3, 13], target: [0, 2.4, 0] },
  top: { pos: [0.01, 13, 0.01], target: [0, 0, 0] },
  cylinder: { pos: [-0.5, 2.2, 6], target: [-2.4, 1.6, 0] },
  flywheel: { pos: [7.5, 2.4, 6], target: [4.6, 2.1, 0] },
};

/** Lighting + atmosphere parameters for each time-of-day preset.
 *  Brightened across all modes so the engine is clearly visible. */
const TOD_CONFIG: Record<
  TimeOfDay,
  {
    bg: string;
    fog: string;
    hemi: [string, string, number];
    ambient: number;
    key: { pos: [number, number, number]; intensity: number; color: string };
    fill: { pos: [number, number, number]; intensity: number; color: string };
    rim: { pos: [number, number, number]; intensity: number; color: string };
    exposure: number;
    contactOpacity: number;
    preset: "sunset" | "night" | "warehouse" | "apartment";
  }
> = {
  day: {
    bg: "#3a322a",
    fog: "#3a322a",
    hemi: ["#ffe9c4", "#4a3a2a", 1.2],
    ambient: 0.7,
    key: { pos: [-6, 9, 5], intensity: 3.5, color: "#ffd9a0" },
    fill: { pos: [7, 4, 6], intensity: 1.5, color: "#b9d4ff" },
    rim: { pos: [0, 5, -6], intensity: 2.0, color: "#ffaa5a" },
    exposure: 1.3,
    contactOpacity: 0.55,
    preset: "warehouse",
  },
  dusk: {
    bg: "#2a1f1a",
    fog: "#3a2820",
    hemi: ["#ff9a5a", "#2a1a1a", 0.9],
    ambient: 0.5,
    key: { pos: [-8, 5, 4], intensity: 2.8, color: "#ff8a4a" },
    fill: { pos: [6, 3, 5], intensity: 1.0, color: "#9a7aba" },
    rim: { pos: [0, 6, -5], intensity: 2.5, color: "#ff6a3a" },
    exposure: 1.4,
    contactOpacity: 0.6,
    preset: "sunset",
  },
  night: {
    bg: "#1a1820",
    fog: "#1e1c28",
    hemi: ["#6a7a9a", "#2a2a3a", 0.6],
    ambient: 0.35,
    key: { pos: [-4, 8, 3], intensity: 1.8, color: "#8a9aba" },
    fill: { pos: [5, 3, 4], intensity: 0.7, color: "#5a6a8a" },
    rim: { pos: [0, 5, -5], intensity: 1.2, color: "#6a7a9a" },
    exposure: 1.5,
    contactOpacity: 0.7,
    preset: "night",
  },
};

/** Smoothly flies the camera + controls target to the active preset. */
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

/** Smoothly lerps the scene background + fog color + exposure toward the target TOD. */
function Atmosphere({ tod }: { tod: TimeOfDay }) {
  const cfg = TOD_CONFIG[tod];
  const { scene } = useThree();
  const bgTarget = useMemo(() => new THREE.Color(cfg.bg), [cfg.bg]);
  const fogTarget = useMemo(() => new THREE.Color(cfg.fog), [cfg.fog]);

  useEffect(() => {
    bgTarget.set(cfg.bg);
    fogTarget.set(cfg.fog);
  }, [cfg.bg, cfg.fog, bgTarget, fogTarget]);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.001, dt);
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgTarget, k);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(fogTarget, k);
    }
  });
  return null;
}

/** Lighting that smoothly lerps toward the target time-of-day config over ~1s.
 *  All light intensities + colors are animated via refs in useFrame. */
function Lighting({ tod }: { tod: TimeOfDay }) {
  const cfg = TOD_CONFIG[tod];
  // Refs for each animated light
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const fireRef = useRef<THREE.PointLight>(null);
  const chestRef = useRef<THREE.PointLight>(null);

  // Scratch color objects for lerping
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Target values derived from cfg
  const fireIntensity = tod === "night" ? 2.6 : tod === "dusk" ? 2.0 : 1.4;
  const fireDist = tod === "night" ? 9 : 6;
  const chestIntensity = tod === "night" ? 0.8 : 0.4;

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.001, dt); // ~1s exponential ease
    // Hemisphere
    if (hemiRef.current) {
      tmpColor.set(cfg.hemi[0]);
      hemiRef.current.color.lerp(tmpColor, k);
      tmpColor.set(cfg.hemi[1]);
      hemiRef.current.groundColor.lerp(tmpColor, k);
      hemiRef.current.intensity += (cfg.hemi[2] - hemiRef.current.intensity) * k;
    }
    // Ambient
    if (ambientRef.current) {
      ambientRef.current.intensity += (cfg.ambient - ambientRef.current.intensity) * k;
    }
    // Key directional
    if (keyRef.current) {
      keyRef.current.intensity += (cfg.key.intensity - keyRef.current.intensity) * k;
      tmpColor.set(cfg.key.color);
      keyRef.current.color.lerp(tmpColor, k);
    }
    // Fill directional
    if (fillRef.current) {
      fillRef.current.intensity += (cfg.fill.intensity - fillRef.current.intensity) * k;
      tmpColor.set(cfg.fill.color);
      fillRef.current.color.lerp(tmpColor, k);
    }
    // Rim point
    if (rimRef.current) {
      rimRef.current.intensity += (cfg.rim.intensity - rimRef.current.intensity) * k;
      tmpColor.set(cfg.rim.color);
      rimRef.current.color.lerp(tmpColor, k);
    }
    // Fire glow
    if (fireRef.current) {
      fireRef.current.intensity += (fireIntensity - fireRef.current.intensity) * k;
      fireRef.current.distance += (fireDist - fireRef.current.distance) * k;
    }
    // Chest glow
    if (chestRef.current) {
      chestRef.current.intensity += (chestIntensity - chestRef.current.intensity) * k;
    }
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} args={["#ffe9c4", "#2a2018", 0.55]} />
      <ambientLight ref={ambientRef} intensity={0.25} />
      <directionalLight
        ref={keyRef}
        position={cfg.key.pos}
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
        ref={fillRef}
        position={cfg.fill.pos}
        intensity={0.6}
        color="#a9c4ff"
      />
      <pointLight
        ref={rimRef}
        position={cfg.rim.pos}
        intensity={1.2}
        color="#ff8a3a"
        distance={20}
      />
      {/* Boiler fire glow — intensifies at night */}
      <pointLight
        ref={fireRef}
        position={[-5.6, 1.2, 0.6]}
        intensity={1.4}
        color="#ff6a1a"
        distance={6}
        decay={1.5}
      />
      {/* Cylinder steam-chest warm glow */}
      <pointLight
        ref={chestRef}
        position={[-2.4, 2.6, 0.9]}
        intensity={0.4}
        color="#ffb24a"
        distance={4}
        decay={1.8}
      />
    </>
  );
}

/** Lantern props that glow at night — small atmospheric detail. */
function NightLanterns({ tod }: { tod: TimeOfDay }) {
  const glow = tod === "night" ? 1 : tod === "dusk" ? 0.5 : 0;
  if (glow === 0) return null;
  const lanterns: [number, number, number][] = [
    [-7.5, 4.5, -2.5],
    [7.5, 4.5, -2.5],
    [-7.5, 4.5, 2.5],
    [7.5, 4.5, 2.5],
    [0, 5.5, -3.2],
  ];
  return (
    <group>
      {lanterns.map((p, i) => (
        <group key={i} position={p}>
          <pointLight
            color="#ffb24a"
            intensity={glow * 2.2}
            distance={7}
            decay={1.5}
          />
          {/* Lantern housing */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.08, 0.14, 8]} />
            <meshStandardMaterial color="#2a1f14" metalness={0.7} roughness={0.6} />
          </mesh>
          {/* Glowing bulb */}
          <mesh position={[0, -0.02, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#ffd47a"
              emissive="#ffb24a"
              emissiveIntensity={glow * 4}
              toneMapped={false}
            />
          </mesh>
          {/* Lantern cap */}
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.09, 0.08, 8]} />
            <meshStandardMaterial color="#2a1f14" metalness={0.7} roughness={0.6} />
          </mesh>
          {/* Hanging chain */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
            <meshStandardMaterial color="#1a1410" metalness={0.8} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function SteamCanvas() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const timeOfDay = useEngineStore((s) => s.timeOfDay);
  const quality = useEngineStore((s) => s.quality);
  const cfg = useMemo(() => TOD_CONFIG[timeOfDay], [timeOfDay]);
  const isHigh = quality === "high";

  return (
    <Canvas
      shadows={isHigh}
      dpr={isHigh ? [1, 2] : [0.75, 1]}
      gl={{
        antialias: isHigh,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: cfg.exposure,
        powerPreference: "high-performance",
      }}
      camera={{ position: VIEW_PRESETS.hero.pos, fov: 42, near: 0.1, far: 100 }}
      onPointerMissed={() => useEngineStore.getState().setSelectedPart(null)}
    >
      <color attach="background" args={[cfg.bg]} />
      <fog attach="fog" args={[cfg.fog, 18, 36]} />

      <Atmosphere tod={timeOfDay} />
      <Lighting tod={timeOfDay} />
      {isHigh && <NightLanterns tod={timeOfDay} />}

      <Suspense fallback={null}>
        <EngineModel />
      </Suspense>

      {/* Ground contact shadow — lower resolution in low quality */}
      {isHigh && (
        <ContactShadows
          position={[0, 0.015, 0]}
          scale={22}
          far={8}
          blur={2.6}
          opacity={cfg.contactOpacity}
          color="#000000"
          resolution={1024}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={22}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        target={[0.3, 2.4, 0]}
      />
      <CameraRig controlsRef={controlsRef} />
      {isHigh && <AdaptiveDpr pixelated />}
    </Canvas>
  );
}

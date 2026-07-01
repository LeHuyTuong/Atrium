"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Motif } from "@/lib/museum-data";

interface ModelProps {
  accent: string;
  spinning?: boolean;
  onPartClick?: (partId: string) => void;
  selectedPart?: string | null;
}

const metal = (color: string, emissive = "#000", ei = 0) => ({
  color,
  metalness: 0.9,
  roughness: 0.22,
  emissive,
  emissiveIntensity: ei,
});

const matte = (color: string, emissive = "#000", ei = 0) => ({
  color,
  metalness: 0.1,
  roughness: 0.75,
  emissive,
  emissiveIntensity: ei,
});

function useCastIronTex(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#4a3a2a";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 256, y = Math.random() * 256;
      const r = Math.random() * 3;
      const v = 40 + Math.random() * 60;
      ctx.fillStyle = `rgb(${v+20},${v},${v-10})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);
}

function useBrassTex(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, "#c9a05a"); grad.addColorStop(0.5, "#b8893f"); grad.addColorStop(1, "#d4b06a");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 256, y = Math.random() * 256;
      ctx.fillStyle = `rgba(180,130,60,${Math.random() * 0.3})`;
      ctx.beginPath(); ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);
}

function useCopperTex(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#b86a2e";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 256, y = Math.random() * 256;
      const g = 60 + Math.random() * 80;
      ctx.fillStyle = `rgba(${g+60},${g},${g-20},${Math.random()*0.5})`;
      ctx.beginPath(); ctx.arc(x, y, Math.random() * 4, 0, Math.PI * 2); ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);
}

function Gear({ accent }: ModelProps) {
  const teeth = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const n = 16;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0));
    }
    return arr;
  }, []);
  return (
    <group>
      <mesh rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.2, 48]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.28, 16]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {teeth.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, 0.1]}>
            <boxGeometry args={[0.2, 0.35, 0.2]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
        ))}
        <mesh>
          <torusGeometry args={[0.35, 0.1, 16, 48]} />
          <meshStandardMaterial {...metal("#8a6a2e")} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 12, 48]} />
        <meshStandardMaterial {...metal(accent, accent, 0.4)} />
      </mesh>
      <group position={[0, 0.12, 0]}>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0]} rotation={[0, 0, -a]}>
              <boxGeometry args={[0.06, 0.35, 0.06]} />
              <meshStandardMaterial {...metal("#7a5a2e")} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function SteamEngine({ accent, spinning }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flywheelRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Group>(null);
  const pistonRef = useRef<THREE.Group>(null);
  const conrodRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);
  const beamPivotRef = useRef<THREE.Mesh>(null);

  const castIronTex = useCastIronTex();
  const brassTex = useBrassTex();
  const copperTex = useCopperTex();

  useFrame((_, delta) => {
    if (!spinning) return;
    let t = 0;
    if (flywheelRef.current) {
      flywheelRef.current.rotation.z += delta * 1.8;
      t = flywheelRef.current.rotation.z;
    }

    const pistonX = -0.95 + Math.cos(t) * 0.22;
    const beamAngle = (pistonX + 0.95) * 0.35;

    if (beamRef.current) {
      beamRef.current.rotation.z = beamAngle;
    }

    if (pistonRef.current) {
      pistonRef.current.position.x = pistonX;
    }

    const beamLen = 1.1;
    const rightEndX = (beamPivotRef.current?.position.x ?? 0.2) + beamLen * Math.cos(beamAngle);
    const rightEndY = (beamPivotRef.current?.position.y ?? 0.85) + beamLen * Math.sin(beamAngle);
    const crankX = 1.95 + 0.22 * Math.cos(t);
    const crankY = 0.25 + 0.22 * Math.sin(t);

    if (conrodRef.current) {
      conrodRef.current.position.x = (rightEndX + crankX) / 2;
      conrodRef.current.position.y = (rightEndY + crankY) / 2;
      const dx = crankX - rightEndX;
      const dy = crankY - rightEndY;
      const len = Math.hypot(dx, dy);
      conrodRef.current.scale.x = 1;
      conrodRef.current.scale.y = len / 0.7;
      conrodRef.current.rotation.z = Math.atan2(dy, dx);
    }

    if (steamRef.current) {
      const arr = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += delta * (0.2 + Math.random() * 0.15);
        arr[i] += Math.sin((arr[i + 2] + arr[i + 1]) * 2 + t) * delta * 0.04;
        arr[i + 2] += Math.cos((arr[i] + arr[i + 1]) * 3) * delta * 0.02;
        if (arr[i + 1] > 1.6) {
          arr[i + 1] = 0.4 + Math.random() * 0.15;
          arr[i] = 0.5 + (Math.random() - 0.5) * 0.5;
          arr[i + 2] = (Math.random() - 0.5) * 0.6;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const steamPositions = useMemo(() => {
    const n = 60;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = 0.5 + (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 1] = 0.4 + Math.random() * 1.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return arr;
  }, []);

  const brass = { ...metal("#b8893f"), map: brassTex };
  const darkBrass = { ...metal("#7a5a2e"), map: brassTex };
  const copper = { ...metal("#c9762e"), map: copperTex };
  const iron = { ...metal("#3a2a1a"), map: castIronTex, roughness: 0.7 };
  const steel = { ...metal("#9a9a9a"), roughness: 0.2, metalness: 0.95 };
  const accentMat = { color: accent, emissive: accent, emissiveIntensity: 0.4, metalness: 0.85, roughness: 0.25 };

  const BEAM_HALF = 1.1;
  const BEAM_PIVOT_X = 0.2;
  const BEAM_PIVOT_Y = 0.85;

  return (
    <group ref={groupRef} rotation={[0, 0, 0.02]}>
      <mesh position={[0, -1.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 0.28, 1.6]} />
        <meshStandardMaterial {...iron} />
      </mesh>
      <mesh position={[0, -0.84, 0]}>
        <boxGeometry args={[4.5, 0.06, 1.7]} />
        <meshStandardMaterial {...{ ...metal("#5a4222"), map: castIronTex, roughness: 0.5 }} />
      </mesh>
      {[-2.0, -0.7, 0.7, 2.0].map((x, i) => (
        <mesh key={i} position={[x, -1.18, 0]} castShadow>
          <boxGeometry args={[0.3, 0.18, 1.4]} />
          <meshStandardMaterial {...iron} />
        </mesh>
      ))}

      <group position={[-1.3, 0.0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 1.8, 48]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e"), map: castIronTex, roughness: 0.45 }} />
        </mesh>
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.62, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e"), map: brassTex, roughness: 0.4 }} />
        </mesh>
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.62, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e"), map: brassTex, roughness: 0.4 }} />
        </mesh>
        {[-0.6, 0, 0.6].map((y, i) => (
          <mesh key={i} position={[y, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.64, 0.025, 8, 48]} />
            <meshStandardMaterial {...{ ...metal("#caa05a"), map: brassTex, roughness: 0.35 }} />
          </mesh>
        ))}
        {[-0.6, 0, 0.6].flatMap((y, ri) =>
          Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <mesh key={`${ri}-${i}`} position={[y, Math.cos(a) * 0.64, Math.sin(a) * 0.64]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial {...{ ...metal("#e0c076"), map: brassTex, roughness: 0.3 }} />
              </mesh>
            );
          })
        )}

        <mesh position={[0.1, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.3, 24]} />
          <meshStandardMaterial {...copper} />
        </mesh>
        <mesh position={[0.1, 0.9, 0]}>
          <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...copper} />
        </mesh>
        <mesh position={[-0.5, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.5, 16]} />
          <meshStandardMaterial {...darkBrass} />
        </mesh>
        <mesh position={[-0.5, 1.18, 0]}>
          <cylinderGeometry args={[0.14, 0.13, 0.08, 16]} />
          <meshStandardMaterial {...iron} />
        </mesh>
        <mesh position={[-0.95, 0.25, 0.45]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[-0.98, 0.25, 0.45]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
          <meshStandardMaterial color="#f5e8c8" emissive={accent} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.7, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial {...copper} />
        </mesh>
      </group>

      <group ref={pistonRef} position={[-0.95, 0, 0]}>
        <mesh position={[0, 0.0, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.9, 32]} />
          <meshStandardMaterial {...{ ...metal("#6a4a22"), map: castIronTex, roughness: 0.5 }} />
        </mesh>
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.30, 0.28, 0.12, 32]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[0, -0.48, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.32, 0.18, 32]} />
          <meshStandardMaterial {...darkBrass} />
        </mesh>
        <mesh position={[0, -0.48, 0.33]}>
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.14, 0.22]} />
          <meshStandardMaterial {...darkBrass} />
        </mesh>
        <mesh position={[0, 0.95, 0.18]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <mesh position={[0, 0.95, -0.18]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial {...steel} />
        </mesh>

        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      <mesh position={[1.95, 0.55, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.9]} />
        <meshStandardMaterial {...iron} />
      </mesh>
      <mesh position={[1.95, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.14, 24]} />
        <meshStandardMaterial {...brass} />
      </mesh>

      <group ref={flywheelRef} position={[1.95, 0.25, 0]} rotation={[0, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.55, 0.07, 16, 64]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.15), map: castIronTex, roughness: 0.35 }} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[0, Math.cos(a) * 0.3, Math.sin(a) * 0.3]} rotation={[Math.cos(a), 0, 0]}>
              <boxGeometry args={[0.14, 0.5, 0.04]} />
              <meshStandardMaterial {...darkBrass} />
            </mesh>
          );
        })}
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 16]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      <mesh ref={beamPivotRef} position={[BEAM_PIVOT_X, BEAM_PIVOT_Y, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial {...steel} />
      </mesh>

      <group ref={beamRef} position={[BEAM_PIVOT_X, BEAM_PIVOT_Y, 0]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[BEAM_HALF * 2, 0.07, 0.25]} />
          <meshStandardMaterial {...darkBrass} />
        </mesh>
        <mesh position={[-BEAM_HALF + 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <mesh position={[BEAM_HALF - 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {[-BEAM_HALF, BEAM_HALF].map((x, i) => (
          <mesh key={i} position={[x, -0.05, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
            <meshStandardMaterial {...brass} />
          </mesh>
        ))}
      </group>

      <mesh ref={conrodRef} position={[1.2, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.7, 0.06]} />
        <meshStandardMaterial {...steel} />
      </mesh>

      <group position={[1.4, 0.55, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        {[-1, 1].map((s, i) => (
          <group key={i} position={[0, 0.8, 0]} rotation={[0, 0, s * 0.5]}>
            <mesh position={[s * 0.22, -0.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
              <meshStandardMaterial {...steel} />
            </mesh>
            <mesh position={[s * 0.34, -0.18, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial {...brass} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.08, 16]} />
          <meshStandardMaterial {...darkBrass} />
        </mesh>
      </group>

      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[steamPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#e8ddd0" transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function Loom({ accent, onPartClick, selectedPart }: ModelProps) {
  const isSel = (id: string) => selectedPart === id;
  const hi = (id: string) => (isSel(id) ? accent : undefined);
  const p = (id: string) => ({
    onClick: onPartClick
      ? (e: any) => {
          e.stopPropagation();
          onPartClick(id);
        }
      : undefined,
  });

  return (
    <group>
      <group {...p("frame")}>
        <mesh position={[-0.85, 0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 1.9, 0.9]} />
          <meshStandardMaterial {...matte(hi("frame") || "#4a2f14")} />
        </mesh>
        <mesh position={[0.85, 0.45, 0]} castShadow>
          <boxGeometry args={[0.12, 1.9, 0.9]} />
          <meshStandardMaterial {...matte(hi("frame") || "#4a2f14")} />
        </mesh>
        <mesh position={[-0.85, 0.45, 0.5]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 1.8, 0.1]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0.85, 0.45, 0.5]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 1.8, 0.1]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[-0.85, 0.45, -0.5]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 1.8, 0.1]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0.85, 0.45, -0.5]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 1.8, 0.1]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[1.82, 0.08, 0.95]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[1.82, 0.08, 0.95]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0, -0.47, 0]}>
          <boxGeometry args={[1.88, 0.04, 1.0]} />
          <meshStandardMaterial {...matte("#2a1810")} />
        </mesh>
        {[-0.42, 0, 0.42].map((x, i) => (
          <mesh key={i} position={[x, 0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial {...matte("#5a3a1a")} />
          </mesh>
        ))}
      </group>

      <group {...p("spindles")}>
        {Array.from({ length: 8 }).map((_, i) => {
          const z = -0.35 + (i / 7) * 0.7;
          return (
            <group key={i} position={[0, 0.9, z]}>
              <mesh rotation={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.04, 0.35, 12]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#d4b888" : "#b8893f"}
                  metalness={0.4}
                  roughness={0.5}
                  emissive={isSel("spindles") ? accent : "#000"}
                  emissiveIntensity={isSel("spindles") ? 0.4 : 0}
                />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.045, 0.03, 0.05, 12]} />
                <meshStandardMaterial {...matte("#5a3a1a")}
                  emissive={isSel("spindles") ? accent : "#000"}
                  emissiveIntensity={isSel("spindles") ? 0.2 : 0}
                />
              </mesh>
              <mesh position={[0, -0.02, 0]}>
                <torusGeometry args={[0.03, 0.008, 8, 16]} />
                <meshStandardMaterial {...metal("#caa05a")} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshStandardMaterial
                  color={["#e8dcc4", "#d4b888", "#c9b896", "#dcc8a0", "#e0d0b8", "#d0bc94", "#e8dcc4", "#d4b888"][i]}
                  roughness={0.85}
                  metalness={0}
                  emissive={isSel("spindles") ? accent : "#000"}
                  emissiveIntensity={isSel("spindles") ? 0.2 : 0}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      <group {...p("roving")}>
        {Array.from({ length: 8 }).map((_, i) => {
          const z = -0.35 + (i / 7) * 0.7;
          return (
            <mesh key={i} position={[0.15, 0.55, z]} rotation={[0.1, 0.1, 0.1]}>
              <cylinderGeometry args={[0.005, 0.005, 0.6, 6]} />
              <meshStandardMaterial
                color="#d4c4a0"
                roughness={0.9}
                metalness={0}
                emissive={isSel("roving") ? accent : "#000"}
                emissiveIntensity={isSel("roving") ? 0.3 : 0}
              />
            </mesh>
          );
        })}
      </group>

      <group position={[0.95, 0.0, 0]} {...p("drive-wheel")}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.45, 0.04, 12, 32]} />
          <meshStandardMaterial
            {...matte(hi("drive-wheel") || "#5a3a1a")}
            emissive={isSel("drive-wheel") ? accent : "#000"}
            emissiveIntensity={isSel("drive-wheel") ? 0.3 : 0}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0]} rotation={[0, 0, -a]}>
              <boxGeometry args={[0.06, 0.35, 0.03]} />
              <meshStandardMaterial
                {...matte("#4a2f14")}
                emissive={isSel("drive-wheel") ? accent : "#000"}
                emissiveIntensity={isSel("drive-wheel") ? 0.2 : 0}
              />
            </mesh>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 24]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      </group>

      <group position={[0.95, -0.3, 0]} {...p("crank")}>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
          <meshStandardMaterial
            {...matte(hi("crank") || "#3a2410")}
            emissive={isSel("crank") ? accent : "#000"}
            emissiveIntensity={isSel("crank") ? 0.3 : 0}
          />
        </mesh>
        <mesh position={[0.15, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
          <meshStandardMaterial {...matte("#4a2f14")} />
        </mesh>
      </group>

      <group position={[-0.15, 0.65, 0]} {...p("heddles")}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.5, 0.55]} />
          <meshStandardMaterial
            {...metal(isSel("heddles") ? "#d4b06a" : "#9a7a3e")}
            emissive={isSel("heddles") ? accent : "#000"}
            emissiveIntensity={isSel("heddles") ? 0.3 : 0}
          />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const z = -0.22 + (i / 9) * 0.44;
          return (
            <mesh key={i} position={[0, 0, z]}>
              <boxGeometry args={[0.006, 0.4, 0.006]} />
              <meshStandardMaterial color="#9a9a9a" metalness={0.9} roughness={0.2} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.58]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.58]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
      </group>

      <group position={[0.3, 0.5, 0.3]} {...p("shuttle")}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.035, 0.18, 8, 12]} />
          <meshStandardMaterial
            {...matte(hi("shuttle") || "#5a3a1a")}
            emissive={isSel("shuttle") ? accent : "#000"}
            emissiveIntensity={isSel("shuttle") ? 0.3 : 0}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 12]} />
          <meshStandardMaterial color="#d4c4a0" roughness={0.85} />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.3, 0.004, 0.004]} />
          <meshStandardMaterial color="#d4c4a0" roughness={0.85} />
        </mesh>
      </group>

      <group position={[0, -0.3, 0.55]} {...p("cloth")}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
          <meshStandardMaterial
            {...matte("#3a2410")}
            emissive={isSel("cloth") ? accent : "#000"}
            emissiveIntensity={isSel("cloth") ? 0.2 : 0}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 24]} />
          <meshStandardMaterial
            color={isSel("cloth") ? "#e8dcc4" : "#c9b896"}
            roughness={0.85}
            metalness={0}
            emissive={isSel("cloth") ? accent : "#000"}
            emissiveIntensity={isSel("cloth") ? 0.15 : 0}
          />
        </mesh>
        <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
        <mesh position={[-0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#d4c4a0" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function Locomotive({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 0.7]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      <mesh position={[-0.7, 0.7, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.66]} />
        <meshStandardMaterial {...matte("#4a2f14")} />
      </mesh>
      <mesh position={[-0.7, 1.0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.06, 0.7]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0.95, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.4, 24]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[0.95, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.34, 0.03, 8, 24]} />
        <meshStandardMaterial {...metal(accent, accent, 0.4)} />
      </mesh>
      <mesh position={[0.5, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.4, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0.5, 1.18, 0]}>
        <cylinderGeometry args={[0.16, 0.13, 0.08, 16]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      {[0.6, 0, -0.6].map((x, i) => (
        <group key={i} position={[x, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.12, 24]} />
            <meshStandardMaterial {...metal("#6a4a22")} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.22, 0.02, 8, 24]} />
            <meshStandardMaterial {...metal("#caa05a")} />
          </mesh>
          {Array.from({ length: 5 }).map((_, j) => {
            const a = (j / 5) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
                <meshStandardMaterial {...metal("#3a2410")} />
              </mesh>
            );
          })}
        </group>
      ))}
      <mesh position={[1.0, 0, 0.37]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
        <meshStandardMaterial {...metal("#caa05a")} roughness={0.3} />
      </mesh>
      <mesh position={[1.0, 0, -0.37]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
        <meshStandardMaterial {...metal("#caa05a")} roughness={0.3} />
      </mesh>
      <mesh position={[-0.95, 0.1, 0.33]} rotation={[0, 0, Math.PI * 0.15]}>
        <boxGeometry args={[0.12, 0.06, 0.04]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function CottonGin({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial {...matte("#4a2f14")} />
      </mesh>
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={`supp-${i}`} position={[x, -0.15, 0.55]} castShadow>
          <boxGeometry args={[0.06, 0.3, 0.06]} />
          <meshStandardMaterial {...matte("#3a2410")} />
        </mesh>
      ))}
      {[-0.3, 0.3].map((x, i) => (
        <group key={i} position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.35, 1.2, 32]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
          {Array.from({ length: 10 }).map((_, j) => {
            const a = (j / 10) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0]}>
                <boxGeometry args={[0.04, 0.04, 1.25]} />
                <meshStandardMaterial {...metal(accent, accent, 0.3)} />
              </mesh>
            );
          })}
        </group>
      ))}
      <mesh position={[0, 0.25, -0.5]}>
        <boxGeometry args={[0.16, 0.12, 0.12]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      <mesh position={[0, 0.25, -0.62]}>
        <boxGeometry args={[0.04, 0.04, 0.12]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.65, -0.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.3]} />
        <meshStandardMaterial color="#d4b888" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PuddlingFurnace({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.4, 0.6, 1.0]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...metal("#5a2a10", accent, 0.6)} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.8, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.18, 0.16, 0.06, 16]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ff7a2a" emissive="#ff5a1a" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.65, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0.65, 0.32, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0.75, 0, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshStandardMaterial {...metal("#b8893f")} roughness={0.5} />
      </mesh>
    </group>
  );
}

function GasLamp({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.6, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 16]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.04, 16]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#fff4c0" emissive={accent} emissiveIntensity={1.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fff8e0" emissive={accent} emissiveIntensity={2} transparent opacity={1} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.2, 0.18, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      <pointLight position={[0, 0.6, 0]} color={accent} intensity={2} distance={4} />
    </group>
  );
}

function ThamesShield({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.8, 0.12, 16, 32, Math.PI]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      <mesh position={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[1.4, 0.04, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
      </mesh>
      {[-0.5, -0.16, 0.16, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial {...metal(accent, accent, 0.3)} />
        </mesh>
      ))}
      <mesh position={[0, -0.45, -0.1]}>
        <boxGeometry args={[0.6, 0.04, 0.02]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
    </group>
  );
}

function Bolt({ accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.6, 24]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.12, 6]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} wireframe />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.22, 0.04, 8, 24]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <pointLight color={accent} intensity={1.5} distance={3} />
    </group>
  );
}

function Assembly({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[2.2, 0.1, 0.5]} />
        <meshStandardMaterial {...metal("#5a4222")} />
      </mesh>
      {[-0.7, -0.2, 0.3, 0.8].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0]} castShadow>
          <boxGeometry args={[0.25, 0.25, 0.35]} />
          <meshStandardMaterial {...metal(i % 2 ? accent : "#b8893f")} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial {...metal(accent, accent, 0.3)} />
      </mesh>
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={`bolt-${i}`} position={[x, 0.1, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      ))}
    </group>
  );
}

function Dynamo({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 32]} />
        <meshStandardMaterial {...metal("#6a4a22")} />
      </mesh>
      {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.62, 0.04, 8, 32]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.3, 16]} />
        <meshStandardMaterial {...metal(accent, accent, 0.5)} />
      </mesh>
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0.76, 0, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.12]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      <pointLight color={accent} intensity={1.2} distance={3} />
    </group>
  );
}

function OttoEngine({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.7]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      {[0.35, 0, -0.35].map((z, i) => (
        <group key={i} position={[0, 0.35, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.5, 16]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
            <meshStandardMaterial {...metal(accent, accent, 0.3)} />
          </mesh>
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
            <meshStandardMaterial {...metal("#b8893f")} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.35, 0.06, 12, 32]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[1.15, 0, 0]}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
    </group>
  );
}

function Marconi({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
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
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.8, 0.01, 8, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} transparent opacity={0.2} />
      </mesh>
      <pointLight color={accent} intensity={1} distance={4} />
    </group>
  );
}

function EdisonMeter({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 1.2, 0.4]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.2, 0.22]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
      {[-0.18, 0, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0.27]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshStandardMaterial {...metal(accent, accent, 0.5)} />
        </mesh>
      ))}
      <mesh position={[0, -0.4, 0.22]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.06]} />
        <meshStandardMaterial {...matte("#1a0f08")} />
      </mesh>
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={`wire-${i}`} position={[x, -0.5, 0.12]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial {...metal("#b8893f")} />
        </mesh>
      ))}
    </group>
  );
}

function LightBulb({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshStandardMaterial color="#fff8d0" emissive={accent} emissiveIntensity={0.9} transparent opacity={0.35} roughness={0.05} metalness={0} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.48, 48, 48]} />
        <meshStandardMaterial color="#fff8e0" emissive={accent} emissiveIntensity={1.2} transparent opacity={0.15} roughness={0} metalness={0} />
      </mesh>
      <group position={[0, 0.25, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0]}>
              <torusGeometry args={[0.12, 0.012, 8, 16]} />
              <meshStandardMaterial color="#fff" emissive="#fff5c0" emissiveIntensity={2} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.3, 24]} />
        <meshStandardMaterial {...metal("#9a7a3e")} />
      </mesh>
      <mesh position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.18, 16]} />
        <meshStandardMaterial {...matte("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.04, 12]} />
        <meshStandardMaterial {...metal("#caa05a")} />
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
    const n = 12;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      arr.push(new THREE.Vector3(Math.cos(theta) * Math.sin(phi) * 0.8, Math.sin(theta) * Math.sin(phi) * 0.8, Math.cos(phi) * 0.8));
    }
    return arr;
  }, []);

  const connections = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.2) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
        </mesh>
      ))}
      {connections.map(([i, j], idx) => {
        const from = nodes[i];
        const to = nodes[j];
        const mid = from.clone().lerp(to, 0.5);
        const len = from.distanceTo(to);
        return (
          <mesh key={idx} position={mid}>
            <boxGeometry args={[0.008, 0.008, len]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function Chip({ accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.12, 1.0]} />
        <meshStandardMaterial {...metal("#1a1a1a")} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.35, 0.01, 0.35]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => {
        const side = Math.floor(i / 5);
        const t = (i % 5) - 2;
        const pos = side === 0 ? [0.55, 0, t * 0.18] : side === 1 ? [-0.55, 0, t * 0.18] : side === 2 ? [t * 0.18, 0, 0.55] : [t * 0.18, 0, -0.55];
        return (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.04, 0.04, 0.18]} />
            <meshStandardMaterial {...metal("#caa05a")} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.12, 0.005, 0.12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function Monitor({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.12]} />
        <meshStandardMaterial {...matte("#1a0f08")} />
      </mesh>
      <mesh position={[0, 0.1, 0.07]}>
        <boxGeometry args={[1.25, 0.85, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <boxGeometry args={[0.08, 0.04, 0.01]} />
        <meshStandardMaterial color="#fff" emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.78, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.3]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.2]} />
        <meshStandardMaterial {...metal("#2a1810")} />
      </mesh>
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, -0.45, 0.07]}>
          <boxGeometry args={[0.02, 0.015, 0.01]} />
          <meshStandardMaterial {...metal("#5a4222")} />
        </mesh>
      ))}
    </group>
  );
}

function Upc({ accent }: ModelProps) {
  const widths = [0.04, 0.02, 0.06, 0.03, 0.04, 0.02, 0.05, 0.03, 0.04, 0.06, 0.02, 0.03];
  return (
    <group>
      <mesh position={[0, 0, -0.02]} castShadow>
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
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Www({ accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.7, 48, 48]} />
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
      <mesh rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[0.7, 0.005, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      <pointLight color={accent} intensity={1.2} distance={3} />
    </group>
  );
}

function Phone({ accent }: ModelProps) {
  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.35, 0.28]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.8, 0.04, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.08, 0.15]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#1a0f08" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial {...metal("#caa05a")} />
      </mesh>
    </group>
  );
}

function Gps({ accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
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
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.08]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <pointLight color={accent} intensity={1} distance={3} />
    </group>
  );
}

function Brain({ accent }: ModelProps) {
  return (
    <group>
      <mesh castShadow>
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
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#c8a880" roughness={0.5} metalness={0} transparent opacity={0.3} />
      </mesh>
      <pointLight color={accent} intensity={1} distance={4} />
    </group>
  );
}

function Cloud({ accent }: ModelProps) {
  return (
    <group>
      {[[0, 0, 0, 0.5], [0.5, -0.1, 0, 0.4], [-0.5, -0.05, 0, 0.42], [0.2, 0.25, 0, 0.35], [-0.2, 0.22, 0, 0.32], [0.1, -0.3, 0, 0.3], [-0.35, 0.12, 0, 0.28]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 32, 32]} />
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
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
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
      <mesh position={[0, -0.45, 0.2]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial {...matte("#1a0f08")} />
      </mesh>
      <mesh position={[0, 0.42, 0.5]}>
        <boxGeometry args={[0.5, 0.02, 0.06]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.9} />
      </mesh>
      {[0.3, -0.3].map((x, i) => (
        <mesh key={`btn-${i}`} position={[x, 0.42, 0.36]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      ))}
      <pointLight position={[0, 0.2, 0.5]} color={accent} intensity={1} distance={3} />
    </group>
  );
}

function Car({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 0.7]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[-0.1, 0.35, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.65]} />
        <meshStandardMaterial {...metal("#5a3a1a")} />
      </mesh>
      <mesh position={[-0.1, 0.35, 0.33]}>
        <boxGeometry args={[0.7, 0.2, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.1, 0.35, -0.33]}>
        <boxGeometry args={[0.7, 0.2, 0.02]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.3, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial {...metal("#1a0f08")} />
          </mesh>
          <mesh position={[x, -0.3, -0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial {...metal("#1a0f08")} />
          </mesh>
          {Array.from({ length: 4 }).map((_, j) => {
            const a = (j / 4) * Math.PI * 2;
            return (
              <mesh key={j} position={[x + Math.cos(a) * 0.1, -0.3, Math.sin(a) * 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
                <meshStandardMaterial {...metal("#3a2410")} />
              </mesh>
            );
          })}
        </group>
      ))}
      <mesh position={[0.2, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.55, 0.25, 0.36]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff8c0" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.55, 0.25, -0.36]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff8c0" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.7, 0.15, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.45]} />
        <meshStandardMaterial {...metal("#b8893f")} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Smartphone({ accent }: ModelProps) {
  return (
    <group rotation={[0.1, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 1.4, 0.12]} />
        <meshStandardMaterial {...metal("#1a0f08")} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.62, 1.3, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0.065]}>
        <boxGeometry args={[0.15, 0.04, 0.01]} />
        <meshStandardMaterial color="#1a0f08" />
      </mesh>
      <mesh position={[0, 0.64, 0.065]}>
        <boxGeometry args={[0.04, 0.015, 0.01]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.25, -0.6, 0.07]}>
        <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <mesh position={[0.25, -0.65, 0.07]}>
        <boxGeometry args={[0.01, 0.02, 0.01]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
      <pointLight color={accent} intensity={0.8} distance={2} />
    </group>
  );
}

function Transformer({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial {...matte("#2a1810")} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial {...metal("#5a4222")} />
      </mesh>
      {[-0.18, 0, 0.18].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25, 0.04, 8, 32]} />
          <meshStandardMaterial {...metal("#caa05a", accent, 0.3)} />
        </mesh>
      ))}
      {[0.15, -0.15].map((z, i) => (
        <mesh key={`fin-${i}`} position={[0.04, 0, z]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial {...metal("#3a2410")} />
        </mesh>
      ))}
      <pointLight color={accent} intensity={0.8} distance={3} />
    </group>
  );
}

function Rocket({ accent }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 24]} />
        <meshStandardMaterial {...metal("#e0e0e0")} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[0.2, 0.4, 24]} />
        <meshStandardMaterial {...metal("#b8893f")} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial {...metal("#caa05a")} />
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
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.4]} />
        <meshStandardMaterial {...metal("#c9a05a")} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.45]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[-0.1, 0.6, 0.25]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.1, 0.6, 0.25]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.53, 0.22]}>
        <boxGeometry args={[0.08, 0.03, 0.01]} />
        <meshStandardMaterial color="#1a0a0a" />
      </mesh>
      <mesh position={[0, 0.0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.35]} />
        <meshStandardMaterial {...metal("#8a6a2e")} />
      </mesh>
      <mesh position={[0, 0.35, 0.18]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]} rotation={[0, 0, i ? -0.1 : 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
          <meshStandardMaterial {...metal("#b8893f")} />
        </mesh>
      ))}
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={`elbow-${i}`} position={[x * 0.7, -0.35, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial {...metal("#caa05a")} />
        </mesh>
      ))}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          <meshStandardMaterial {...metal("#5a4222")} />
        </mesh>
      ))}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={`foot-${i}`} position={[x, -0.88, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.2]} />
          <meshStandardMaterial {...metal("#5a4222")} />
        </mesh>
      ))}
      <mesh position={[0, -0.88, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.12]} />
        <meshStandardMaterial {...metal("#3a2410")} />
      </mesh>
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

  const connectionLines = useMemo(() => {
    const lines: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    nodes.forEach((n) =>
      nodes
        .filter((m) => m.layer === n.layer + 1)
        .forEach((m) => lines.push({ from: n.pos, to: m.pos }))
    );
    return lines;
  }, [nodes]);

  return (
    <group>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
        </mesh>
      ))}
      {connectionLines.map((l, i) => (
        <ConnectionLine key={i} from={l.from} to={l.to} accent={accent} />
      ))}
      <pointLight color={accent} intensity={1.2} distance={4} />
    </group>
  );
}

function ConnectionLine({
  from,
  to,
  accent,
  offset = 0,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  accent: string;
  offset?: number;
}) {
  const { mid, len } = useMemo(() => {
    const f = from.clone();
    const t = to.clone();
    if (offset) {
      f.x += offset;
      t.x += offset;
    }
    const mid = f.lerp(t, 0.5);
    const len = from.distanceTo(to);
    return { mid, len };
  }, [from, to, offset]);
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

export function ArtifactModel({ motif, accent, spinning, onPartClick, selectedPart }: {
  motif: Motif;
  accent: string;
  spinning?: boolean;
  onPartClick?: (partId: string) => void;
  selectedPart?: string | null;
}) {
  const Cmp = MODEL_MAP[motif] ?? Gear;
  return <Cmp accent={accent} spinning={spinning} onPartClick={onPartClick} selectedPart={selectedPart} />;
}

export function motifHasModel(motif: Motif): boolean {
  return motif in MODEL_MAP;
}

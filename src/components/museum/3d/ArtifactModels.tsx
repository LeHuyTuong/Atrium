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
  const crankGroupRef = useRef<THREE.Group>(null);
  const pistonRodRef = useRef<THREE.Group>(null);
  const pistonRef = useRef<THREE.Group>(null);
  const conrodRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);
  const governorRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  const castIronTex = useCastIronTex();
  const brassTex = useBrassTex();
  const copperTex = useCopperTex();

  /* ---------- engine geometry constants ---------- */
  const BEAM_PIVOT_X = 0;
  const BEAM_PIVOT_Y = 0.88;
  const BEAM_LEFT = -1.15;
  const BEAM_RIGHT = 1.35;
  const CRANK_X = 1.55;
  const CRANK_Y = 0.05;
  const CRANK_R = 0.18;
  const STROKE_AMP = 0.25;
  const CYLINDER_X = -1.2;
  const CYLINDER_CENTER_Y = 0.45;

  useFrame((_, delta) => {
    if (!spinning) return;
    let t = 0;
    if (flywheelRef.current) {
      flywheelRef.current.rotation.z += delta * 1.8;
      t = flywheelRef.current.rotation.z;
    }

    // Piston vertical position (up-down stroke)
    const pistonY = CYLINDER_CENTER_Y + STROKE_AMP * Math.cos(t);

    // Beam angle: piston pushes left end of beam up/down
    // leftEndY = BEAM_PIVOT_Y + BEAM_LEFT * sin(beamAngle)
    // since BEAM_LEFT is negative: leftEndY = 0.88 - 1.15 * sin(beamAngle)
    // beamAngle = asin((BEAM_PIVOT_Y - leftEndY) / -BEAM_LEFT)
    const rawSin = (BEAM_PIVOT_Y - pistonY) / -BEAM_LEFT;
    const beamAngle = Math.asin(Math.max(-1, Math.min(1, rawSin)));

    if (beamRef.current) {
      beamRef.current.rotation.z = beamAngle;
    }

    // Piston rod: crosshead (at local y=0.32) should meet beam left end
    if (pistonRodRef.current) {
      const leftEndY = BEAM_PIVOT_Y + BEAM_LEFT * Math.sin(beamAngle);
      pistonRodRef.current.position.y = leftEndY - 0.32;
    }

    // Piston itself inside the cylinder
    if (pistonRef.current) {
      pistonRef.current.position.y = pistonY;
    }

    // Right end of beam
    const rightEndX = BEAM_PIVOT_X + BEAM_RIGHT * Math.cos(beamAngle);
    const rightEndY = BEAM_PIVOT_Y + BEAM_RIGHT * Math.sin(beamAngle);

    // Crank position — the crank arm rotates with the flywheel
    const crankX = CRANK_X + CRANK_R * Math.sin(t);
    const crankY = CRANK_Y + CRANK_R * Math.cos(t);

    // Connecting rod from beam right end to crank
    if (conrodRef.current) {
      conrodRef.current.position.x = (rightEndX + crankX) / 2;
      conrodRef.current.position.y = (rightEndY + crankY) / 2;
      const dx = crankX - rightEndX;
      const dy = crankY - rightEndY;
      const len = Math.hypot(dx, dy);
      conrodRef.current.scale.set(1, Math.max(0.1, len / 0.9), 1);
      conrodRef.current.rotation.z = Math.atan2(dy, dx);
    }

    // Crank arm rotates with flywheel
    if (crankGroupRef.current) {
      crankGroupRef.current.rotation.z = t;
    }

    // Governor spins with flywheel speed
    if (governorRef.current) {
      governorRef.current.rotation.z = -t * 2.5;
    }

    // Planet gear rotates
    if (planetRef.current) {
      planetRef.current.rotation.z = -t * 2.2;
    }

    // Steam particles
    if (steamRef.current) {
      const pos = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += delta * (0.12 + Math.random() * 0.08);
        pos[i] += Math.sin(pos[i + 2] * 2 + t) * delta * 0.03;
        pos[i + 2] += Math.cos(pos[i] * 3) * delta * 0.015;
        if (pos[i + 1] > 1.5) {
          pos[i] = CYLINDER_X + (Math.random() - 0.5) * 0.3;
          pos[i + 1] = 0.65 + Math.random() * 0.1;
          pos[i + 2] = (Math.random() - 0.5) * 0.4;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const steamPositions = useMemo(() => {
    const n = 50;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = CYLINDER_X + (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 1] = 0.65 + Math.random() * 0.7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return arr;
  }, []);

  /* ---------- materials ---------- */
  const brass = { ...metal("#c9922a"), map: brassTex };
  const darkBrass = { ...metal("#a87822"), map: brassTex };
  const copper = { ...metal("#c9762e"), map: copperTex };
  const iron = { ...metal("#b8893f"), map: castIronTex, roughness: 0.5 };
  const steel = { ...metal("#e6c27a"), roughness: 0.2, metalness: 0.95 };
  const woodBrown = { color: "#5a3a1a", roughness: 0.85, metalness: 0.0 };
  const woodDark = { color: "#3a2410", roughness: 0.85, metalness: 0.0 };

  /*
   * Watt beam engine — vertical layout (c. 1788)
   *
   *   [Governor]
   *       |
   * [Walking Beam ════◎═══════════]
   *    |   (pivot at x=0, y=0.88)   \
   *    |                              [Connecting rod]
   * [Piston rod]                         |
   *    |                              [Sun/Planet gear]
   * [Cylinder]                        |
   *    |                           [Flywheel]
   * [Condenser]───[steam pipes]──┘
   *  ==========[Base frame]==========
   */

  return (
    <group ref={groupRef} rotation={[0, 0, 0.02]}>
      {/* ═══════════ BASE & A-FRAME ═══════════ */}
      <mesh position={[0, -0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.0, 0.2, 1.4]} />
        <meshStandardMaterial {...iron} />
      </mesh>
      <mesh position={[0, -0.63, 0]}>
        <boxGeometry args={[4.1, 0.05, 1.5]} />
        <meshStandardMaterial {...{ ...metal("#5a4222"), map: castIronTex, roughness: 0.5 }} />
      </mesh>
      {/* base feet */}
      {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
        <mesh key={i} position={[x, -0.88, 0]} castShadow>
          <boxGeometry args={[0.3, 0.12, 1.2]} />
          <meshStandardMaterial {...iron} />
        </mesh>
      ))}

      {/* A-frame: two diagonal legs from base to beam pivot */}
      <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.52]} castShadow>
        <boxGeometry args={[0.12, 1.1, 0.35]} />
        <meshStandardMaterial {...iron} />
      </mesh>
      <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -0.52]} castShadow>
        <boxGeometry args={[0.12, 1.1, 0.35]} />
        <meshStandardMaterial {...iron} />
      </mesh>
      {/* A-frame cross braces */}
      <mesh position={[-0.2, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.14]} />
        <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.2), map: brassTex, roughness: 0.35 }} />
      </mesh>
      <mesh position={[-0.25, 0.6, 0]}>
        <boxGeometry args={[0.65, 0.06, 0.14]} />
        <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.2), map: brassTex, roughness: 0.35 }} />
      </mesh>
      {/* A-frame top cap with bearing */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.35, 0.14, 0.32]} />
        <meshStandardMaterial {...{ ...metal("#7a5a2e", accent, 0.25), map: brassTex, roughness: 0.35 }} />
      </mesh>

      {/* ═══════════ CYLINDER (vertical) ═══════════ */}
      <group position={[CYLINDER_X, 0, 0]}>
        {/* Main cylinder body — iron jacket */}
        <mesh position={[0, CYLINDER_CENTER_Y, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.38, 0.7, 32]} />
          <meshStandardMaterial {...{ ...metal("#6a4a22"), map: castIronTex, roughness: 0.5 }} />
        </mesh>
        {/* Insulation lagging (wooden staves look) */}
        <mesh position={[0, CYLINDER_CENTER_Y, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.66, 24]} />
          <meshStandardMaterial {...woodDark} />
        </mesh>
        {/* Cylinder bands — glowing accent rings */}
        {[-0.28, 0, 0.28].map((y, i) => (
          <mesh key={i} position={[0, CYLINDER_CENTER_Y + y, 0]}>
            <torusGeometry args={[0.4, 0.025, 8, 24]} />
            <meshStandardMaterial {...{ ...metal("#caa05a", accent, 0.35), map: brassTex, roughness: 0.3 }} />
          </mesh>
        ))}
        {/* Bottom flange */}
        <mesh position={[0, CYLINDER_CENTER_Y - 0.37, 0]} castShadow>
          <cylinderGeometry args={[0.44, 0.46, 0.06, 24]} />
          <meshStandardMaterial {...iron} />
        </mesh>
        {/* Top flange */}
        <mesh position={[0, CYLINDER_CENTER_Y + 0.37, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.4, 0.06, 24]} />
          <meshStandardMaterial {...iron} />
        </mesh>
      </group>

      {/* ═══════════ STEAM CHEST (valve gear on top of cylinder) ═══════════ */}
      <group position={[CYLINDER_X, CYLINDER_CENTER_Y + 0.52, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.12, 0.2]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.35), map: brassTex, roughness: 0.3 }} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.24]} />
          <meshStandardMaterial {...{ ...metal("#caa05a", accent, 0.25), map: brassTex, roughness: 0.3 }} />
        </mesh>
        {/* Valve rod */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Steam outlet pipe elbow */}
        <mesh position={[0.15, 0.06, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.3), map: brassTex, roughness: 0.3 }} />
        </mesh>
      </group>

      {/* ═══════════ SEPARATE CONDENSER (Watt's key innovation) ═══════════ */}
      <group position={[CYLINDER_X, -0.35, 0]}>
        {/* Condenser vessel — copper cylinder with warm glow */}
        <mesh position={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.35, 24]} />
          <meshStandardMaterial {...{ ...metal("#c9762e", accent, 0.15), map: copperTex, roughness: 0.3 }} />
        </mesh>
        <mesh position={[0.2, 0.2, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.04, 24]} />
          <meshStandardMaterial {...{ ...metal("#d4884a", accent, 0.2), map: copperTex, roughness: 0.3 }} />
        </mesh>
        {/* Cold water tank around condenser */}
        <mesh position={[0.2, 0, 0.3]}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshStandardMaterial {...woodDark} />
        </mesh>
        {/* Steam pipe from cylinder to condenser */}
        <mesh position={[-0.05, 0.12, 0]} rotation={[0, 0, -0.8]}>
          <cylinderGeometry args={[0.022, 0.025, 0.28, 8]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e", accent, 0.25), map: brassTex, roughness: 0.3 }} />
        </mesh>
        {/* Air pump beside condenser */}
        <mesh position={[0.42, -0.02, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.28, 16]} />
          <meshStandardMaterial {...iron} />
        </mesh>
        <mesh position={[0.42, 0.15, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.04, 16]} />
          <meshStandardMaterial {...iron} />
        </mesh>
      </group>

      {/* ═══════════ PISTON & ROD (vertical) ═══════════ */}
      {/* Piston inside cylinder */}
      <group ref={pistonRef} position={[CYLINDER_X, CYLINDER_CENTER_Y, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.25), map: brassTex, roughness: 0.3 }} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.04, 0.04, 12]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* Piston rod — goes from piston up to beam */}
      <group ref={pistonRodRef} position={[CYLINDER_X, 0.45, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.6, 12]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Crosshead at top of rod */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.14, 0.06, 0.18]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.3), map: brassTex, roughness: 0.3 }} />
        </mesh>
        {/* Pin joint at crosshead */}
        <mesh position={[0, 0.32, 0.12]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* ═══════════ PARALLEL MOTION LINKAGE (Watt's parallel motion) ═══════════ */}
      <group position={[CYLINDER_X, 0.38, 0]}>
        {/* Radius bar — from A-frame area to piston rod */}
        <mesh position={[0.55, 0.32, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.55, 0.02, 0.02]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Another radius bar */}
        <mesh position={[0.55, 0.36, 0.06]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.55, 0.015, 0.015]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Small linking rod (parallel motion parallelogram) */}
        <mesh position={[0.85, 0.5, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.3, 0.015, 0.015]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Vertical guide bar */}
        <mesh position={[0, 0.2, 0.08]}>
          <boxGeometry args={[0.008, 0.35, 0.008]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* ═══════════ WALKING BEAM (massive wooden beam) ═══════════ */}
      <group
        ref={beamRef}
        position={[BEAM_PIVOT_X, BEAM_PIVOT_Y, 0]}
        rotation={[0, 0, 0]}
      >
        {/* Main beam body — wood with metal strapping */}
        <mesh castShadow>
          <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.12, 0.28]} />
          <meshStandardMaterial {...woodBrown} />
        </mesh>
        {/* Beam center reinforcement */}
        <mesh castShadow>
          <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.14, 0.14]} />
          <meshStandardMaterial {...woodDark} />
        </mesh>
        {/* Metal strapping on top — subtle glow */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.02, 0.06]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.2), map: brassTex, roughness: 0.35 }} />
        </mesh>
        {/* Metal strapping on bottom — subtle glow */}
        <mesh position={[0, -0.07, 0]}>
          <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.02, 0.06]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.2), map: brassTex, roughness: 0.35 }} />
        </mesh>
        {/* Pivot bearing at center */}
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.4), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Pivot axle */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Left end — arch head (connecting to piston rod) */}
        <mesh position={[BEAM_LEFT, 0.08, 0]}>
          <boxGeometry args={[0.16, 0.08, 0.32]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e", accent, 0.3), map: brassTex, roughness: 0.3 }} />
        </mesh>
        <mesh position={[BEAM_LEFT, 0.04, 0.2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Right end — arch head (connecting to connecting rod) */}
        <mesh position={[BEAM_RIGHT, 0.08, 0]}>
          <boxGeometry args={[0.16, 0.08, 0.32]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e", accent, 0.3), map: brassTex, roughness: 0.3 }} />
        </mesh>
        <mesh position={[BEAM_RIGHT, 0.04, 0.2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.06, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Decorative bolts along beam with accent glow */}
        {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.15]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
            <meshStandardMaterial {...{ ...metal("#caa05a", accent, 0.5), map: brassTex, roughness: 0.25 }} />
          </mesh>
        ))}
      </group>

      {/* ═══════════ CONNECTING ROD (beam right end → crank) ═══════════ */}
      <mesh ref={conrodRef} position={[1.1, 0.5, 0]}>
        <boxGeometry args={[0.05, 0.9, 0.06]} />
        <meshStandardMaterial {...steel} />
      </mesh>

      {/* ═══════════ CRANK & SUN-AND-PLANET GEAR ═══════════ */}
      <group ref={crankGroupRef} position={[CRANK_X, CRANK_Y, 0]}>
        {/* Crank arm with accent edge glow */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.06, CRANK_R * 2, 0.08]} />
          <meshStandardMaterial {...{ ...metal("#3a2a1a", accent, 0.15), map: castIronTex, roughness: 0.5 }} />
        </mesh>
        {/* Crank pin */}
        <mesh position={[0, CRANK_R, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.5), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Sun gear (fixed on shaft) */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.35), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Sun gear teeth (simplified as torus) */}
        <mesh>
          <torusGeometry args={[0.13, 0.025, 8, 24]} />
          <meshStandardMaterial {...{ ...metal("#9a7a3e", accent, 0.3), map: brassTex, roughness: 0.3 }} />
        </mesh>
        {/* Planet gear (revolves around sun gear) */}
        <mesh ref={planetRef} position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial {...{ ...metal("#caa05a", accent, 0.35), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Planet gear arm */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.03, 0.28, 0.03]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* ═══════════ FLYWHEEL ═══════════ */}
      <group
        ref={flywheelRef}
        position={[CRANK_X + 0.25, CRANK_Y + 0.05, 0]}
        rotation={[0, 0, 0]}
      >
        {/* Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.6, 0.06, 16, 48]} />
          <meshStandardMaterial
            {...{
              ...metal("#7a5a2e", accent, 0.12),
              map: castIronTex,
              roughness: 0.35,
            }}
          />
        </mesh>
        {/* Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 24]} />
          <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.25), map: brassTex, roughness: 0.3 }} />
        </mesh>
        {/* 8 spokes with subtle accent glow */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                0,
                Math.cos(a) * 0.35,
                Math.sin(a) * 0.35,
              ]}
              rotation={[Math.cos(a), 0, 0]}
            >
              <boxGeometry args={[0.06, 0.5, 0.04]} />
              <meshStandardMaterial {...{ ...metal("#4a3a2a", accent, 0.12), map: castIronTex, roughness: 0.5 }} />
            </mesh>
          );
        })}
        {/* Outer accent ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.62, 0.015, 8, 48]} />
          <meshStandardMaterial {...{ ...metal(accent, accent, 0.7), transparent: true, opacity: 0.7 }} />
        </mesh>
        {/* Shaft */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.55, 12]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* ═══════════ CENTRIFUGAL GOVERNOR (Watt's Speed Regulator) ═══════════ */}
      <group ref={governorRef} position={[0.25, 1.1, 0]}>
        {/* Spindle */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        {/* Bevel gear at base */}
        <mesh>
          <torusGeometry args={[0.04, 0.015, 6, 12]} />
          <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.4), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Two flyballs on articulated arms */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[0, 0.2, 0]} rotation={[0, 0, side * 0.5]}>
            {/* Arm */}
            <mesh position={[side * 0.12, -0.05, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.25, 6]} />
              <meshStandardMaterial {...{ ...metal("#9a9a9a", accent, 0.15), roughness: 0.2, metalness: 0.95 }} />
            </mesh>
            {/* Ball weight — glowing brass */}
            <mesh position={[side * 0.22, -0.16, 0]} castShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                {...{
                  ...metal("#b8893f", accent, 0.5),
                  map: brassTex,
                  roughness: 0.25,
                }}
              />
            </mesh>
            {/* Collar link */}
            <mesh position={[side * 0.08, -0.18, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
              <meshStandardMaterial {...{ ...metal("#9a9a9a", accent, 0.12), roughness: 0.2, metalness: 0.95 }} />
            </mesh>
          </group>
        ))}
        {/* Top knob */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial {...{ ...metal("#caa05a", accent, 0.4), map: brassTex, roughness: 0.25 }} />
        </mesh>
        {/* Throttle linkage rod going down */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 6]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </group>

      {/* ═══════════ STEAM PIPES ═══════════ */}
      {/* Pipe from cylinder top to condenser */}
      <mesh position={[CYLINDER_X + 0.15, -0.05, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.02, 0.025, 0.5, 8]} />
        <meshStandardMaterial {...{ ...metal("#8a6a2e", accent, 0.25), map: brassTex, roughness: 0.3 }} />
      </mesh>
      {/* Short pipe from steam chest side */}
      <mesh position={[CYLINDER_X + 0.3, CYLINDER_CENTER_Y + 0.55, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial {...{ ...metal("#b8893f", accent, 0.3), map: brassTex, roughness: 0.3 }} />
      </mesh>

      {/* ═══════════ STEAM PARTICLES ═══════════ */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#f0e8d8"
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ═══════════ AMBIENT ACCENT LIGHT ═══════════ */}
      <pointLight
        position={[-0.4, 0.6, 1.8]}
        color={accent}
        intensity={0.6}
        distance={5}
        decay={2}
      />
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

import Dynamo3D from "@/components/dynamo/Dynamo3D";

function Dynamo({ accent, spinning }: ModelProps) {
  const visibleAll = {
    housing: true, magnets: true, armature: true, windings: true,
    commutator: true, brushes: true, shaft: true, bearings: true, terminals: true
  };
  const labelsNone = {
    housing: false, magnets: false, armature: false, windings: false,
    commutator: false, brushes: false, shaft: false, bearings: false, terminals: false
  };

  return (
    <group position={[0, -0.1, 0]} scale={0.2}>
      <Dynamo3D
        rotationSpeed={spinning ? 12 : 0}
        isGenerating={!!spinning}
        visible={visibleAll}
        labels={labelsNone}
        explode={0}
      />
      <pointLight color={accent} intensity={1.2} distance={3} />
    </group>
  );
}

import { OttoEngineModel } from "@/components/otto-engine/OttoEngineModel";

function OttoEngine({ accent }: ModelProps) {
  return (
    <group position={[0, -0.2, 0]} scale={0.7}>
      <OttoEngineModel isSimMaster={false} />
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

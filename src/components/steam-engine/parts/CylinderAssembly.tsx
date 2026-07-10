"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Mesh } from "three";
import {
  makeCastIron,
  makePolishedBrass,
  makeSteel,
  makeBluedSteel,
  makeCopper,
} from "./materials";
import { engineClock } from "../engineClock";
import { ENGINE_GEOMETRY } from "@/lib/kinematics";

const CYL_X = ENGINE_GEOMETRY.cylinderX; // -2.4
const CYL_BOTTOM = 0.5;
const CYL_TOP = 2.5;
const BORE = 0.68;
const OUTER = 1.02;
const PISTON_ROD_LEN = 2.43; // pistonRodLength − 0.17 (constant)

export interface CylinderProps {
  crossSection: boolean;
  highlight: boolean;
  onSelect: (id: string) => void;
}

/** Vertical steam cylinder with piston, piston rod, top/bottom covers,
 *  stuffing box, side-mounted steam chest with a slide valve, and a
 *  cutaway mode that opens the front half so the piston is visible.
 *  Piston & valve self-animate from engineClock. */
export function CylinderAssembly({
  crossSection,
  highlight,
  onSelect,
}: CylinderProps) {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("cylinder");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Cylinder body (or half-shell when cut away) */}
      <CylinderWall cut={crossSection} highlight={highlight} />

      {/* Top cover */}
      <mesh position={[CYL_X, CYL_TOP + 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[OUTER * 0.55, OUTER * 0.55, 0.18, 32]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh position={[CYL_X, CYL_TOP + 0.2, 0]} castShadow>
        <cylinderGeometry args={[OUTER * 0.62, OUTER * 0.55, 0.08, 32]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>

      {/* Stuffing box (where piston rod exits the top cover) */}
      <mesh position={[CYL_X, CYL_TOP + 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.18, 16]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>

      {/* Bottom cover */}
      <mesh position={[CYL_X, CYL_BOTTOM - 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[OUTER * 0.55, OUTER * 0.55, 0.18, 32]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh position={[CYL_X, CYL_BOTTOM - 0.2, 0]} castShadow>
        <cylinderGeometry args={[OUTER * 0.55, OUTER * 0.5, 0.08, 32]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>

      {/* Tie-rod bolts around the cylinder (4 decorative) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
        <mesh
          key={`bolt-${i}`}
          position={[
            CYL_X + Math.cos(a) * (OUTER * 0.5),
            (CYL_TOP + CYL_BOTTOM) / 2,
            Math.sin(a) * (OUTER * 0.5),
          ]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.03, CYL_TOP - CYL_BOTTOM + 0.1, 8]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}

      {/* Piston (inside) — always rendered; visible when cut away */}
      <Piston cut={crossSection} />

      {/* Piston rod from piston top up through stuffing box to beam left end */}
      <PistonRod />

      {/* Gland nut at stuffing box (fixed) */}
      <mesh position={[CYL_X, 2.95, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>

      {/* Steam chest on the +Z side of the cylinder top */}
      <SteamChest cut={crossSection} />
    </group>
  );
}

function CylinderWall({ cut, highlight }: { cut: boolean; highlight: boolean }) {
  const height = CYL_TOP - CYL_BOTTOM;
  const cy = (CYL_TOP + CYL_BOTTOM) / 2;
  const ironMat = highlight
    ? new THREE.MeshStandardMaterial({
        color: "#ffb347",
        emissive: "#ff8a00",
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.4,
      })
    : makeCastIron();
  if (cut) {
    // Back-half shell (front open toward viewer +Z)
    return (
      <group>
        <mesh
          position={[CYL_X, cy, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[OUTER, OUTER, height, 40, 1, true, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color={highlight ? "#ffb347" : "#3a3d42"}
            emissive={highlight ? "#ff8a00" : "#000000"}
            emissiveIntensity={highlight ? 0.35 : 0}
            metalness={0.85}
            roughness={0.55}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Inner bore wall (back half) */}
        <mesh position={[CYL_X, cy, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <cylinderGeometry args={[BORE, BORE, height, 40, 1, true, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#2a2d31" metalness={0.6} roughness={0.5} side={THREE.BackSide} />
        </mesh>
        {/* Cut rim highlights (top & bottom of the cut) */}
        <mesh position={[CYL_X, CYL_TOP, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BORE, OUTER, 32, 1, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#5a3a22" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[CYL_X, CYL_BOTTOM, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BORE, OUTER, 32, 1, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#5a3a22" side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }
  return (
    <mesh
      position={[CYL_X, cy, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[OUTER, OUTER, height, 40]} />
      <primitive object={ironMat} attach="material" />
    </mesh>
  );
}

function Piston({ cut }: { cut: boolean }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.y = engineClock.pistonY;
  });
  return (
    <group ref={ref} position={[CYL_X, 1.6, 0]}>
      {/* Piston body */}
      <mesh castShadow>
        <cylinderGeometry args={[BORE * 0.96, BORE * 0.96, 0.34, 32]} />
        <primitive object={makeBluedSteel()} attach="material" />
      </mesh>
      {/* Piston rings */}
      {[-0.1, 0.1].map((dy) => (
        <mesh key={`ring-${dy}`} position={[0, dy, 0]}>
          <torusGeometry args={[BORE * 0.97, 0.018, 8, 32]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}
      {/* Piston crown bolts */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      {/* Bore interior highlight when cut */}
      {cut && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff8a2a" />
        </mesh>
      )}
    </group>
  );
}

function PistonRod() {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    // Rod centre Y = beam left end Y − (rodLength/2)
    const leftEndY =
      ENGINE_GEOMETRY.fulcrum[1] -
      ENGINE_GEOMETRY.halfLen * Math.sin(engineClock.alpha);
    ref.current.position.y = leftEndY - PISTON_ROD_LEN / 2;
  });
  return (
    <group ref={ref} position={[CYL_X, 0, 0]}>
      {/* Rod (constant length) */}
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.055, PISTON_ROD_LEN, 16]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Chain link / clevis at the top (attaches to beam) */}
      <mesh position={[0, PISTON_ROD_LEN / 2, 0]} castShadow>
        <torusGeometry args={[0.1, 0.03, 10, 20]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
    </group>
  );
}

function SteamChest({ cut }: { cut: boolean }) {
  const valveRef = useRef<Mesh>(null);
  const valveRodRef = useRef<Mesh>(null);
  useFrame(() => {
    const v = engineClock.valveOpen;
    if (valveRef.current) valveRef.current.position.z = -0.05 - v * 0.18;
    if (valveRodRef.current) valveRodRef.current.position.y = 0.35 + v * 0.18;
  });
  // Mounted on +Z side of the cylinder top
  const z = cut ? 0.55 : 0.62;
  return (
    <group position={[CYL_X, CYL_TOP - 0.05, z]}>
      {/* Chest body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.55, 0.3]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Chest cover (brass) */}
      <mesh position={[0, 0, 0.16]} castShadow>
        <boxGeometry args={[0.92, 0.57, 0.04]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      {/* Bolts around the cover */}
      {[-0.38, -0.13, 0.13, 0.38].map((x) =>
        [-0.2, 0.2].map((yy) => (
          <mesh
            key={`cb-${x}-${yy}`}
            position={[x, yy, 0.19]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.04, 8]} />
            <primitive object={makeSteel()} attach="material" />
          </mesh>
        )),
      )}
      {/* Slide valve (D-valve) inside, moving horizontally */}
      <mesh ref={valveRef} position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.12]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      {/* Valve rod sticking out the top */}
      <mesh ref={valveRodRef} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Steam ports (two slots into the cylinder) */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={`port-${x}`} position={[x, -0.1, -0.16]}>
          <boxGeometry args={[0.08, 0.18, 0.06]} />
          <meshStandardMaterial color="#1a1c1f" />
        </mesh>
      ))}
    </group>
  );
}

/** Exhaust pipe from the bottom of the cylinder down to the condenser. */
export function ExhaustPipe() {
  return (
    <group>
      <mesh position={[CYL_X, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 16]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      <mesh position={[CYL_X, 0.13, 0]}>
        <torusGeometry args={[0.14, 0.14, 12, 16, Math.PI / 2]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Horizontal run to condenser */}
      <mesh position={[-2.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 1.0, 16]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      {/* Flange */}
      <mesh position={[-3.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
    </group>
  );
}

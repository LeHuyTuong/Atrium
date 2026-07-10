"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { makeCastIron, makePolishedBrass, makeSteel } from "./materials";
import { engineClock } from "../engineClock";
import { ENGINE_GEOMETRY } from "@/lib/kinematics";

const GEO = ENGINE_GEOMETRY;
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _quat = new THREE.Quaternion();

export interface ConnectingRodProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

/** The connecting rod (pitman) linking the beam's right end to the crank pin.
 *  Rendered as an I-beam-style rod with a small-end clevis at the top and a
 *  big-end bearing eye at the bottom. Self-positions every frame from
 *  engineClock. */
export function ConnectingRod({ highlight, onSelect }: ConnectingRodProps) {
  const ref = useRef<Group>(null);

  // Precompute a unit-length reference so we can scale the shaft to fit.
  const REF_LEN = 3.4;

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const alpha = engineClock.alpha;
    const theta = engineClock.theta;
    const [fx, fy] = GEO.fulcrum;
    const [wx, wy] = GEO.flywheelCenter;
    _a.set(fx + GEO.halfLen * Math.cos(alpha), fy + GEO.halfLen * Math.sin(alpha), 0);
    _b.set(wx + GEO.crankRadius * Math.cos(theta), wy + GEO.crankRadius * Math.sin(theta), 0);
    _dir.copy(_b).sub(_a);
    const len = _dir.length();
    _quat.setFromUnitVectors(Y_AXIS, _dir.normalize());
    g.position.copy(_a).add(_b).multiplyScalar(0.5);
    g.quaternion.copy(_quat);
    g.scale.set(1, len / REF_LEN, 1);
  });

  const highlightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffb347",
        emissive: "#ff8a00",
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.4,
      }),
    [],
  );
  const mat = highlight ? highlightMat : makeSteel();

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("conrod");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Main I-beam shaft (unit REF_LEN; scaled each frame) */}
      <mesh castShadow>
        <boxGeometry args={[0.14, REF_LEN - 0.6, 0.1]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Flanges */}
      <mesh position={[0, 0, 0.07]} castShadow>
        <boxGeometry args={[0.14, REF_LEN - 0.6, 0.04]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[0, 0, -0.07]} castShadow>
        <boxGeometry args={[0.14, REF_LEN - 0.6, 0.04]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Small-end (top, at beam) — clevis eye */}
      <group position={[0, REF_LEN / 2 - 0.18, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.34, 20]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      </group>

      {/* Big-end (bottom, at crank pin) — bearing eye */}
      <group position={[0, -(REF_LEN / 2 - 0.22), 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.4, 24]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.46, 20]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      </group>
      {/* Strap reinforcement near big end */}
      <mesh position={[0, -(REF_LEN / 2 - 0.45), 0]} castShadow>
        <boxGeometry args={[0.18, 0.3, 0.16]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
    </group>
  );
}

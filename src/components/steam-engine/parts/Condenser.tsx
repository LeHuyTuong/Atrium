"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  makeCastIron,
  makePolishedBrass,
  makeCopper,
  makeSteel,
} from "./materials";
import { engineClock } from "../engineClock";

const POS: [number, number, number] = [-3.5, 0.55, 0];

/** Watt's separate condenser — his most important invention. A chamber
 *  where exhaust steam is condensed by a cold-water spray, creating vacuum
 *  that pulls the piston down. Sits beside/below the cylinder with the
 *  air pump on top to remove condensed water + air. */
export function Condenser({ highlight }: { highlight: boolean }) {
  return (
    <group position={POS}>
      {/* Condenser chamber (cast-iron box) */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => e.stopPropagation()}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[0.8, 0.9, 0.7]} />
        <primitive
          object={
            highlight
              ? new THREE.MeshStandardMaterial({
                  color: "#ffb347",
                  emissive: "#ff8a00",
                  emissiveIntensity: 0.3,
                  metalness: 0.7,
                  roughness: 0.4,
                })
              : makeCastIron()
          }
          attach="material"
        />
      </mesh>
      {/* Brass bands around the chamber */}
      {[0.3, -0.3].map((y) => (
        <mesh key={`cb-${y}`} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.84, 0.06, 0.74]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}
      {/* Bolts */}
      {[0.38, -0.38].map((x) =>
        [0.3, -0.3].map((y) =>
          [0.36, -0.36].map((z) => (
            <mesh key={`cbolt-${x}-${y}-${z}`} position={[x, y, z]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <primitive object={makePolishedBrass()} attach="material" />
            </mesh>
          )),
        ),
      )}

      {/* Cold water injection pipe (entering the side) */}
      <mesh position={[-0.5, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
      <mesh position={[-0.7, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.06, 12]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      {/* Spray head inside (visible glow) */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#4a90c4" transparent opacity={0.5} />
      </mesh>

      {/* Air pump on top (small vertical pump) */}
      <group position={[0.18, 0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.5, 20]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.21, 0.2, 0.08, 20]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
        {/* Pump rod */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 10]} />
          <primitive object={makeSteel()} attach="material" />
        </mesh>
        {/* Pump top guide */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      </group>

      {/* Hot well / discharge pipe (bottom) */}
      <mesh position={[0.4, -0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <primitive object={makeCopper()} attach="material" />
      </mesh>
    </group>
  );
}

/** Watt's centrifugal governor — the iconic spinning-ball speed regulator.
 *  Spins with the engine RPM; balls fly outward as speed rises, raising the
 *  sleeve and (in reality) throttling the steam valve to hold constant speed.
 *  Reads live rpm from engineClock. Includes a linkage rod descending to the
 *  throttle valve to visualise the closed-loop control. */
export function Governor({
  position = [2.4, 3.0, 0.9] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const spinRef = useRef<THREE.Group>(null);
  const sleeveRef = useRef<THREE.Group>(null);
  const ballsRef = useRef<THREE.Group>(null);
  const linkageRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);

  useFrame((_, dt) => {
    const rpm = engineClock.rpm;
    // Governor spins faster than the main shaft (geared up)
    angle.current += (rpm / 60) * Math.PI * 2 * 3 * dt;
    if (spinRef.current) spinRef.current.rotation.y = angle.current;
    // Ball out-swing as a function of speed (centrifugal): theta ≈ ω²
    const omega = (rpm / 60) * Math.PI * 2 * 3;
    const swing = Math.min(0.7, omega * omega * 0.012);
    if (ballsRef.current) {
      ballsRef.current.children.forEach((c) => {
        c.rotation.z = -swing;
      });
    }
    // Sleeve rises with swing
    const sleeveY = swing * 0.45;
    if (sleeveRef.current) {
      sleeveRef.current.position.y = sleeveY;
    }
    // Linkage rod length adjusts with sleeve (it pushes the throttle lever)
    if (linkageRef.current) {
      linkageRef.current.scale.y = 1 + sleeveY * 0.6;
      linkageRef.current.position.y = -0.7 - sleeveY * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Support column */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 1.2, 16]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Column base */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.1, 16]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh position={[0, 0.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>

      {/* Spinning head */}
      <group ref={spinRef} position={[0, 0.1, 0]}>
        {/* Pivot crown */}
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
        {/* Two ball arms */}
        <group ref={ballsRef}>
          {[-1, 1].map((side) => (
            <group key={`arm-${side}`} position={[0, 0, 0]}>
              <group rotation={[0, 0, side * 0.4]} position={[0, 0, 0]}>
                <mesh position={[side * 0.3, 0.25, 0]} castShadow>
                  <boxGeometry args={[0.04, 0.6, 0.04]} />
                  <primitive object={makeSteel()} attach="material" />
                </mesh>
                {/* Ball — larger, more visible */}
                <mesh position={[side * 0.5, 0.5, 0]} castShadow>
                  <sphereGeometry args={[0.11, 20, 20]} />
                  <primitive object={makePolishedBrass()} attach="material" />
                </mesh>
                {/* Ball set-screw */}
                <mesh position={[side * 0.5, 0.5, 0.11]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
                  <primitive object={makeSteel()} attach="material" />
                </mesh>
              </group>
            </group>
          ))}
        </group>
        {/* Sleeve (slides up/down) */}
        <group ref={sleeveRef} position={[0, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
            <primitive object={makePolishedBrass()} attach="material" />
          </mesh>
          {/* Sleeve collar */}
          <mesh position={[0, -0.07, 0]}>
            <torusGeometry args={[0.085, 0.018, 8, 16]} />
            <primitive object={makePolishedBrass()} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Linkage rod from sleeve down toward the throttle (visualises feedback) */}
      <mesh ref={linkageRef} position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 10]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Bell-crank lever at the bottom */}
      <mesh position={[0, -1.05, 0]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.04]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
    </group>
  );
}

/** A belt from the crankshaft pulley to the governor, for visual completeness. */
export function GovernorBelt() {
  // Belt represented as a thin open cylinder linking the pulley & governor.
  return (
    <group>
      {/* Upper belt loop around governor pulley */}
      <mesh position={[2.4, 2.4, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.015, 6, 24]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.95} />
      </mesh>
      {/* Belt span 1 (top) from governor to crankshaft pulley */}
      <mesh
        position={[(2.4 + 4.6) / 2, 2.25, 0.9]}
        rotation={[0, 0, Math.atan2(2.1 - 2.4, 4.6 - 2.4)]}
        castShadow
      >
        <boxGeometry args={[Math.hypot(4.6 - 2.4, 2.1 - 2.4), 0.022, 0.012]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.95} />
      </mesh>
      {/* Belt span 2 (bottom) */}
      <mesh
        position={[(2.4 + 4.6) / 2, 2.55, 0.9]}
        rotation={[0, 0, Math.atan2(2.1 - 2.4, 4.6 - 2.4)]}
        castShadow
      >
        <boxGeometry args={[Math.hypot(4.6 - 2.4, 2.1 - 2.4), 0.022, 0.012]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.95} />
      </mesh>
    </group>
  );
}

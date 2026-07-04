"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { makeSteel, makePolishedBrass, makeCastIron, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const R = ENGINE_GEOMETRY.crankRadius;
const ROD_LEN = ENGINE_GEOMETRY.rodLength;
const CRANK_PHASES = [0, Math.PI, Math.PI, 0];
const REF_LEN = ROD_LEN;
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _quat = new THREE.Quaternion();

export interface ConnectingRodsProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function ConnectingRods({ highlight, onSelect }: ConnectingRodsProps) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const theta = engineClock.theta;
    const children = g.children;
    for (let i = 0; i < NUM && i < children.length; i++) {
      const rod = children[i] as Group;
      const cylTheta = theta + CRANK_PHASES[i];
      const sinT = Math.sin(cylTheta);
      const cosT = Math.cos(cylTheta);
      const wristPinX = 0;
      const wristPinY =
        ENGINE_GEOMETRY.deckHeight -
        ((ROD_LEN + R) - (R * cosT + Math.sqrt(ROD_LEN * ROD_LEN - R * R * sinT * sinT))) -
        0.4 +
        0.16;
      const crankPinX = R * Math.cos(cylTheta);
      const crankPinY = 0.4 + R * Math.sin(cylTheta);
      const z = (i - (NUM - 1) / 2) * SPACING;
      _a.set(wristPinX, wristPinY, z);
      _b.set(crankPinX, crankPinY, z);
      _dir.copy(_b).sub(_a);
      const len = _dir.length();
      _quat.setFromUnitVectors(Y_AXIS, _dir.normalize());
      rod.position.copy(_a).add(_b).multiplyScalar(0.5);
      rod.quaternion.copy(_quat);
      rod.scale.set(1, len / REF_LEN, 1);
    }
  });

  const sharedMat = highlight ? makeHighlight() : makeSteel();
  const bigEndMat = makeCastIron();
  const pinMat = makePolishedBrass();

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("conrods");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {Array.from({ length: NUM }).map((_, i) => (
        <group key={`conrod-${i}`} position={[0, 0, (i - (NUM - 1) / 2) * SPACING]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, REF_LEN - 0.3, 0.06]} />
            <primitive object={sharedMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.1, REF_LEN - 0.3, 0.02]} />
            <primitive object={sharedMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[0.1, REF_LEN - 0.3, 0.02]} />
            <primitive object={sharedMat} attach="material" />
          </mesh>
          <group position={[0, REF_LEN / 2 - 0.15, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
              <primitive object={bigEndMat} attach="material" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.26, 12]} />
              <primitive object={pinMat} attach="material" />
            </mesh>
          </group>
          <group position={[0, -(REF_LEN / 2 - 0.18), 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.3, 20]} />
              <primitive object={bigEndMat} attach="material" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.07, 0.07, 0.36, 14]} />
              <primitive object={pinMat} attach="material" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

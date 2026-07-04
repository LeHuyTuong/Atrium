"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { makeCastIron, makePolishedBrass, makeSteel, makeBluedSteel, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const RIM_R = 0.9;

export interface FlywheelProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Flywheel({ highlight, onSelect }: FlywheelProps) {
  const spinRef = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeCastIron();

  useFrame(() => {
    if (spinRef.current) {
      spinRef.current.rotation.z = engineClock.theta;
    }
  });

  const halfSpan = ((ENGINE_GEOMETRY.numCylinders - 1) * ENGINE_GEOMETRY.cylinderSpacing) / 2;

  return (
    <group>
      <mesh position={[0, 0.4, halfSpan + 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      <group ref={spinRef} position={[0, 0.4, halfSpan + 0.7]}>
        <FlywheelShape highlight={highlight} onSelect={onSelect} />

        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RIM_R, 0.04, 8, 40]} />
          <primitive object={makeSteel()} attach="material" />
        </mesh>

        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          return (
            <mesh
              key={`gear-${i}`}
              position={[Math.cos(a) * RIM_R, Math.sin(a) * RIM_R, 0.15]}
            >
              <boxGeometry args={[0.03, 0.06, 0.04]} />
              <primitive object={makeSteel()} attach="material" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function FlywheelShape({
  highlight,
  onSelect,
}: {
  highlight: boolean;
  onSelect: (id: string) => void;
}) {
  const mat = highlight ? makeHighlight() : makeCastIron();
  const spokeMat = makeBluedSteel();
  const brass = makePolishedBrass();

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("flywheel");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh castShadow receiveShadow>
        <torusGeometry args={[RIM_R, 0.07, 12, 48]} />
        <primitive object={mat} attach="material" />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={`spoke-${i}`} rotation={[0, 0, a]}>
            <mesh position={[(RIM_R - 0.1) / 2, 0, 0]} castShadow>
              <boxGeometry args={[RIM_R - 0.1, 0.08, 0.06]} />
              <primitive object={spokeMat} attach="material" />
            </mesh>
          </group>
        );
      })}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.025, 8, 16]} />
        <primitive object={brass} attach="material" />
      </mesh>
    </group>
  );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOttoStore } from "./useOttoStore";
import { advanceOttoClock } from "./ottoClock";

import { Block } from "./parts/Block";
import { Piston } from "./parts/Piston";
import { Conrod } from "./parts/Conrod";
import { Crankshaft } from "./parts/Crankshaft";
import { Flywheel } from "./parts/Flywheel";
import { Valves } from "./parts/Valves";
import { SparkPlug } from "./parts/SparkPlug";

export function OttoEngineModel({
  isSimMaster = true,
}: {
  isSimMaster?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Read state
  const explodedAmount = useOttoStore((s) => s.explodedAmount);
  const highlightPart = useOttoStore((s) => s.highlightPart);
  const tick = useOttoStore((s) => s.tick);

  useFrame((state, delta) => {
    // 1. Update the clock if we are the master
    if (isSimMaster) {
      // Advance zustand store logic
      tick(delta);
      // Advance kinematics clock
      const rpm = useOttoStore.getState().actualRpm;
      advanceOttoClock(rpm, delta);
    }

    // 2. Add subtle vibration based on rpm
    if (groupRef.current) {
      const rpm = useOttoStore.getState().actualRpm;
      if (rpm > 10) {
        // High frequency vibration
        const intensity = (rpm / 800) * 0.005;
        const time = state.clock.elapsedTime * rpm * 0.1;
        groupRef.current.position.set(
          Math.sin(time * 1.3) * intensity,
          Math.cos(time * 1.7) * intensity,
          Math.sin(time * 2.1) * intensity
        );
      } else {
        groupRef.current.position.set(0, 0, 0);
      }
    }
  });

  const getProps = (id: string) => {
    const isHighlight = highlightPart === id;
    const isDimmed = highlightPart !== null && highlightPart !== id;
    return {
      highlight: isHighlight,
      dimmed: isDimmed,
      explodeOffset: explodedAmount,
    };
  };

  return (
    <group ref={groupRef}>
      <Block {...getProps("block")} />
      <Piston {...getProps("piston")} />
      <Conrod {...getProps("conrod")} />
      <Crankshaft {...getProps("crankshaft")} />
      <Flywheel {...getProps("flywheel")} />
      <Valves {...getProps("intake-valve")} type="intake" />
      <Valves {...getProps("exhaust-valve")} type="exhaust" />
      <SparkPlug {...getProps("spark-plug")} />
    </group>
  );
}

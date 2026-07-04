"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Block } from "./parts/Block";
import { Pistons } from "./parts/Pistons";
import { Crankshaft } from "./parts/Crankshaft";
import { ConnectingRods } from "./parts/ConnectingRods";
import { CylinderHead } from "./parts/CylinderHead";
import { Valvetrain } from "./parts/Valvetrain";
import { Camshaft } from "./parts/Camshaft";
import { TimingBelt } from "./parts/TimingBelt";
import { SparkPlugs } from "./parts/SparkPlugs";
import { IntakeManifold } from "./parts/IntakeManifold";
import { ExhaustManifold } from "./parts/ExhaustManifold";
import { Flywheel } from "./parts/Flywheel";
import { OilPan } from "./parts/OilPan";
import { PartLabels } from "./parts/PartLabels";
import { useEngineStore } from "./useEngineStore";
import { advanceIceClock, engineClock } from "./engineClock";

const EXPLODE_VECTORS: Record<string, [number, number, number]> = {
  block: [0, 0, 0],
  pistons: [0, 0.8, 0],
  crankshaft: [0, 0, 1.5],
  conrods: [0.8, 0.6, 0.6],
  head: [0, 1.5, 0],
  valvetrain: [0.5, 0.8, -0.8],
  camshaft: [0.4, 0.6, 1.8],
  "timing-belt": [-0.6, 0.6, 1.5],
  "spark-plugs": [0, 1.2, -0.6],
  "intake-manifold": [-1.5, 0.4, 0],
  "exhaust-manifold": [1.5, 0.4, 0],
  flywheel: [2.0, 0, 0.8],
  "oil-pan": [0, -0.6, 0],
};

function ExplodeGroup({
  id,
  children,
}: {
  id: keyof typeof EXPLODE_VECTORS;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  const target = EXPLODE_VECTORS[id];
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const amt = useEngineStore.getState().explodedAmount;
    g.position.x += (target[0] * amt - g.position.x) * 0.12;
    g.position.y += (target[1] * amt - g.position.y) * 0.12;
    g.position.z += (target[2] * amt - g.position.z) * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

export function EngineModel() {
  const crossSection = useEngineStore((s) => s.crossSection);
  const showFuelSpray = useEngineStore((s) => s.showFuelSpray);
  const showSpark = useEngineStore((s) => s.showSpark);
  const showLabels = useEngineStore((s) => s.showLabels);
  const highlightPart = useEngineStore((s) => s.highlightPart);
  const selectedPart = useEngineStore((s) => s.selectedPart);
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const store = useEngineStore.getState();
    store.tick(dt);
    const post = useEngineStore.getState();
    engineClock.throttle = post.throttle;
    engineClock.load = post.load;
    advanceIceClock(post.actualRpm, dt);
  });

  const isHi = (id: string) => highlightPart === id || selectedPart === id;

  return (
    <group>
      <ExplodeGroup id="block">
        <Block
          crossSection={crossSection}
          highlight={isHi("block")}
          onSelect={setSelectedPart}
        />
      </ExplodeGroup>

      <ExplodeGroup id="pistons">
        <Pistons highlight={isHi("pistons")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="crankshaft">
        <Crankshaft highlight={isHi("crankshaft")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="conrods">
        <ConnectingRods highlight={isHi("conrods")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="head">
        <CylinderHead
          crossSection={crossSection}
          highlight={isHi("head")}
          onSelect={setSelectedPart}
        />
      </ExplodeGroup>

      <ExplodeGroup id="valvetrain">
        <Valvetrain highlight={isHi("valvetrain")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="camshaft">
        <Camshaft highlight={isHi("camshaft")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="timing-belt">
        <TimingBelt highlight={isHi("timing-belt")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="spark-plugs">
        <SparkPlugs
          showSpark={showSpark}
          highlight={isHi("spark-plugs")}
          onSelect={setSelectedPart}
        />
      </ExplodeGroup>

      <ExplodeGroup id="intake-manifold">
        <IntakeManifold highlight={isHi("intake-manifold")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="exhaust-manifold">
        <ExhaustManifold highlight={isHi("exhaust-manifold")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="flywheel">
        <Flywheel highlight={isHi("flywheel")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <ExplodeGroup id="oil-pan">
        <OilPan highlight={isHi("oil-pan")} onSelect={setSelectedPart} />
      </ExplodeGroup>

      <PartLabels mode={showLabels} />
    </group>
  );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Frame } from "./parts/Frame";
import { Boiler, SteamPipe } from "./parts/Boiler";
import {
  CylinderAssembly,
  ExhaustPipe,
} from "./parts/CylinderAssembly";
import { Beam } from "./parts/Beam";
import { FlywheelAssembly } from "./parts/Flywheel";
import { ConnectingRod } from "./parts/ConnectingRod";
import { Condenser, Governor, GovernorBelt } from "./parts/Condenser";
import { SteamParticles, EmberSparks } from "./parts/SteamParticles";
import { PartLabels } from "./parts/PartLabels";
import { useEngineStore } from "./useEngineStore";
import { advanceClock, engineClock } from "./engineClock";

/** Exploded-view offsets (in scene units) applied per major assembly when
 *  explodedAmount = 1. Direction is away from the engine's centre of mass. */
const EXPLODE_VECTORS: Record<string, [number, number, number]> = {
  boiler: [-2.6, 0.6, 0],
  "steam-pipe": [-1.0, 1.4, 0.4],
  cylinder: [0, 1.8, 0],
  beam: [0, 2.2, 0],
  conrod: [1.6, 1.0, 0.8],
  flywheel: [3.0, 0, 0.6],
  condenser: [-0.2, -1.6, 0.6],
  governor: [1.2, 1.6, 1.6],
};

/** Wraps children in a group whose position lerps toward its explode offset. */
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

/** The complete Watt beam engine assembly. Owns the single simulation
 *  useFrame that advances both the store (HUD stats) and the engineClock
 *  (per-frame 3D transforms). All sub-parts self-animate from engineClock. */
export function EngineModel() {
  // Reactive visual settings only — these rarely change, so re-renders are cheap.
  const crossSection = useEngineStore((s) => s.crossSection);
  const showSteam = useEngineStore((s) => s.showSteam);
  const showFire = useEngineStore((s) => s.showFire);
  const showLabels = useEngineStore((s) => s.showLabels);
  const highlightPart = useEngineStore((s) => s.highlightPart);
  const selectedPart = useEngineStore((s) => s.selectedPart);
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);

  // Throttle HUD-facing store writes (pistonPos/valveOpen) to ~12fps to avoid
  // flooding React with 60fps state updates for the gauges.
  const hudAccum = useRef(0);
  const metricsAccum = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const store = useEngineStore.getState();
    store.tick(dt);
    // Read post-tick state and advance the kinematics clock.
    const post = useEngineStore.getState();
    // Sync inputs into engineClock so the thermodynamic model sees them.
    engineClock.steamPressure = post.steamPressure;
    engineClock.throttle = post.throttle;
    engineClock.load = post.load;
    advanceClock(post.actualRpm, dt);

    // Throttle HUD-facing store writes to ~12fps.
    hudAccum.current += dt;
    if (hudAccum.current > 0.08) {
      hudAccum.current = 0;
      // Estimate work per revolution from the current cycle area proxy:
      // mean high-pressure × stroke. Scaled to arbitrary "J/rev" units.
      const sp = post.steamPressure;
      const th = post.throttle;
      const workPerRev = sp * th * 1000 * (1 - post.load * 0.3);
      useEngineStore.setState({
        pistonPos: engineClock.pistonPos,
        valveOpen: engineClock.valveOpen,
        cyclePhase: engineClock.cyclePhase,
        cylinderPressure: engineClock.cylinderPressure,
        cylinderVolume: engineClock.cylinderVolume,
        workPerRev,
      });
    }

    // Sample metrics history every ~0.5s (keep last ~60s = 120 samples)
    metricsAccum.current += dt;
    if (metricsAccum.current > 0.5) {
      metricsAccum.current = 0;
      const st = useEngineStore.getState();
      const sample = {
        t: st.elapsed,
        rpm: st.actualRpm,
        power: st.powerOutput,
        pressure: st.steamPressure,
        throttle: st.throttle,
      };
      const next = [...st.metrics, sample];
      if (next.length > 120) next.shift();
      useEngineStore.setState({ metrics: next });
    }
  });

  const isHi = (id: string) => highlightPart === id || selectedPart === id;

  return (
    <group>
      <Frame />
      <ExplodeGroup id="boiler">
        <Boiler fireOn={showFire} />
      </ExplodeGroup>
      <ExplodeGroup id="steam-pipe">
        <SteamPipe />
      </ExplodeGroup>
      <ExhaustPipe />
      <ExplodeGroup id="cylinder">
        <CylinderAssembly
          crossSection={crossSection}
          highlight={isHi("cylinder")}
          onSelect={setSelectedPart}
        />
      </ExplodeGroup>
      <ExplodeGroup id="beam">
        <Beam highlight={isHi("beam")} onSelect={setSelectedPart} />
      </ExplodeGroup>
      <ExplodeGroup id="conrod">
        <ConnectingRod highlight={isHi("conrod")} onSelect={setSelectedPart} />
      </ExplodeGroup>
      <ExplodeGroup id="flywheel">
        <FlywheelAssembly highlight={isHi("flywheel")} onSelect={setSelectedPart} />
      </ExplodeGroup>
      <ExplodeGroup id="condenser">
        <Condenser highlight={isHi("condenser")} />
      </ExplodeGroup>
      <ExplodeGroup id="governor">
        <Governor />
      </ExplodeGroup>
      <GovernorBelt />

      {/* Steam effects */}
      {showSteam && (
        <>
          {/* Dense smokestack smoke from the chimney — dark grey, billowing */}
          <SteamParticles
            origin={[-5.6, 3.5, -0.6]}
            count={40}
            upward={1.1}
            spread={0.4}
            intensity={Math.max(0.4, useEngineStore.getState().steamPressure)}
            color="#9a948e"
          />
          {/* Lighter steam plume higher up */}
          <SteamParticles
            origin={[-5.6, 4.5, -0.6]}
            count={20}
            upward={0.7}
            spread={0.6}
            intensity={Math.max(0.3, useEngineStore.getState().steamPressure * 0.7)}
            color="#c4c0ba"
          />
          {/* Exhaust puff near the condenser */}
          <SteamParticles
            origin={[-3.1, 0.15, 0]}
            count={14}
            upward={0.5}
            spread={0.25}
            intensity={0.7}
            color="#d8d8d8"
          />
          {/* Puff from the steam chest (valve leak character) */}
          <SteamParticles
            origin={[-2.4, 2.7, 0.95]}
            count={8}
            upward={0.4}
            spread={0.18}
            intensity={0.4}
          />
        </>
      )}

      {/* Fire embers */}
      {showFire && <EmberSparks origin={[-5.6, 1.1, 0.6]} count={12} />}

      {/* Floating labels */}
      <PartLabels mode={showLabels} />
    </group>
  );
}

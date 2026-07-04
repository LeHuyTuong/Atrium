import { ENGINE_GEOMETRY, computeEngineState, strokePhase } from "@/lib/kinematics";

/** Module-level singleton holding the live per-frame engine state.
 *  Written once per frame by <EngineModel/>'s useFrame; read by any 3D
 *  sub-component's own useFrame without triggering React re-renders. */
export const engineClock: {
  theta: number; // flywheel angle (rad)
  alpha: number; // beam angle (rad)
  pistonY: number; // piston centre Y
  valveOpen: number; // 0..1 slide valve opening
  pistonPos: number; // -1..1 normalised piston position
  rpm: number; // current rpm
  prevAlpha: number;
  prevPistonY: number;
  cyclePhase: number; // 0..1 position in the thermodynamic cycle
  cylinderPressure: number; // 0..1 normalized pressure inside cylinder
  cylinderVolume: number; // 0..1 normalized volume (1 = BDC max, 0 = TDC min)
  load: number;
  steamPressure: number;
  throttle: number;
} = {
  theta: 0,
  alpha: 0,
  pistonY: 1.6,
  valveOpen: 0,
  pistonPos: 0,
  rpm: 0,
  prevAlpha: 0,
  prevPistonY: 1.6,
  cyclePhase: 0,
  cylinderPressure: 0,
  cylinderVolume: 0.5,
  load: 0.3,
  steamPressure: 0.7,
  throttle: 0.8,
};

/** Advance the clock by dt given a target rpm. Returns the freshly computed
 *  engine state so the caller can also drive refs. */
export function advanceClock(rpm: number, dt: number) {
  const omega = (rpm / 60) * Math.PI * 2;
  engineClock.theta += omega * dt;
  const st = computeEngineState(
    ENGINE_GEOMETRY,
    engineClock.theta,
    engineClock.prevAlpha,
    engineClock.prevPistonY,
    dt,
  );
  engineClock.alpha = st.alpha;
  engineClock.pistonY = st.pistonY;
  engineClock.prevAlpha = st.alpha;
  engineClock.prevPistonY = st.pistonY;
  engineClock.rpm = rpm;

  const ph = strokePhase(st.theta);
  engineClock.cyclePhase = ph;

  // Valve opens on the intake half of the stroke (phase 0..0.5 → open)
  engineClock.valveOpen = ph < 0.5 ? Math.sin(ph * Math.PI * 2) * 0.5 + 0.5 : 0;

  // Normalised piston position: +1 at TDC (highest), -1 at BDC (lowest)
  const geo = ENGINE_GEOMETRY;
  const midY = geo.fulcrum[1] - geo.halfLen * 0 - geo.pistonRodLength;
  const amp = geo.crankRadius;
  engineClock.pistonPos = (st.pistonY - midY) / amp;

  // ---- Thermodynamic state for the P-V diagram ----
  // Volume: 0 at TDC (piston highest, pos=+1), 1 at BDC (piston lowest, pos=-1)
  engineClock.cylinderVolume = (1 - engineClock.pistonPos) / 2;

  // Pressure model (simplified Watt cycle):
  //  - Intake stroke (phase 0..0.5, piston descending): steam admitted at
  //    boiler pressure → high pressure, ~constant during admission then
  //    expansion drops it.
  //  - Exhaust stroke (phase 0.5..1, piston ascending): steam exhausted to
  //    condenser → near-vacuum (low pressure), ~constant.
  const sp = engineClock.steamPressure;
  const th = engineClock.throttle;
  let p: number;
  if (ph < 0.5) {
    // Power stroke: admission (first ~20%) then expansion (rest)
    if (ph < 0.1) {
      p = sp * th * (0.85 + 0.15 * (ph / 0.1)); // ramp up admission
    } else {
      // Polytropic expansion P ∝ 1/V^n
      const v = Math.max(0.05, engineClock.cylinderVolume);
      p = sp * th * 0.95 * Math.pow(0.1 / v, 0.6);
      p = Math.max(0.05, Math.min(1, p));
    }
  } else {
    // Exhaust stroke: low pressure (condenser vacuum)
    p = 0.04 + 0.03 * (1 - th); // near-zero, slight rise if throttle closed
  }
  engineClock.cylinderPressure = p;

  return st;
}

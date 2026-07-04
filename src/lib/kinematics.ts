/**
 * Watt Beam Engine — kinematics solver.
 *
 * Layout (top view is the X-Y plane, Z is depth):
 *
 *   Fulcrum F = (fx, fy)            — centre of the rocking beam
 *   Beam half-length = halfLen      — distance fulcrum → each beam end
 *   Flywheel centre W = (wx, wy)    — crankshaft axis
 *   Crank radius = crankR           — crank pin orbit radius
 *   Connecting rod length = rodLen  — beam right end ↔ crank pin
 *
 * The flywheel rotates at a steady angular velocity ω (θ = ω·t) maintained by
 * the flywheel's momentum. Given θ we solve for the beam angle α such that the
 * rigid connecting rod constraint is satisfied:
 *
 *   | B_right(α) − CrankPin(θ) | = rodLen
 *
 * where
 *   B_right(α) = (fx + halfLen·cos α, fy + halfLen·sin α)
 *   CrankPin(θ) = (wx + crankR·cos θ, wy + crankR·sin θ)
 *
 * Newton's method, seeded from the previous frame's α, converges in 3–4 iters.
 *
 * The piston hangs from the LEFT beam end by a short chain/link (historically
 * accurate for atmospheric & early Watt beam engines). The piston rod is
 * constrained to vertical motion at x = cylX, so:
 *
 *   pistonTopY = Ly(α) = fy − halfLen·sin α
 */

export interface EngineGeometry {
  fulcrum: [number, number]; // (fx, fy)
  halfLen: number; // beam half-length
  flywheelCenter: [number, number]; // (wx, wy)
  crankRadius: number; // crank pin orbit radius
  rodLength: number; // connecting rod length
  cylinderX: number; // piston rod x position
  pistonRodLength: number; // piston rod top → piston centre
}

/** Canonical geometry used across the app (in 3D scene units ≈ metres). */
export const ENGINE_GEOMETRY: EngineGeometry = {
  fulcrum: [0, 4.2],
  halfLen: 2.4,
  flywheelCenter: [4.6, 2.1],
  crankRadius: 0.72,
  rodLength: 3.45,
  cylinderX: -2.4,
  pistonRodLength: 2.6,
};

export interface EngineState {
  /** Flywheel angle θ (radians, increasing over time). */
  theta: number;
  /** Beam angle α (radians, solved from θ). */
  alpha: number;
  /** Beam left end position (piston rod top). */
  leftEnd: [number, number];
  /** Beam right end position (connecting rod top). */
  rightEnd: [number, number];
  /** Crank pin position (connecting rod bottom). */
  crankPin: [number, number];
  /** Piston centre Y (top of piston inside cylinder). */
  pistonY: number;
  /** Piston vertical velocity (units/sec), positive = upward. */
  pistonVel: number;
}

/**
 * Solve beam angle α for a given flywheel angle θ.
 * `prevAlpha` seeds Newton's method for continuity (picks the right branch).
 */
export function solveBeamAngle(
  geo: EngineGeometry,
  theta: number,
  prevAlpha: number,
): number {
  const { fulcrum, halfLen, flywheelCenter, crankRadius, rodLength } = geo;
  const [fx, fy] = fulcrum;
  const [wx, wy] = flywheelCenter;
  const cx = wx + crankRadius * Math.cos(theta);
  const cy = wy + crankRadius * Math.sin(theta);
  const L2 = rodLength * rodLength;

  let alpha = prevAlpha;
  for (let i = 0; i < 6; i++) {
    const bx = fx + halfLen * Math.cos(alpha);
    const by = fy + halfLen * Math.sin(alpha);
    const dx = bx - cx;
    const dy = by - cy;
    const g = dx * dx + dy * dy - L2;
    // g'(α) = 2·dx·(−halfLen·sin α) + 2·dy·(halfLen·cos α)
    const gp =
      2 * dx * (-halfLen * Math.sin(alpha)) +
      2 * dy * (halfLen * Math.cos(alpha));
    if (Math.abs(gp) < 1e-6) break;
    const step = g / gp;
    alpha -= step;
    if (Math.abs(step) < 1e-7) break;
  }
  return alpha;
}

/** Compute the full engine state from θ and a previous α. */
export function computeEngineState(
  geo: EngineGeometry,
  theta: number,
  prevAlpha: number,
  prevPistonY: number,
  dt: number,
): EngineState {
  const alpha = solveBeamAngle(geo, theta, prevAlpha);
  const { fulcrum, halfLen, flywheelCenter, crankRadius, cylinderX, pistonRodLength } = geo;
  const [fx, fy] = fulcrum;
  const [wx, wy] = flywheelCenter;

  const leftEnd: [number, number] = [
    fx - halfLen * Math.cos(alpha),
    fy - halfLen * Math.sin(alpha),
  ];
  const rightEnd: [number, number] = [
    fx + halfLen * Math.cos(alpha),
    fy + halfLen * Math.sin(alpha),
  ];
  const crankPin: [number, number] = [
    wx + crankRadius * Math.cos(theta),
    wy + crankRadius * Math.sin(theta),
  ];

  // Piston hangs vertically below the beam left end (chain link).
  const pistonY = leftEnd[1] - pistonRodLength;
  const pistonVel = dt > 0 ? (pistonY - prevPistonY) / dt : 0;

  return { theta, alpha, leftEnd, rightEnd, crankPin, pistonY, pistonVel };
}

/** Crank angle → which stroke phase (0..1) the piston is in. */
export function strokePhase(theta: number): number {
  // θ=0 → crank pin rightmost → beam right end pulled right & down → piston up
  // Map so phase 0 = top dead centre (piston highest), 0.5 = bottom dead centre.
  return ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2);
}

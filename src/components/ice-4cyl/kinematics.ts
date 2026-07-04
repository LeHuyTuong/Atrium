export interface IceGeometry {
  crankRadius: number;
  rodLength: number;
  bore: number;
  cylinderSpacing: number;
  deckHeight: number;
  numCylinders: number;
  firingOrder: number[];
}

export const ENGINE_GEOMETRY: IceGeometry = {
  crankRadius: 0.36,
  rodLength: 1.2,
  bore: 0.6,
  cylinderSpacing: 0.7,
  deckHeight: 2.8,
  numCylinders: 4,
  firingOrder: [0, 2, 3, 1],
};

export interface PistonState {
  pos: number;
  vel: number;
  accel: number;
}

export interface EngineState {
  theta: number;
  rpm: number;
  pistons: PistonState[];
  crankPins: [number, number, number][];
  intakeValveLift: number[];
  exhaustValveLift: number[];
  cyclePhase: number[];
  cylinderPressure: number[];
  sparkFiring: boolean[];
}

const CRANK_PHASES = [0, Math.PI, Math.PI, 0];

export function solvePiston(
  theta: number,
  r: number,
  l: number,
  omega: number,
): PistonState {
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  const sinT2 = sinT * sinT;
  const l2 = l * l;
  const r2 = r * r;
  const sqrtTerm = Math.sqrt(l2 - r2 * sinT2);
  const pos = r * cosT + sqrtTerm;
  const vel = -r * omega * sinT - (r2 * omega * sinT * cosT) / sqrtTerm;
  const accel =
    -r * omega * omega * cosT -
    (r2 * omega * omega * (cosT * cosT - sinT * sinT)) / sqrtTerm -
    (r2 * r2 * omega * omega * sinT2 * cosT * cosT) / (sqrtTerm * sqrtTerm * sqrtTerm);
  return { pos, vel, accel };
}

export function cylinderPhase(theta: number): number {
  return ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2);
}

export function computeEngineState(
  theta: number,
  rpm: number,
  prevState?: EngineState,
): EngineState {
  const { crankRadius: r, rodLength: l, numCylinders: n, firingOrder } = ENGINE_GEOMETRY;
  const omega = (rpm / 60) * Math.PI * 2;

  const pistons: PistonState[] = [];
  const crankPins: [number, number, number][] = [];
  const intakeValveLift: number[] = [];
  const exhaustValveLift: number[] = [];
  const cyclePhase: number[] = [];
  const cylinderPressure: number[] = [];
  const sparkFiring: boolean[] = [];

  for (let i = 0; i < n; i++) {
    const cylOffset = CRANK_PHASES[i];
    const cylTheta = theta + cylOffset;
    const p = solvePiston(cylTheta, r, l, omega);
    pistons.push(p);

    const cx = r * Math.cos(cylTheta);
    const cy = r * Math.sin(cylTheta);
    const cz = (i - (n - 1) / 2) * ENGINE_GEOMETRY.cylinderSpacing;
    crankPins.push([cx, cy, cz]);

    const ph = cylinderPhase(cylTheta);
    cyclePhase.push(ph);

    if (ph < 0.25) {
      intakeValveLift.push(Math.sin(ph * Math.PI * 4) * 0.5 + 0.5);
      exhaustValveLift.push(0);
    } else if (ph < 0.5) {
      intakeValveLift.push(0);
      exhaustValveLift.push(0);
    } else if (ph < 0.75) {
      intakeValveLift.push(0);
      exhaustValveLift.push(0);
    } else {
      intakeValveLift.push(0);
      exhaustValveLift.push(Math.sin((ph - 0.75) * Math.PI * 4) * 0.5 + 0.5);
    }

    if (ph >= 0.48 && ph <= 0.52) {
      sparkFiring.push(true);
    } else {
      sparkFiring.push(false);
    }

    if (ph < 0.25) {
      cylinderPressure.push(0.15 + 0.1 * (ph / 0.25));
    } else if (ph < 0.5) {
      const t = (ph - 0.25) / 0.25;
      cylinderPressure.push(0.25 + 0.75 * (1 - t));
    } else if (ph < 0.75) {
      const t = (ph - 0.5) / 0.25;
      cylinderPressure.push(Math.max(0.08, 0.85 * Math.pow(1 - t, 1.3)));
    } else {
      cylinderPressure.push(0.08 * (1 - (ph - 0.75) / 0.25));
    }
  }

  return {
    theta,
    rpm,
    pistons,
    crankPins,
    intakeValveLift,
    exhaustValveLift,
    cyclePhase,
    cylinderPressure,
    sparkFiring,
  };
}

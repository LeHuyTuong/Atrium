/**
 * ottoClock.ts — Kinematics clock for the 4-stroke Otto engine.
 */

export interface OttoClock {
  crankAngle: number;
  cycleAngle: number;
  strokeIndex: number;
  pistonPos: number; // -1 to 1
  conrodAngle: number;
  crankY: number;
  crankZ: number;
  intakeOpen: number;
  exhaustOpen: number;
  combustionFlash: number;
  exhaustParticleIntensity: number;
  rpm: number;
  throttle: number;
  load: number;
}

export const ottoClock: OttoClock = {
  crankAngle: 0,
  cycleAngle: 0,
  strokeIndex: 0,
  pistonPos: 1,
  conrodAngle: 0,
  crankY: 0.5,
  crankZ: 0,
  intakeOpen: 0,
  exhaustOpen: 0,
  combustionFlash: 0,
  exhaustParticleIntensity: 0,
  rpm: 200,
  throttle: 0.8,
  load: 0.3,
};

const STROKE_END = [Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI];

export function advanceOttoClock(rpm: number, dt: number): void {
  const angularVelocity = (rpm / 60) * Math.PI * 2;
  ottoClock.crankAngle += angularVelocity * dt;
  ottoClock.rpm = rpm;

  ottoClock.cycleAngle = ottoClock.crankAngle % (4 * Math.PI);
  if (ottoClock.cycleAngle < 0) ottoClock.cycleAngle += 4 * Math.PI;
  const ca = ottoClock.cycleAngle;

  const CRANK_RADIUS = 0.6;
  const CON_ROD_LENGTH = 2.0;

  // Horizontal engine along Z axis
  // Crank rotates around X axis.
  // Crank pin coordinates in Y-Z plane:
  const crankY = CRANK_RADIUS * Math.sin(ca); // vertical deviation
  const crankZ = CRANK_RADIUS * Math.cos(ca); // horizontal deviation
  
  ottoClock.crankY = crankY;
  ottoClock.crankZ = crankZ;

  // Piston pin is constrained to Y = 0 (relative to crank center).
  // Distance from crank center to piston pin along Z axis:
  // (pistonZ - crankZ)^2 + (0 - crankY)^2 = l^2
  // pistonZ = crankZ + sqrt(l^2 - crankY^2)
  const pistonDistZ = crankZ + Math.sqrt(CON_ROD_LENGTH * CON_ROD_LENGTH - crankY * crankY);
  
  // Normalize pistonPos for UI/explosion offsets
  // TDC = r + l = 0.6 + 2.0 = 2.6
  // BDC = -r + l = -0.6 + 2.0 = 1.4
  // Center = 2.0, amplitude = 0.6
  ottoClock.pistonPos = (pistonDistZ - CON_ROD_LENGTH) / CRANK_RADIUS;

  // Conrod angle: the angle the rod makes with the Z axis in the Y-Z plane
  // sin(theta) = -crankY / l
  ottoClock.conrodAngle = Math.asin(-crankY / CON_ROD_LENGTH);

  // Strokes
  if (ca < STROKE_END[0]) ottoClock.strokeIndex = 0;
  else if (ca < STROKE_END[1]) ottoClock.strokeIndex = 1;
  else if (ca < STROKE_END[2]) ottoClock.strokeIndex = 2;
  else ottoClock.strokeIndex = 3;

  // Valve timing
  const inAngle = ca;
  if (inAngle < Math.PI) {
    ottoClock.intakeOpen = Math.sin((inAngle / Math.PI) * Math.PI);
  } else {
    ottoClock.intakeOpen = Math.max(0, ottoClock.intakeOpen - dt * 8);
  }

  const exAngle = ca - 3 * Math.PI;
  if (exAngle >= 0 && exAngle < Math.PI) {
    ottoClock.exhaustOpen = Math.sin((exAngle / Math.PI) * Math.PI);
  } else {
    ottoClock.exhaustOpen = Math.max(0, ottoClock.exhaustOpen - dt * 8);
  }

  // Flash
  const distFromIgnition = Math.abs(ca - 2 * Math.PI);
  if (distFromIgnition < 0.25) {
    ottoClock.combustionFlash = 1 - distFromIgnition / 0.25;
  } else {
    ottoClock.combustionFlash = Math.max(0, ottoClock.combustionFlash - dt * 5);
  }

  // Exhaust
  if (ottoClock.strokeIndex === 3) {
    const t = (ca - 3 * Math.PI) / Math.PI;
    ottoClock.exhaustParticleIntensity = 0.3 + 0.7 * Math.sin(t * Math.PI);
  } else {
    ottoClock.exhaustParticleIntensity = Math.max(0, ottoClock.exhaustParticleIntensity - dt * 3);
  }
}

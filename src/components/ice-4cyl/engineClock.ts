import { ENGINE_GEOMETRY, computeEngineState, type EngineState } from "./kinematics";

export const engineClock: {
  theta: number;
  rpm: number;
  prevTheta: number;
  state: EngineState;
  throttle: number;
  load: number;
  sparkTiming: number;
} = {
  theta: 0,
  rpm: 0,
  prevTheta: 0,
  state: computeEngineState(0, 0),
  throttle: 0.7,
  load: 0.3,
  sparkTiming: 0,
};

export function advanceIceClock(rpm: number, dt: number) {
  if (dt <= 0) return;
  engineClock.prevTheta = engineClock.theta;
  const omega = (rpm / 60) * Math.PI * 2;
  engineClock.theta += omega * dt;
  engineClock.rpm = rpm;
  engineClock.state = computeEngineState(engineClock.theta, rpm, engineClock.state);
}

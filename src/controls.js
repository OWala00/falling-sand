import { advance, createClock, STEP_MS } from './clock.js';

export function createControls() {
  return { clock: createClock(STEP_MS), paused: false, stepRequested: false, speed: 1 };
}

export function togglePause(controls) {
  controls.paused = !controls.paused;
}

export function requestStep(controls) {
  controls.paused = true;
  controls.stepRequested = true;
}

export function stepsDue(controls, elapsedMs) {
  const stepRequested = controls.stepRequested;
  controls.stepRequested = false;
  if (!controls.paused) return advance(controls.clock, elapsedMs * controls.speed);
  return stepRequested ? 1 : 0;
}

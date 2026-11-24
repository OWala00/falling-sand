export const STEP_MS = 1000 / 60;

const MAX_ELAPSED_MS = 250;

export function createClock(stepMs) {
  return { stepMs, pending: 0 };
}

export function advance(clock, elapsedMs) {
  clock.pending += Math.min(elapsedMs, MAX_ELAPSED_MS);
  let steps = 0;
  while (clock.pending >= clock.stepMs) {
    clock.pending -= clock.stepMs;
    steps += 1;
  }
  return steps;
}

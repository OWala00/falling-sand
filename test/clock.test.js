import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createClock, advance, STEP_MS } from '../src/clock.js';

function stepsOverOneSecond(frameMs) {
  const clock = createClock(STEP_MS);
  let total = 0;
  for (let t = 0; t < 1000 - frameMs / 2; t += frameMs) total += advance(clock, frameMs);
  return total;
}

test('a 60 Hz display advances the simulation 60 steps per second', () => {
  assert.ok(Math.abs(stepsOverOneSecond(1000 / 60) - 60) <= 1);
});

test('a 144 Hz display advances the simulation the same 60 steps per second', () => {
  assert.ok(Math.abs(stepsOverOneSecond(1000 / 144) - 60) <= 1);
});

test('a 30 Hz display advances the simulation the same 60 steps per second', () => {
  assert.ok(Math.abs(stepsOverOneSecond(1000 / 30) - 60) <= 1);
});

test('a long pause advances at most fifteen steps so the sim does not race to catch up', () => {
  const clock = createClock(STEP_MS);
  assert.ok(advance(clock, 10000) <= 15);
});

test('time from short frames carries over until a full step has passed', () => {
  const clock = createClock(STEP_MS);
  assert.equal(advance(clock, 10), 0);
  assert.equal(advance(clock, 10), 1);
});

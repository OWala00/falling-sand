import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createControls, togglePause, requestStep, stepsDue } from '../src/controls.js';

function stepsOverOneSecond(controls) {
  const frameMs = 1000 / 60;
  let total = 0;
  for (let t = 0; t < 1000 - frameMs / 2; t += frameMs) total += stepsDue(controls, frameMs);
  return total;
}

test('a paused simulation takes no steps', () => {
  const controls = createControls();
  togglePause(controls);
  assert.equal(stepsOverOneSecond(controls), 0);
});

test('a step request pauses a running simulation and advances it exactly one step', () => {
  const controls = createControls();
  requestStep(controls);
  assert.equal(stepsDue(controls, 16), 1);
  assert.equal(stepsOverOneSecond(controls), 0);
});

test('time spent paused is not banked for later', () => {
  const controls = createControls();
  togglePause(controls);
  stepsOverOneSecond(controls);
  togglePause(controls);
  assert.ok(stepsDue(controls, 1000 / 60) <= 1);
});

test('speed scales how many steps a second produces', () => {
  const controls = createControls();
  controls.speed = 2;
  assert.ok(Math.abs(stepsOverOneSecond(controls) - 120) <= 1);
});

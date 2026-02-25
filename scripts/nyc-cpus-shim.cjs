'use strict';
/**
 * Ensures os.cpus().length is at least 1 so nyc (and p-limit) do not throw
 * "Expected concurrency to be a number from 1 and up, got 0" in environments
 * where os.cpus() returns [] (e.g. some CI/sandboxes).
 */
const os = require('os');
const originalCpus = os.cpus;
os.cpus = function cpusShim() {
  const c = originalCpus.call(os);
  if (c.length === 0) {
    return [{ model: 'Unknown', speed: 0, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } }];
  }
  return c;
};

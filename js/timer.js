export function createTimer() {
  let startTime = null;

  return {
    start() {
      startTime = performance.now();
      return startTime;
    },

    stop() {
      if (startTime === null) {
        return 0;
      }
      const elapsed = (performance.now() - startTime) / 1000;
      startTime = null;
      return elapsed;
    },

    getElapsed() {
      if (startTime === null) {
        return 0;
      }
      return (performance.now() - startTime) / 1000;
    },

    isRunning() {
      return startTime !== null;
    },

    reset() {
      startTime = null;
    },
  };
}

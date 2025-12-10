export const DEFAULT_CONFIG = {
  totalRounds: 5,
  minTargetTime: 2.0,
  maxTargetTime: 8.0,
  targetPrecision: 1,
  maxPointsPerRound: 1000,
  scoringExponent: 2,
};

export function validateConfig(config) {
  const errors = [];

  if (typeof config.totalRounds !== "number" || config.totalRounds < 1) {
    errors.push("totalRounds must be a positive number");
  }

  if (typeof config.minTargetTime !== "number" || config.minTargetTime <= 0) {
    errors.push("minTargetTime must be a positive number");
  }

  if (typeof config.maxTargetTime !== "number" || config.maxTargetTime <= 0) {
    errors.push("maxTargetTime must be a positive number");
  }

  if (config.minTargetTime >= config.maxTargetTime) {
    errors.push("minTargetTime must be less than maxTargetTime");
  }

  if (
    typeof config.targetPrecision !== "number" ||
    config.targetPrecision < 0
  ) {
    errors.push("targetPrecision must be a non-negative number");
  }

  if (
    typeof config.maxPointsPerRound !== "number" ||
    config.maxPointsPerRound <= 0
  ) {
    errors.push("maxPointsPerRound must be a positive number");
  }

  if (
    typeof config.scoringExponent !== "number" ||
    config.scoringExponent <= 0
  ) {
    errors.push("scoringExponent must be a positive number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createConfig(overrides = {}) {
  return { ...DEFAULT_CONFIG, ...overrides };
}

export function generateTargetTime(config) {
  const { minTargetTime, maxTargetTime, targetPrecision } = config;
  const range = maxTargetTime - minTargetTime;
  const raw = minTargetTime + Math.random() * range;
  const multiplier = 10 ** targetPrecision;
  return Math.round(raw * multiplier) / multiplier;
}

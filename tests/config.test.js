import assert from "node:assert";
import { describe, test } from "node:test";
import {
  createConfig,
  DEFAULT_CONFIG,
  generateTargetTime,
  validateConfig,
} from "../js/config.js";

describe("DEFAULT_CONFIG", () => {
  test("has expected default values", () => {
    assert.strictEqual(DEFAULT_CONFIG.totalRounds, 5);
    assert.strictEqual(DEFAULT_CONFIG.minTargetTime, 2.0);
    assert.strictEqual(DEFAULT_CONFIG.maxTargetTime, 8.0);
    assert.strictEqual(DEFAULT_CONFIG.targetPrecision, 1);
    assert.strictEqual(DEFAULT_CONFIG.maxPointsPerRound, 1000);
    assert.strictEqual(DEFAULT_CONFIG.scoringExponent, 2);
  });
});

describe("validateConfig", () => {
  test("validates default config as valid", () => {
    const result = validateConfig(DEFAULT_CONFIG);
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, []);
  });

  test("rejects invalid totalRounds", () => {
    const result = validateConfig({ ...DEFAULT_CONFIG, totalRounds: 0 });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("totalRounds")));
  });

  test("rejects negative minTargetTime", () => {
    const result = validateConfig({ ...DEFAULT_CONFIG, minTargetTime: -1 });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("minTargetTime")));
  });

  test("rejects minTargetTime >= maxTargetTime", () => {
    const result = validateConfig({
      ...DEFAULT_CONFIG,
      minTargetTime: 8.0,
      maxTargetTime: 8.0,
    });
    assert.strictEqual(result.valid, false);
    assert.ok(
      result.errors.some((e) => e.includes("minTargetTime must be less than")),
    );
  });

  test("rejects negative targetPrecision", () => {
    const result = validateConfig({ ...DEFAULT_CONFIG, targetPrecision: -1 });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("targetPrecision")));
  });

  test("rejects invalid maxPointsPerRound", () => {
    const result = validateConfig({ ...DEFAULT_CONFIG, maxPointsPerRound: 0 });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("maxPointsPerRound")));
  });

  test("rejects invalid scoringExponent", () => {
    const result = validateConfig({ ...DEFAULT_CONFIG, scoringExponent: 0 });
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("scoringExponent")));
  });
});

describe("createConfig", () => {
  test("returns default config when no overrides", () => {
    const config = createConfig();
    assert.deepStrictEqual(config, DEFAULT_CONFIG);
  });

  test("merges overrides with defaults", () => {
    const config = createConfig({ totalRounds: 10 });
    assert.strictEqual(config.totalRounds, 10);
    assert.strictEqual(config.minTargetTime, DEFAULT_CONFIG.minTargetTime);
  });

  test("allows multiple overrides", () => {
    const config = createConfig({ totalRounds: 3, maxTargetTime: 10.0 });
    assert.strictEqual(config.totalRounds, 3);
    assert.strictEqual(config.maxTargetTime, 10.0);
  });
});

describe("generateTargetTime", () => {
  test("generates value within range", () => {
    const config = createConfig();
    for (let i = 0; i < 100; i++) {
      const target = generateTargetTime(config);
      assert.ok(target >= config.minTargetTime);
      assert.ok(target <= config.maxTargetTime);
    }
  });

  test("respects targetPrecision of 1 decimal", () => {
    const config = createConfig({ targetPrecision: 1 });
    for (let i = 0; i < 100; i++) {
      const target = generateTargetTime(config);
      const decimals = (target.toString().split(".")[1] || "").length;
      assert.ok(decimals <= 1);
    }
  });

  test("respects targetPrecision of 2 decimals", () => {
    const config = createConfig({ targetPrecision: 2 });
    for (let i = 0; i < 100; i++) {
      const target = generateTargetTime(config);
      const decimals = (target.toString().split(".")[1] || "").length;
      assert.ok(decimals <= 2);
    }
  });

  test("respects targetPrecision of 0 decimals", () => {
    const config = createConfig({ targetPrecision: 0 });
    for (let i = 0; i < 100; i++) {
      const target = generateTargetTime(config);
      assert.strictEqual(target, Math.floor(target));
    }
  });
});

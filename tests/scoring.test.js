import assert from "node:assert";
import { describe, test } from "node:test";
import {
  calculateScore,
  calculateTotalScore,
  formatScore,
  formatTime,
  getRoundSummary,
} from "../js/scoring.js";

describe("calculateScore", () => {
  test("returns max points for exact match", () => {
    assert.strictEqual(calculateScore(5.0, 5.0, 1000), 1000);
  });

  test("returns 0 when elapsed exceeds target", () => {
    assert.strictEqual(calculateScore(5.0, 5.1, 1000), 0);
    assert.strictEqual(calculateScore(5.0, 6.0, 1000), 0);
    assert.strictEqual(calculateScore(5.0, 10.0, 1000), 0);
  });

  test("calculates score correctly for target 5.0s", () => {
    assert.strictEqual(calculateScore(5.0, 4.9, 1000), 960);
    assert.strictEqual(calculateScore(5.0, 4.5, 1000), 810);
    assert.strictEqual(calculateScore(5.0, 4.0, 1000), 640);
    assert.strictEqual(calculateScore(5.0, 3.0, 1000), 360);
  });

  test("uses default maxPoints of 1000", () => {
    assert.strictEqual(calculateScore(5.0, 5.0), 1000);
  });

  test("respects custom maxPoints", () => {
    assert.strictEqual(calculateScore(5.0, 5.0, 500), 500);
    assert.strictEqual(calculateScore(5.0, 4.0, 500), 320);
  });

  test("returns 0 for elapsed time of 0", () => {
    assert.strictEqual(calculateScore(5.0, 0, 1000), 0);
  });

  test("handles small differences near target", () => {
    const score = calculateScore(5.0, 4.99, 1000);
    assert.ok(score > 990);
    assert.ok(score < 1000);
  });
});

describe("calculateTotalScore", () => {
  test("sums all round scores", () => {
    assert.strictEqual(calculateTotalScore([100, 200, 300]), 600);
  });

  test("returns 0 for empty array", () => {
    assert.strictEqual(calculateTotalScore([]), 0);
  });

  test("handles single score", () => {
    assert.strictEqual(calculateTotalScore([500]), 500);
  });

  test("handles zeros in array", () => {
    assert.strictEqual(calculateTotalScore([100, 0, 200, 0]), 300);
  });
});

describe("formatTime", () => {
  test("formats to one decimal place", () => {
    assert.strictEqual(formatTime(5.0), "5.0");
    assert.strictEqual(formatTime(5.123), "5.1");
    assert.strictEqual(formatTime(5.156), "5.2");
  });

  test("handles whole numbers", () => {
    assert.strictEqual(formatTime(5), "5.0");
  });
});

describe("formatScore", () => {
  test("formats score with locale string", () => {
    const result = formatScore(1000);
    assert.ok(result.includes("1") && result.includes("000"));
  });

  test("handles zero", () => {
    assert.strictEqual(formatScore(0), "0");
  });
});

describe("getRoundSummary", () => {
  test("returns correct summary for under target", () => {
    const summary = getRoundSummary(5.0, 4.5, 810);

    assert.strictEqual(summary.targetTime, 5.0);
    assert.strictEqual(summary.elapsedTime, 4.5);
    assert.strictEqual(summary.score, 810);
    assert.strictEqual(summary.difference, 0.5);
    assert.strictEqual(summary.isOver, false);
    assert.strictEqual(summary.formattedTarget, "5.0");
    assert.strictEqual(summary.formattedElapsed, "4.5");
    assert.strictEqual(summary.formattedDifference, "0.5");
  });

  test("returns correct summary for over target", () => {
    const summary = getRoundSummary(5.0, 5.3, 0);

    assert.ok(Math.abs(summary.difference - 0.3) < 0.0001);
    assert.strictEqual(summary.isOver, true);
    assert.strictEqual(summary.score, 0);
  });

  test("returns correct summary for exact match", () => {
    const summary = getRoundSummary(5.0, 5.0, 1000);

    assert.strictEqual(summary.difference, 0);
    assert.strictEqual(summary.isOver, false);
    assert.strictEqual(summary.score, 1000);
  });
});

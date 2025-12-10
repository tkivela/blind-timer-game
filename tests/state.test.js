import assert from "node:assert";
import { describe, test } from "node:test";
import { DEFAULT_CONFIG } from "../js/config.js";
import {
  canTransition,
  createInitialState,
  GameState,
  nextRound,
  resetGame,
  startGame,
  startTimer,
  stopTimer,
} from "../js/state.js";

describe("GameState", () => {
  test("has all expected states", () => {
    assert.strictEqual(GameState.IDLE, "IDLE");
    assert.strictEqual(GameState.ROUND_READY, "ROUND_READY");
    assert.strictEqual(GameState.TIMER_RUNNING, "TIMER_RUNNING");
    assert.strictEqual(GameState.ROUND_RESULT, "ROUND_RESULT");
    assert.strictEqual(GameState.GAME_OVER, "GAME_OVER");
  });
});

describe("createInitialState", () => {
  test("creates state with IDLE status", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    assert.strictEqual(state.currentState, GameState.IDLE);
  });

  test("initializes with correct values", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    assert.strictEqual(state.currentRound, 0);
    assert.strictEqual(state.totalRounds, 5);
    assert.strictEqual(state.targetTime, null);
    assert.strictEqual(state.startTime, null);
    assert.strictEqual(state.elapsedTime, null);
    assert.deepStrictEqual(state.roundScores, []);
    assert.deepStrictEqual(state.roundResults, []);
  });

  test("uses totalRounds from config", () => {
    const state = createInitialState({ ...DEFAULT_CONFIG, totalRounds: 10 });
    assert.strictEqual(state.totalRounds, 10);
  });
});

describe("startGame", () => {
  test("transitions from IDLE to ROUND_READY", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    const newState = startGame(state, 5.0);

    assert.strictEqual(newState.currentState, GameState.ROUND_READY);
    assert.strictEqual(newState.currentRound, 1);
    assert.strictEqual(newState.targetTime, 5.0);
  });

  test("does not transition from non-IDLE state", () => {
    const state = {
      ...createInitialState(DEFAULT_CONFIG),
      currentState: GameState.TIMER_RUNNING,
    };
    const newState = startGame(state, 5.0);

    assert.strictEqual(newState.currentState, GameState.TIMER_RUNNING);
  });

  test("resets scores and results", () => {
    const state = {
      ...createInitialState(DEFAULT_CONFIG),
      roundScores: [100],
      roundResults: [{ round: 1 }],
    };
    const newState = startGame(state, 5.0);

    assert.deepStrictEqual(newState.roundScores, []);
    assert.deepStrictEqual(newState.roundResults, []);
  });
});

describe("startTimer", () => {
  test("transitions from ROUND_READY to TIMER_RUNNING", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    const newState = startTimer(state, 1000);

    assert.strictEqual(newState.currentState, GameState.TIMER_RUNNING);
    assert.strictEqual(newState.startTime, 1000);
  });

  test("does not transition from non-ROUND_READY state", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    const newState = startTimer(state, 1000);

    assert.strictEqual(newState.currentState, GameState.IDLE);
  });
});

describe("stopTimer", () => {
  test("transitions from TIMER_RUNNING to ROUND_RESULT", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    const newState = stopTimer(state, 4.8, 922);

    assert.strictEqual(newState.currentState, GameState.ROUND_RESULT);
    assert.strictEqual(newState.elapsedTime, 4.8);
  });

  test("adds score to roundScores", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    const newState = stopTimer(state, 4.8, 922);

    assert.deepStrictEqual(newState.roundScores, [922]);
  });

  test("adds result to roundResults", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    const newState = stopTimer(state, 4.8, 922);

    assert.strictEqual(newState.roundResults.length, 1);
    assert.deepStrictEqual(newState.roundResults[0], {
      round: 1,
      targetTime: 5.0,
      elapsedTime: 4.8,
      score: 922,
    });
  });

  test("does not transition from non-TIMER_RUNNING state", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    const newState = stopTimer(state, 4.8, 922);

    assert.strictEqual(newState.currentState, GameState.IDLE);
  });
});

describe("nextRound", () => {
  test("transitions to ROUND_READY for next round", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    const newState = nextRound(state, 6.0);

    assert.strictEqual(newState.currentState, GameState.ROUND_READY);
    assert.strictEqual(newState.currentRound, 2);
    assert.strictEqual(newState.targetTime, 6.0);
  });

  test("transitions to GAME_OVER after final round", () => {
    let state = createInitialState({ ...DEFAULT_CONFIG, totalRounds: 1 });
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    const newState = nextRound(state, 6.0);

    assert.strictEqual(newState.currentState, GameState.GAME_OVER);
  });

  test("clears timing state for next round", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    const newState = nextRound(state, 6.0);

    assert.strictEqual(newState.startTime, null);
    assert.strictEqual(newState.elapsedTime, null);
  });

  test("preserves scores across rounds", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    const newState = nextRound(state, 6.0);

    assert.deepStrictEqual(newState.roundScores, [922]);
  });

  test("does not transition from non-ROUND_RESULT state", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    const newState = nextRound(state, 6.0);

    assert.strictEqual(newState.currentState, GameState.IDLE);
  });
});

describe("resetGame", () => {
  test("returns to IDLE state", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    const newState = resetGame(state);

    assert.strictEqual(newState.currentState, GameState.IDLE);
  });

  test("clears all game data", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    const newState = resetGame(state);

    assert.strictEqual(newState.currentRound, 0);
    assert.strictEqual(newState.targetTime, null);
    assert.strictEqual(newState.startTime, null);
    assert.strictEqual(newState.elapsedTime, null);
    assert.deepStrictEqual(newState.roundScores, []);
    assert.deepStrictEqual(newState.roundResults, []);
  });

  test("preserves totalRounds setting", () => {
    let state = createInitialState({ ...DEFAULT_CONFIG, totalRounds: 10 });
    state = startGame(state, 5.0);
    const newState = resetGame(state);

    assert.strictEqual(newState.totalRounds, 10);
  });
});

describe("canTransition", () => {
  test("allows START_GAME from IDLE", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    assert.strictEqual(canTransition(state, "START_GAME"), true);
  });

  test("allows START_TIMER from ROUND_READY", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    assert.strictEqual(canTransition(state, "START_TIMER"), true);
  });

  test("allows STOP_TIMER from TIMER_RUNNING", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    assert.strictEqual(canTransition(state, "STOP_TIMER"), true);
  });

  test("allows NEXT_ROUND from ROUND_RESULT", () => {
    let state = createInitialState(DEFAULT_CONFIG);
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    assert.strictEqual(canTransition(state, "NEXT_ROUND"), true);
  });

  test("allows RESET_GAME from GAME_OVER", () => {
    let state = createInitialState({ ...DEFAULT_CONFIG, totalRounds: 1 });
    state = startGame(state, 5.0);
    state = startTimer(state, 1000);
    state = stopTimer(state, 4.8, 922);
    state = nextRound(state, 6.0);
    assert.strictEqual(canTransition(state, "RESET_GAME"), true);
  });

  test("disallows invalid transitions", () => {
    const state = createInitialState(DEFAULT_CONFIG);
    assert.strictEqual(canTransition(state, "STOP_TIMER"), false);
    assert.strictEqual(canTransition(state, "NEXT_ROUND"), false);
  });
});

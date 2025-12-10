export const GameState = {
  IDLE: "IDLE",
  ROUND_READY: "ROUND_READY",
  TIMER_RUNNING: "TIMER_RUNNING",
  ROUND_RESULT: "ROUND_RESULT",
  GAME_OVER: "GAME_OVER",
};

export function createInitialState(config) {
  return {
    currentState: GameState.IDLE,
    currentRound: 0,
    totalRounds: config.totalRounds,
    targetTime: null,
    startTime: null,
    elapsedTime: null,
    roundScores: [],
    roundResults: [],
  };
}

export function startGame(state, targetTime) {
  if (state.currentState !== GameState.IDLE) {
    return state;
  }

  return {
    ...state,
    currentState: GameState.ROUND_READY,
    currentRound: 1,
    targetTime,
    roundScores: [],
    roundResults: [],
  };
}

export function startTimer(state, startTime) {
  if (state.currentState !== GameState.ROUND_READY) {
    return state;
  }

  return {
    ...state,
    currentState: GameState.TIMER_RUNNING,
    startTime,
  };
}

export function stopTimer(state, elapsedTime, score) {
  if (state.currentState !== GameState.TIMER_RUNNING) {
    return state;
  }

  const roundResult = {
    round: state.currentRound,
    targetTime: state.targetTime,
    elapsedTime,
    score,
  };

  return {
    ...state,
    currentState: GameState.ROUND_RESULT,
    elapsedTime,
    roundScores: [...state.roundScores, score],
    roundResults: [...state.roundResults, roundResult],
  };
}

export function nextRound(state, targetTime) {
  if (state.currentState !== GameState.ROUND_RESULT) {
    return state;
  }

  if (state.currentRound >= state.totalRounds) {
    return {
      ...state,
      currentState: GameState.GAME_OVER,
      targetTime: null,
      startTime: null,
      elapsedTime: null,
    };
  }

  return {
    ...state,
    currentState: GameState.ROUND_READY,
    currentRound: state.currentRound + 1,
    targetTime,
    startTime: null,
    elapsedTime: null,
  };
}

export function resetGame(state) {
  return {
    ...state,
    currentState: GameState.IDLE,
    currentRound: 0,
    targetTime: null,
    startTime: null,
    elapsedTime: null,
    roundScores: [],
    roundResults: [],
  };
}

export function canTransition(state, action) {
  const validTransitions = {
    [GameState.IDLE]: ["START_GAME"],
    [GameState.ROUND_READY]: ["START_TIMER"],
    [GameState.TIMER_RUNNING]: ["STOP_TIMER"],
    [GameState.ROUND_RESULT]: ["NEXT_ROUND"],
    [GameState.GAME_OVER]: ["RESET_GAME"],
  };

  const allowed = validTransitions[state.currentState] || [];
  return allowed.includes(action);
}

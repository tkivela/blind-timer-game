import { DEFAULT_CONFIG, generateTargetTime } from "./config.js";
import {
  calculateScore,
  calculateTotalScore,
  getRoundSummary,
} from "./scoring.js";
import {
  createInitialState,
  GameState,
  nextRound,
  resetGame,
  startGame,
  startTimer,
  stopTimer,
} from "./state.js";
import { isHighScore, loadHiScores, saveHiScore } from "./storage.js";
import { createTimer } from "./timer.js";
import {
  getPlayerName,
  showGameState,
  showHiScoresScreen,
  updateGameOver,
  updateHiScores,
  updateRoundReady,
  updateRoundResult,
  updateTimerRunning,
} from "./ui.js";

const config = DEFAULT_CONFIG;
let gameState = createInitialState(config);
const timer = createTimer();

function render() {
  showGameState(gameState.currentState);

  switch (gameState.currentState) {
    case GameState.ROUND_READY:
      updateRoundReady(
        gameState.currentRound,
        gameState.totalRounds,
        gameState.targetTime,
      );
      break;

    case GameState.TIMER_RUNNING:
      updateTimerRunning(
        gameState.currentRound,
        gameState.totalRounds,
        gameState.targetTime,
      );
      break;

    case GameState.ROUND_RESULT: {
      const lastResult =
        gameState.roundResults[gameState.roundResults.length - 1];
      const summary = getRoundSummary(
        lastResult.targetTime,
        lastResult.elapsedTime,
        lastResult.score,
      );
      updateRoundResult(summary, gameState.currentRound);
      break;
    }

    case GameState.GAME_OVER: {
      const totalScore = calculateTotalScore(gameState.roundScores);
      updateGameOver(
        totalScore,
        gameState.roundResults,
        isHighScore(totalScore),
      );
      break;
    }
  }
}

function handleStartGame() {
  const targetTime = generateTargetTime(config);
  gameState = startGame(gameState, targetTime);
  render();
}

function handleStartTimer() {
  timer.start();
  gameState = startTimer(gameState, performance.now());
  render();
}

function handleStopTimer() {
  const elapsed = timer.stop();
  const score = calculateScore(
    gameState.targetTime,
    elapsed,
    config.maxPointsPerRound,
  );
  gameState = stopTimer(gameState, elapsed, score);
  render();
}

function handleContinue() {
  const targetTime = generateTargetTime(config);
  gameState = nextRound(gameState, targetTime);
  render();
}

function handlePlayAgain() {
  gameState = resetGame(gameState);
  handleStartGame();
}

function handleBackToMenu() {
  gameState = resetGame(gameState);
  render();
}

function handleShowHiScores() {
  updateHiScores(loadHiScores());
  showHiScoresScreen();
}

function handleBackFromHiScores() {
  render();
}

function handleSaveScore() {
  const name = getPlayerName() || "AAA";
  const totalScore = calculateTotalScore(gameState.roundScores);
  saveHiScore(name, totalScore, config.totalRounds);
  document.getElementById("hiscore-entry").classList.add("hidden");
}

function handleKeyDown(event) {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();

    switch (gameState.currentState) {
      case GameState.IDLE:
        handleStartGame();
        break;
      case GameState.ROUND_READY:
        handleStartTimer();
        break;
      case GameState.TIMER_RUNNING:
        handleStopTimer();
        break;
      case GameState.ROUND_RESULT:
        handleContinue();
        break;
    }
  }
}

function init() {
  document
    .getElementById("btn-start-game")
    .addEventListener("click", handleStartGame);
  document
    .getElementById("btn-show-hiscores")
    .addEventListener("click", handleShowHiScores);
  document
    .getElementById("btn-start-timer")
    .addEventListener("click", handleStartTimer);
  document
    .getElementById("btn-stop-timer")
    .addEventListener("click", handleStopTimer);
  document
    .getElementById("btn-continue")
    .addEventListener("click", handleContinue);
  document
    .getElementById("btn-play-again")
    .addEventListener("click", handlePlayAgain);
  document
    .getElementById("btn-back-menu")
    .addEventListener("click", handleBackToMenu);
  document
    .getElementById("btn-back-from-hiscores")
    .addEventListener("click", handleBackFromHiScores);
  document
    .getElementById("btn-save-score")
    .addEventListener("click", handleSaveScore);

  document.addEventListener("keydown", handleKeyDown);

  render();
}

init();

import { formatScore, formatTime } from "./scoring.js";
import { GameState } from "./state.js";

const screens = {
  [GameState.IDLE]: "screen-idle",
  [GameState.ROUND_READY]: "screen-round-ready",
  [GameState.TIMER_RUNNING]: "screen-timer-running",
  [GameState.ROUND_RESULT]: "screen-round-result",
  [GameState.GAME_OVER]: "screen-game-over",
};

export function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
}

export function showGameState(state) {
  const screenId = screens[state];
  if (screenId) {
    showScreen(screenId);
  }
}

export function updateRoundReady(currentRound, totalRounds, targetTime) {
  document.getElementById("current-round").textContent = currentRound;
  document.getElementById("total-rounds").textContent = totalRounds;
  document.getElementById("target-time").textContent = formatTime(targetTime);
}

export function updateTimerRunning(currentRound, totalRounds, targetTime) {
  document.getElementById("running-round").textContent = currentRound;
  document.getElementById("running-total").textContent = totalRounds;
  document.getElementById("running-target").textContent =
    formatTime(targetTime);
}

export function updateRoundResult(roundSummary, currentRound) {
  document.getElementById("result-round").textContent = currentRound;
  document.getElementById("result-target").textContent =
    `${roundSummary.formattedTarget}s`;
  document.getElementById("result-elapsed").textContent =
    `${roundSummary.formattedElapsed}s`;

  const differenceEl = document.getElementById("result-difference");
  const prefix = roundSummary.isOver ? "+" : "-";
  differenceEl.textContent = `${prefix}${roundSummary.formattedDifference}s`;
  differenceEl.classList.toggle("over", roundSummary.isOver);
  differenceEl.classList.toggle("under", !roundSummary.isOver);

  document.getElementById("result-score").textContent =
    roundSummary.formattedScore;

  const scoreEl = document.querySelector(".round-score");
  if (scoreEl) {
    scoreEl.classList.toggle("zero-score", roundSummary.score === 0);
  }
}

export function updateGameOver(totalScore, roundResults, isHighScore) {
  document.getElementById("final-score").textContent = formatScore(totalScore);

  const breakdown = document.getElementById("round-breakdown");
  breakdown.innerHTML = roundResults
    .map(
      (result) => `
    <div class="breakdown-row">
      <span class="breakdown-round">Round ${result.round}</span>
      <span class="breakdown-times">${formatTime(result.elapsedTime)}s / ${formatTime(result.targetTime)}s</span>
      <span class="breakdown-score">${formatScore(result.score)}</span>
    </div>
  `,
    )
    .join("");

  const entryEl = document.getElementById("hiscore-entry");
  if (isHighScore) {
    entryEl.classList.remove("hidden");
    document.getElementById("player-name").value = "";
    document.getElementById("player-name").focus();
  } else {
    entryEl.classList.add("hidden");
  }
}

export function updateHiScores(scores) {
  const list = document.getElementById("hiscore-list");

  if (scores.length === 0) {
    list.innerHTML = '<p class="no-scores">No scores yet!</p>';
    return;
  }

  list.innerHTML = scores
    .map(
      (entry, index) => `
    <div class="hiscore-row">
      <span class="hiscore-rank">${index + 1}.</span>
      <span class="hiscore-name">${escapeHtml(entry.name)}</span>
      <span class="hiscore-score">${formatScore(entry.score)}</span>
    </div>
  `,
    )
    .join("");
}

export function getPlayerName() {
  const input = document.getElementById("player-name");
  return input ? input.value.trim() : "";
}

export function showHiScoresScreen() {
  showScreen("screen-hiscores");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

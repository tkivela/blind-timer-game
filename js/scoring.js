export function calculateScore(targetTime, elapsedTime, maxPoints = 1000) {
  if (elapsedTime > targetTime) {
    return 0;
  }
  const ratio = (targetTime - elapsedTime) / targetTime;
  return Math.round(maxPoints * (1 - ratio) ** 2);
}

export function calculateTotalScore(roundScores) {
  return roundScores.reduce((sum, score) => sum + score, 0);
}

export function formatTime(seconds) {
  return seconds.toFixed(1);
}

export function formatScore(score) {
  return score.toLocaleString();
}

export function getRoundSummary(targetTime, elapsedTime, score) {
  const difference = elapsedTime - targetTime;
  const isOver = difference > 0;

  return {
    targetTime,
    elapsedTime,
    score,
    difference: Math.abs(difference),
    isOver,
    formattedTarget: formatTime(targetTime),
    formattedElapsed: formatTime(elapsedTime),
    formattedDifference: formatTime(Math.abs(difference)),
    formattedScore: formatScore(score),
  };
}

const STORAGE_KEY = "blindTimerHiScores";
const MAX_SCORES = 10;
const CURRENT_VERSION = 1;

function getDefaultData() {
  return {
    version: CURRENT_VERSION,
    scores: [],
  };
}

export function loadHiScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const data = JSON.parse(raw);

    if (data.version !== CURRENT_VERSION) {
      return [];
    }

    return data.scores || [];
  } catch {
    return [];
  }
}

export function saveHiScore(name, score, rounds) {
  const data = loadData();

  const entry = {
    name: name.substring(0, 10),
    score,
    rounds,
    date: Date.now(),
  };

  data.scores.push(entry);
  data.scores.sort((a, b) => b.score - a.score);
  data.scores = data.scores.slice(0, MAX_SCORES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function isHighScore(score) {
  const scores = loadHiScores();

  if (scores.length < MAX_SCORES) {
    return true;
  }

  const lowestScore = scores[scores.length - 1]?.score ?? 0;
  return score > lowestScore;
}

export function clearHiScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultData();
    }

    const data = JSON.parse(raw);

    if (data.version !== CURRENT_VERSION) {
      return getDefaultData();
    }

    return data;
  } catch {
    return getDefaultData();
  }
}

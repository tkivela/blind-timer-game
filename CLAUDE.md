# Blind Timer Game - Implementation Plan

A browser-based timing game where players try to stop an invisible timer as close to a target time as possible.

## Game Summary

- Player gets N rounds (default: 5, configurable)
- Each round: random target time shown (e.g., "5.3 seconds")
- Player presses Start → invisible timer runs → Player presses Stop
- Going OVER target = 0 points; otherwise score based on precision
- End: score breakdown + hi-score table (localStorage)

---

## Architecture: Functional Core / Imperative Shell

The project follows the **Functional Core / Imperative Shell** pattern:

### Functional Core (Pure, Testable)
- `js/scoring.js` - Pure scoring calculations
- `js/state.js` - Pure state transitions (returns new state, no mutations)
- `js/config.js` - Pure configuration objects

These modules:
- Have no side effects
- Take inputs, return outputs
- Are fully unit testable
- Do not access DOM, localStorage, or timers directly

### Imperative Shell (Side Effects)
- `js/main.js` - Event handling, orchestration
- `js/ui.js` - DOM manipulation
- `js/storage.js` - localStorage I/O
- `js/timer.js` - Real-time clock access

These modules:
- Handle all I/O and side effects
- Call into the functional core
- Are tested via integration tests

---

## Tooling: Biome

Use **Biome** for linting and formatting:

```bash
npm init -y
npm install --save-dev @biomejs/biome
npx biome init
```

**biome.json** configuration:
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "semicolons": "always"
    }
  }
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check .",
    "test": "node --test tests/"
  }
}
```

---

## Testing

Use **Node.js built-in test runner** for unit tests (no extra dependencies).

### Test Structure
```
tests/
├── scoring.test.js    # Test scoring calculations
├── state.test.js      # Test state transitions
└── config.test.js     # Test configuration validation
```

---

## File Structure

```
/home/tommi/hobby/aitesting/
├── index.html              # Main HTML with all screen containers
├── package.json            # npm scripts, Biome dependency
├── biome.json              # Biome configuration
├── CLAUDE.md               # This file
├── css/
│   └── style.css           # Styles, animations, responsive design
├── js/
│   ├── config.js           # Configuration constants (pure)
│   ├── state.js            # State machine (pure)
│   ├── scoring.js          # Score calculation (pure)
│   ├── timer.js            # Timer wrapper (imperative)
│   ├── ui.js               # DOM rendering (imperative)
│   ├── storage.js          # localStorage handling (imperative)
│   └── main.js             # Entry point, event bindings (imperative)
├── tests/
│   ├── scoring.test.js     # Scoring unit tests
│   ├── state.test.js       # State transition tests
│   └── config.test.js      # Config validation tests
└── readme.md               # Project documentation
```

---

## Scoring Algorithm (Pure Function)

```javascript
// If elapsed > target: score = 0
// Otherwise: score = maxPoints * (1 - (difference / target))^2

export function calculateScore(targetTime, elapsedTime, maxPoints = 1000) {
  if (elapsedTime > targetTime) return 0;
  const ratio = (targetTime - elapsedTime) / targetTime;
  return Math.round(maxPoints * Math.pow(1 - ratio, 2));
}
```

**Examples (target = 5.0s):**
| Elapsed | Score |
|---------|-------|
| 5.0s    | 1000  |
| 4.9s    | 960   |
| 4.5s    | 810   |
| 4.0s    | 640   |
| 3.0s    | 360   |
| 5.1s    | 0     |

---

## Configuration (Pure Object)

```javascript
export const DEFAULT_CONFIG = {
  totalRounds: 5,
  minTargetTime: 2.0,      // seconds
  maxTargetTime: 8.0,      // seconds
  targetPrecision: 1,      // decimal places
  maxPointsPerRound: 1000,
  scoringExponent: 2,
};
```

---

## State Machine (Pure Transitions)

### States
1. **IDLE** - Title screen
2. **ROUND_READY** - Shows target, waiting for Start
3. **TIMER_RUNNING** - Invisible timer active
4. **ROUND_RESULT** - Shows result for round
5. **GAME_OVER** - Final scores

### Pure Transition Example
```javascript
export function startRound(state, targetTime) {
  return {
    ...state,
    currentState: 'ROUND_READY',
    currentRound: state.currentRound + 1,
    targetTime,
  };
}
```

---

## UI Screens

1. **Title/Menu**: Game title, Start Game button, Hi-Scores button
2. **Round Ready**: "Round X of Y", target time (large), Start button
3. **Timer Running**: Pulsing indicator (no timer shown!), Stop button
4. **Round Result**: Target vs actual, points earned, Continue button
5. **Game Over**: Final score, round breakdown, hi-score entry
6. **Hi-Scores**: Top 10 list

---

## localStorage Schema

```javascript
// Key: 'blindTimerHiScores'
{
  version: 1,
  scores: [
    { name: "AAA", score: 4850, rounds: 5, date: 1702234567890 },
    // ... up to 10 entries
  ]
}
```

---

## Implementation Order

### Phase 1: Project Setup
1. Initialize `package.json`
2. Install and configure Biome
3. Create folder structure

### Phase 2: Functional Core + Tests
1. Implement `js/config.js` + tests
2. Implement `js/scoring.js` + tests
3. Implement `js/state.js` + tests
4. Run tests to verify

### Phase 3: Imperative Shell
1. Create `index.html` with screen structure
2. Implement `js/timer.js`
3. Implement `js/ui.js`
4. Implement `js/storage.js`
5. Implement `js/main.js` to wire everything

### Phase 4: Styling
1. Create `css/style.css`
2. Add animations (pulse, shake)
3. Mobile responsive design

### Phase 5: Polish & Deploy
1. Add keyboard support (Space bar)
2. Run Biome lint/format
3. Final testing
4. Push to GitHub, enable Pages

---

## Technical Notes

- **Timer accuracy**: Uses `performance.now()` for sub-millisecond precision
- **Target range**: 2.0s to 8.0s with 1 decimal place
- **ES Modules**: Use `type="module"` in script tags
- **No build step**: Vanilla JS, works directly on GitHub Pages
- **Tests**: Run with `npm test` (Node.js built-in test runner)
- **Dependencies**: Use exact versions (no `^` or `~` prefixes) in package.json
- **Code quality**: After any code changes, ensure `npm run check` and `npm test` pass successfully

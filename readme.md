# Blind Timer Game

A browser-based timing game where players try to stop an invisible timer as close to a target time as possible.

**[Play the game here!](https://tkivela.github.io/blind-timer-game/)**

## How to Play

1. Each round shows a random target time (e.g., "5.3 seconds")
2. Press **Start** to begin the invisible timer
3. Press **Stop** when you think the target time has elapsed
4. Going over the target = 0 points
5. The closer you are (without going over), the more points you earn!

## Running Locally

### Prerequisites

- Node.js (v18 or later)
- A modern web browser

### Setup

```bash
# Install dependencies
npm install

# Run linting and formatting checks
npm run check

# Run tests
npm test
```

### Starting the Game

Since this is a vanilla JavaScript project with ES modules, you need to serve it through a local web server:

```bash
npx serve .
```

Then open the URL shown in the terminal (typically http://localhost:3000).

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styles and animations
├── js/
│   ├── config.js       # Game configuration (pure)
│   ├── state.js        # State machine (pure)
│   ├── scoring.js      # Score calculations (pure)
│   ├── timer.js        # Timer wrapper (imperative)
│   ├── ui.js           # DOM rendering (imperative)
│   ├── storage.js      # localStorage handling (imperative)
│   └── main.js         # Entry point, event bindings
└── tests/
    ├── config.test.js
    ├── state.test.js
    └── scoring.test.js
```

## Controls

- **Mouse/Touch**: Click the buttons
- **Keyboard**: Press `Space` or `Enter` to interact with the current action

## Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check both lint and format
npm run check

# Run unit tests
npm test
```

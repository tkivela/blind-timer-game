// Peeking Animal Easter Egg
// A tropical animal randomly peeks from screen edges on the idle screen

const tropicalAnimals = [
  "🦜", // Parrot
  "🐒", // Monkey
  "🦎", // Lizard
  "🐢", // Turtle
  "🦀", // Crab
  "🦩", // Flamingo
  "🐊", // Crocodile
  "🦧", // Orangutan
  "🐠", // Tropical fish
  "🦋", // Butterfly
];

const peekPositions = [
  "from-left",
  "from-right",
  "from-bottom",
  "from-bottom-left",
  "from-bottom-right",
];

let peekTimeoutId = null;
let isOnIdleScreen = false;
let isPeeking = false;

function getRandomAnimal() {
  return tropicalAnimals[Math.floor(Math.random() * tropicalAnimals.length)];
}

function getRandomPosition() {
  return peekPositions[Math.floor(Math.random() * peekPositions.length)];
}

function getRandomDelay() {
  // Random delay between 15-45 seconds
  return 15000 + Math.random() * 30000;
}

export function triggerPeek() {
  if (isPeeking) return;

  const container = document.getElementById("peeking-animal");
  const sprite = container.querySelector(".animal-sprite");

  if (!container || !sprite) return;

  isPeeking = true;

  // Clear previous position classes
  for (const pos of peekPositions) {
    container.classList.remove(pos);
  }

  // Set random animal and position
  sprite.textContent = getRandomAnimal();
  const position = getRandomPosition();
  container.classList.add(position);

  // Trigger animation
  container.classList.add("visible");

  // Remove after animation completes (2s animation)
  setTimeout(() => {
    container.classList.remove("visible");
    isPeeking = false;
  }, 2000);
}

function scheduleNextPeek() {
  if (!isOnIdleScreen) return;

  peekTimeoutId = setTimeout(() => {
    if (isOnIdleScreen) {
      triggerPeek();
      scheduleNextPeek();
    }
  }, getRandomDelay());
}

export function startPeekingOnIdle() {
  isOnIdleScreen = true;
  scheduleNextPeek();
}

export function stopPeeking() {
  isOnIdleScreen = false;
  if (peekTimeoutId !== null) {
    clearTimeout(peekTimeoutId);
    peekTimeoutId = null;
  }
}

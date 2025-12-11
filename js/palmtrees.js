export function initPalmTrees() {
  const container = document.getElementById("palm-trees");
  if (!container) return;

  const treeCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 trees
  const trees = [];

  // Generate tree positions spread across the scene
  for (let i = 0; i < treeCount; i++) {
    const xPos =
      30 + (340 / (treeCount + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
    const scale = 0.7 + Math.random() * 0.4; // Height variation (0.7 to 1.1)
    const yBase = 270 + (1 - scale) * 20; // Taller trees slightly higher on ground
    const swayDuration = 3 + Math.random() * 2; // 3-5 seconds
    const swayDelay = Math.random() * -5; // Random start offset

    trees.push({
      x: xPos,
      y: yBase,
      scale,
      swayDuration,
      swayDelay,
      zIndex: Math.round(scale * 100), // Larger trees in front
    });
  }

  // Sort by scale so smaller trees render first (behind larger ones)
  trees.sort((a, b) => a.scale - b.scale);

  // Create SVG elements for each tree
  trees.forEach((tree, index) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "palm-tree-instance");
    group.setAttribute(
      "transform",
      `translate(${tree.x}, ${tree.y}) scale(${tree.scale})`,
    );
    group.style.transformOrigin = `${tree.x}px ${tree.y}px`;
    group.innerHTML = getPalmTreeSVG(index, tree.swayDuration, tree.swayDelay);
    container.appendChild(group);
  });
}

function getPalmTreeSVG(index, swayDuration, swayDelay) {
  const animationName = `sway-${index}`;

  return `
    <style>
      @keyframes ${animationName} {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }
      .palm-tree-instance:nth-child(${index + 1}) .fronds {
        animation: ${animationName} ${swayDuration}s ease-in-out infinite;
        animation-delay: ${swayDelay}s;
        transform-origin: 0 -180px;
      }
    </style>
    <!-- Trunk -->
    <path class="trunk" d="M0,0 C2,-30 -2,-60 0,-90 C-2,-120 2,-150 0,-180"
          fill="none" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/>
    <!-- Trunk texture lines -->
    <path class="trunk-lines" d="M-3,-20 h6 M-3,-45 h6 M-3,-70 h6 M-3,-95 h6 M-3,-120 h6 M-3,-145 h6"
          fill="none" stroke="#6B4423" stroke-width="1.5"/>
    <!-- Fronds -->
    <g class="fronds">
      <!-- Back fronds (darker, behind) -->
      <!-- Back left drooping -->
      <path d="M0,-180 Q-25,-178 -50,-168 Q-65,-160 -85,-145 L-80,-150 Q-60,-162 -45,-168 Q-25,-175 0,-180" fill="#1a6b1a"/>
      <path d="M0,-180 Q-20,-182 -40,-178 Q-55,-172 -70,-158 L-65,-162 Q-50,-172 -35,-176 Q-18,-180 0,-180" fill="#1f7a1f"/>
      <!-- Extra back left -->
      <path d="M0,-180 Q-28,-180 -55,-172 Q-72,-165 -92,-152 L-86,-156 Q-68,-166 -52,-172 Q-26,-178 0,-180" fill="#176117"/>

      <!-- Back right drooping -->
      <path d="M0,-180 Q25,-178 50,-168 Q65,-160 85,-145 L80,-150 Q60,-162 45,-168 Q25,-175 0,-180" fill="#1a6b1a"/>
      <path d="M0,-180 Q20,-182 40,-178 Q55,-172 70,-158 L65,-162 Q50,-172 35,-176 Q18,-180 0,-180" fill="#1f7a1f"/>
      <!-- Extra back right -->
      <path d="M0,-180 Q28,-180 55,-172 Q72,-165 92,-152 L86,-156 Q68,-166 52,-172 Q26,-178 0,-180" fill="#176117"/>

      <!-- Middle left angled frond -->
      <path d="M0,-180 Q-15,-195 -30,-208 Q-42,-218 -60,-228 L-55,-222 Q-38,-213 -26,-203 Q-12,-192 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q-12,-192 -22,-202 Q-32,-212 -48,-222 L-44,-217 Q-30,-208 -20,-198 Q-10,-188 0,-180" fill="#2E8B2E"/>
      <!-- Extra middle left -->
      <path d="M0,-180 Q-18,-192 -35,-202 Q-48,-212 -65,-220 L-60,-215 Q-45,-206 -32,-198 Q-16,-188 0,-180" fill="#1E7B1E"/>

      <!-- Middle right angled frond -->
      <path d="M0,-180 Q15,-195 30,-208 Q42,-218 60,-228 L55,-222 Q38,-213 26,-203 Q12,-192 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q12,-192 22,-202 Q32,-212 48,-222 L44,-217 Q30,-208 20,-198 Q10,-188 0,-180" fill="#2E8B2E"/>
      <!-- Extra middle right -->
      <path d="M0,-180 Q18,-192 35,-202 Q48,-212 65,-220 L60,-215 Q45,-206 32,-198 Q16,-188 0,-180" fill="#1E7B1E"/>

      <!-- Top left frond -->
      <path d="M0,-180 Q-8,-200 -15,-220 Q-20,-235 -28,-252 L-22,-248 Q-16,-232 -12,-218 Q-6,-198 0,-180" fill="#1E7B1E"/>
      <path d="M0,-180 Q-5,-198 -10,-215 Q-14,-230 -20,-245 L-16,-242 Q-11,-228 -8,-214 Q-4,-196 0,-180" fill="#2E8B2E"/>
      <!-- Extra top left -->
      <path d="M0,-180 Q-10,-198 -18,-218 Q-24,-234 -32,-250 L-26,-246 Q-20,-232 -15,-218 Q-8,-198 0,-180" fill="#228B22"/>

      <!-- Top center frond -->
      <path d="M0,-180 Q3,-205 2,-230 Q1,-245 -2,-262 L2,-258 Q5,-242 4,-228 Q3,-203 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q-3,-205 -2,-230 Q-1,-245 2,-262 L-2,-258 Q-5,-242 -4,-228 Q-3,-203 0,-180" fill="#2E8B2E"/>
      <!-- Extra center fronds -->
      <path d="M0,-180 Q6,-202 6,-225 Q5,-242 3,-258 L7,-254 Q9,-240 8,-225 Q7,-202 0,-180" fill="#32CD32"/>
      <path d="M0,-180 Q-6,-202 -6,-225 Q-5,-242 -3,-258 L-7,-254 Q-9,-240 -8,-225 Q-7,-202 0,-180" fill="#32CD32"/>

      <!-- Top right frond -->
      <path d="M0,-180 Q8,-200 15,-220 Q20,-235 28,-252 L22,-248 Q16,-232 12,-218 Q6,-198 0,-180" fill="#1E7B1E"/>
      <path d="M0,-180 Q5,-198 10,-215 Q14,-230 20,-245 L16,-242 Q11,-228 8,-214 Q4,-196 0,-180" fill="#2E8B2E"/>
      <!-- Extra top right -->
      <path d="M0,-180 Q10,-198 18,-218 Q24,-234 32,-250 L26,-246 Q20,-232 15,-218 Q8,-198 0,-180" fill="#228B22"/>

      <!-- Front left drooping frond (brightest, in front) -->
      <path d="M0,-180 Q-30,-172 -55,-158 Q-75,-145 -95,-125 L-88,-132 Q-70,-148 -50,-160 Q-28,-172 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q-25,-174 -48,-162 Q-66,-150 -82,-135 L-76,-140 Q-62,-152 -45,-162 Q-24,-173 0,-180" fill="#2E8B2E"/>
      <path d="M0,-180 Q-20,-176 -40,-166 Q-55,-156 -70,-142 L-65,-146 Q-52,-158 -38,-166 Q-20,-175 0,-180" fill="#32CD32"/>
      <!-- Extra front left -->
      <path d="M0,-180 Q-32,-170 -58,-154 Q-78,-140 -98,-118 L-92,-125 Q-74,-142 -55,-156 Q-30,-170 0,-180" fill="#1E7B1E"/>

      <!-- Front right drooping frond (brightest, in front) -->
      <path d="M0,-180 Q30,-172 55,-158 Q75,-145 95,-125 L88,-132 Q70,-148 50,-160 Q28,-172 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q25,-174 48,-162 Q66,-150 82,-135 L76,-140 Q62,-152 45,-162 Q24,-173 0,-180" fill="#2E8B2E"/>
      <path d="M0,-180 Q20,-176 40,-166 Q55,-156 70,-142 L65,-146 Q52,-158 38,-166 Q20,-175 0,-180" fill="#32CD32"/>
      <!-- Extra front right -->
      <path d="M0,-180 Q32,-170 58,-154 Q78,-140 98,-118 L92,-125 Q74,-142 55,-156 Q30,-170 0,-180" fill="#1E7B1E"/>

      <!-- Coconuts -->
      <circle cx="-6" cy="-176" r="6" fill="#8B4513"/>
      <circle cx="6" cy="-173" r="6" fill="#8B4513"/>
      <circle cx="0" cy="-167" r="5" fill="#6B3410"/>
      <ellipse cx="-5" cy="-178" rx="2" ry="1" fill="#a06030" opacity="0.5"/>
      <ellipse cx="7" cy="-175" rx="2" ry="1" fill="#a06030" opacity="0.5"/>
    </g>
  `;
}

export function showPalmBackground() {
  const bg = document.getElementById("palm-background");
  if (bg) {
    bg.classList.add("visible");
  }
}

export function hidePalmBackground() {
  const bg = document.getElementById("palm-background");
  if (bg) {
    bg.classList.remove("visible");
  }
}

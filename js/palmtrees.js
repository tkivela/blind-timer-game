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
    // Base y position at ground level (around 285-290 where ground visually starts)
    // All trees should have roots at the same ground level regardless of scale
    const yBase = 288;
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

  // Generate slight random variations for this tree
  const rand = () => (Math.random() - 0.5) * 2; // -1 to 1
  const variation = {
    // Angle offsets for each frond group (in degrees equivalent, applied as coordinate shifts)
    backLeft: 5 + rand() * 8, // 5 degrees base ± 8
    backRight: 5 + rand() * 8,
    midLeft: rand() * 6,
    midRight: rand() * 6,
    topLeft: rand() * 5,
    topRight: rand() * 5,
    topCenter: rand() * 4,
    frontLeft: rand() * 7,
    frontRight: rand() * 7,
    // Whether to include extra fronds (some trees have fewer)
    extraBackLeft: Math.random() > 0.3,
    extraBackRight: Math.random() > 0.3,
    extraMidLeft: Math.random() > 0.4,
    extraMidRight: Math.random() > 0.4,
    extraTopLeft: Math.random() > 0.35,
    extraTopRight: Math.random() > 0.35,
    extraCenter: Math.random() > 0.3,
    extraFrontLeft: Math.random() > 0.3,
    extraFrontRight: Math.random() > 0.3,
  };

  // Helper to apply angular variation to x coordinates
  const vx = (x, v) => Math.round(x + v);

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
      <path d="M0,-180 Q${vx(-25, variation.backLeft)},-178 ${vx(-50, variation.backLeft)},-168 Q${vx(-65, variation.backLeft)},-160 ${vx(-85, variation.backLeft)},-145 L${vx(-80, variation.backLeft)},-150 Q${vx(-60, variation.backLeft)},-162 ${vx(-45, variation.backLeft)},-168 Q${vx(-25, variation.backLeft)},-175 0,-180" fill="#1a6b1a"/>
      <path d="M0,-180 Q${vx(-20, variation.backLeft)},-182 ${vx(-40, variation.backLeft)},-178 Q${vx(-55, variation.backLeft)},-172 ${vx(-70, variation.backLeft)},-158 L${vx(-65, variation.backLeft)},-162 Q${vx(-50, variation.backLeft)},-172 ${vx(-35, variation.backLeft)},-176 Q${vx(-18, variation.backLeft)},-180 0,-180" fill="#1f7a1f"/>
      ${
        variation.extraBackLeft
          ? `<!-- Extra back left -->
      <path d="M0,-180 Q${vx(-28, variation.backLeft)},-180 ${vx(-55, variation.backLeft)},-172 Q${vx(-72, variation.backLeft)},-165 ${vx(-92, variation.backLeft)},-152 L${vx(-86, variation.backLeft)},-156 Q${vx(-68, variation.backLeft)},-166 ${vx(-52, variation.backLeft)},-172 Q${vx(-26, variation.backLeft)},-178 0,-180" fill="#176117"/>`
          : ""
      }

      <!-- Back right drooping -->
      <path d="M0,-180 Q${vx(25, variation.backRight)},-178 ${vx(50, variation.backRight)},-168 Q${vx(65, variation.backRight)},-160 ${vx(85, variation.backRight)},-145 L${vx(80, variation.backRight)},-150 Q${vx(60, variation.backRight)},-162 ${vx(45, variation.backRight)},-168 Q${vx(25, variation.backRight)},-175 0,-180" fill="#1a6b1a"/>
      <path d="M0,-180 Q${vx(20, variation.backRight)},-182 ${vx(40, variation.backRight)},-178 Q${vx(55, variation.backRight)},-172 ${vx(70, variation.backRight)},-158 L${vx(65, variation.backRight)},-162 Q${vx(50, variation.backRight)},-172 ${vx(35, variation.backRight)},-176 Q${vx(18, variation.backRight)},-180 0,-180" fill="#1f7a1f"/>
      ${
        variation.extraBackRight
          ? `<!-- Extra back right -->
      <path d="M0,-180 Q${vx(28, variation.backRight)},-180 ${vx(55, variation.backRight)},-172 Q${vx(72, variation.backRight)},-165 ${vx(92, variation.backRight)},-152 L${vx(86, variation.backRight)},-156 Q${vx(68, variation.backRight)},-166 ${vx(52, variation.backRight)},-172 Q${vx(26, variation.backRight)},-178 0,-180" fill="#176117"/>`
          : ""
      }

      <!-- Middle left angled frond -->
      <path d="M0,-180 Q${vx(-15, variation.midLeft)},-195 ${vx(-30, variation.midLeft)},-208 Q${vx(-42, variation.midLeft)},-218 ${vx(-60, variation.midLeft)},-228 L${vx(-55, variation.midLeft)},-222 Q${vx(-38, variation.midLeft)},-213 ${vx(-26, variation.midLeft)},-203 Q${vx(-12, variation.midLeft)},-192 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q${vx(-12, variation.midLeft)},-192 ${vx(-22, variation.midLeft)},-202 Q${vx(-32, variation.midLeft)},-212 ${vx(-48, variation.midLeft)},-222 L${vx(-44, variation.midLeft)},-217 Q${vx(-30, variation.midLeft)},-208 ${vx(-20, variation.midLeft)},-198 Q${vx(-10, variation.midLeft)},-188 0,-180" fill="#2E8B2E"/>
      ${
        variation.extraMidLeft
          ? `<!-- Extra middle left -->
      <path d="M0,-180 Q${vx(-18, variation.midLeft)},-192 ${vx(-35, variation.midLeft)},-202 Q${vx(-48, variation.midLeft)},-212 ${vx(-65, variation.midLeft)},-220 L${vx(-60, variation.midLeft)},-215 Q${vx(-45, variation.midLeft)},-206 ${vx(-32, variation.midLeft)},-198 Q${vx(-16, variation.midLeft)},-188 0,-180" fill="#1E7B1E"/>`
          : ""
      }

      <!-- Middle right angled frond -->
      <path d="M0,-180 Q${vx(15, variation.midRight)},-195 ${vx(30, variation.midRight)},-208 Q${vx(42, variation.midRight)},-218 ${vx(60, variation.midRight)},-228 L${vx(55, variation.midRight)},-222 Q${vx(38, variation.midRight)},-213 ${vx(26, variation.midRight)},-203 Q${vx(12, variation.midRight)},-192 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q${vx(12, variation.midRight)},-192 ${vx(22, variation.midRight)},-202 Q${vx(32, variation.midRight)},-212 ${vx(48, variation.midRight)},-222 L${vx(44, variation.midRight)},-217 Q${vx(30, variation.midRight)},-208 ${vx(20, variation.midRight)},-198 Q${vx(10, variation.midRight)},-188 0,-180" fill="#2E8B2E"/>
      ${
        variation.extraMidRight
          ? `<!-- Extra middle right -->
      <path d="M0,-180 Q${vx(18, variation.midRight)},-192 ${vx(35, variation.midRight)},-202 Q${vx(48, variation.midRight)},-212 ${vx(65, variation.midRight)},-220 L${vx(60, variation.midRight)},-215 Q${vx(45, variation.midRight)},-206 ${vx(32, variation.midRight)},-198 Q${vx(16, variation.midRight)},-188 0,-180" fill="#1E7B1E"/>`
          : ""
      }

      <!-- Top left frond -->
      <path d="M0,-180 Q${vx(-8, variation.topLeft)},-200 ${vx(-15, variation.topLeft)},-220 Q${vx(-20, variation.topLeft)},-235 ${vx(-28, variation.topLeft)},-252 L${vx(-22, variation.topLeft)},-248 Q${vx(-16, variation.topLeft)},-232 ${vx(-12, variation.topLeft)},-218 Q${vx(-6, variation.topLeft)},-198 0,-180" fill="#1E7B1E"/>
      <path d="M0,-180 Q${vx(-5, variation.topLeft)},-198 ${vx(-10, variation.topLeft)},-215 Q${vx(-14, variation.topLeft)},-230 ${vx(-20, variation.topLeft)},-245 L${vx(-16, variation.topLeft)},-242 Q${vx(-11, variation.topLeft)},-228 ${vx(-8, variation.topLeft)},-214 Q${vx(-4, variation.topLeft)},-196 0,-180" fill="#2E8B2E"/>
      ${
        variation.extraTopLeft
          ? `<!-- Extra top left -->
      <path d="M0,-180 Q${vx(-10, variation.topLeft)},-198 ${vx(-18, variation.topLeft)},-218 Q${vx(-24, variation.topLeft)},-234 ${vx(-32, variation.topLeft)},-250 L${vx(-26, variation.topLeft)},-246 Q${vx(-20, variation.topLeft)},-232 ${vx(-15, variation.topLeft)},-218 Q${vx(-8, variation.topLeft)},-198 0,-180" fill="#228B22"/>`
          : ""
      }

      <!-- Top center frond -->
      <path d="M0,-180 Q${vx(3, variation.topCenter)},-205 ${vx(2, variation.topCenter)},-230 Q${vx(1, variation.topCenter)},-245 ${vx(-2, variation.topCenter)},-262 L${vx(2, variation.topCenter)},-258 Q${vx(5, variation.topCenter)},-242 ${vx(4, variation.topCenter)},-228 Q${vx(3, variation.topCenter)},-203 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q${vx(-3, variation.topCenter)},-205 ${vx(-2, variation.topCenter)},-230 Q${vx(-1, variation.topCenter)},-245 ${vx(2, variation.topCenter)},-262 L${vx(-2, variation.topCenter)},-258 Q${vx(-5, variation.topCenter)},-242 ${vx(-4, variation.topCenter)},-228 Q${vx(-3, variation.topCenter)},-203 0,-180" fill="#2E8B2E"/>
      ${
        variation.extraCenter
          ? `<!-- Extra center fronds -->
      <path d="M0,-180 Q${vx(6, variation.topCenter)},-202 ${vx(6, variation.topCenter)},-225 Q${vx(5, variation.topCenter)},-242 ${vx(3, variation.topCenter)},-258 L${vx(7, variation.topCenter)},-254 Q${vx(9, variation.topCenter)},-240 ${vx(8, variation.topCenter)},-225 Q${vx(7, variation.topCenter)},-202 0,-180" fill="#32CD32"/>
      <path d="M0,-180 Q${vx(-6, variation.topCenter)},-202 ${vx(-6, variation.topCenter)},-225 Q${vx(-5, variation.topCenter)},-242 ${vx(-3, variation.topCenter)},-258 L${vx(-7, variation.topCenter)},-254 Q${vx(-9, variation.topCenter)},-240 ${vx(-8, variation.topCenter)},-225 Q${vx(-7, variation.topCenter)},-202 0,-180" fill="#32CD32"/>`
          : ""
      }

      <!-- Top right frond -->
      <path d="M0,-180 Q${vx(8, variation.topRight)},-200 ${vx(15, variation.topRight)},-220 Q${vx(20, variation.topRight)},-235 ${vx(28, variation.topRight)},-252 L${vx(22, variation.topRight)},-248 Q${vx(16, variation.topRight)},-232 ${vx(12, variation.topRight)},-218 Q${vx(6, variation.topRight)},-198 0,-180" fill="#1E7B1E"/>
      <path d="M0,-180 Q${vx(5, variation.topRight)},-198 ${vx(10, variation.topRight)},-215 Q${vx(14, variation.topRight)},-230 ${vx(20, variation.topRight)},-245 L${vx(16, variation.topRight)},-242 Q${vx(11, variation.topRight)},-228 ${vx(8, variation.topRight)},-214 Q${vx(4, variation.topRight)},-196 0,-180" fill="#2E8B2E"/>
      ${
        variation.extraTopRight
          ? `<!-- Extra top right -->
      <path d="M0,-180 Q${vx(10, variation.topRight)},-198 ${vx(18, variation.topRight)},-218 Q${vx(24, variation.topRight)},-234 ${vx(32, variation.topRight)},-250 L${vx(26, variation.topRight)},-246 Q${vx(20, variation.topRight)},-232 ${vx(15, variation.topRight)},-218 Q${vx(8, variation.topRight)},-198 0,-180" fill="#228B22"/>`
          : ""
      }

      <!-- Front left drooping frond (brightest, in front) -->
      <path d="M0,-180 Q${vx(-30, variation.frontLeft)},-172 ${vx(-55, variation.frontLeft)},-158 Q${vx(-75, variation.frontLeft)},-145 ${vx(-95, variation.frontLeft)},-125 L${vx(-88, variation.frontLeft)},-132 Q${vx(-70, variation.frontLeft)},-148 ${vx(-50, variation.frontLeft)},-160 Q${vx(-28, variation.frontLeft)},-172 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q${vx(-25, variation.frontLeft)},-174 ${vx(-48, variation.frontLeft)},-162 Q${vx(-66, variation.frontLeft)},-150 ${vx(-82, variation.frontLeft)},-135 L${vx(-76, variation.frontLeft)},-140 Q${vx(-62, variation.frontLeft)},-152 ${vx(-45, variation.frontLeft)},-162 Q${vx(-24, variation.frontLeft)},-173 0,-180" fill="#2E8B2E"/>
      <path d="M0,-180 Q${vx(-20, variation.frontLeft)},-176 ${vx(-40, variation.frontLeft)},-166 Q${vx(-55, variation.frontLeft)},-156 ${vx(-70, variation.frontLeft)},-142 L${vx(-65, variation.frontLeft)},-146 Q${vx(-52, variation.frontLeft)},-158 ${vx(-38, variation.frontLeft)},-166 Q${vx(-20, variation.frontLeft)},-175 0,-180" fill="#32CD32"/>
      ${
        variation.extraFrontLeft
          ? `<!-- Extra front left -->
      <path d="M0,-180 Q${vx(-32, variation.frontLeft)},-170 ${vx(-58, variation.frontLeft)},-154 Q${vx(-78, variation.frontLeft)},-140 ${vx(-98, variation.frontLeft)},-118 L${vx(-92, variation.frontLeft)},-125 Q${vx(-74, variation.frontLeft)},-142 ${vx(-55, variation.frontLeft)},-156 Q${vx(-30, variation.frontLeft)},-170 0,-180" fill="#1E7B1E"/>`
          : ""
      }

      <!-- Front right drooping frond (brightest, in front) -->
      <path d="M0,-180 Q${vx(30, variation.frontRight)},-172 ${vx(55, variation.frontRight)},-158 Q${vx(75, variation.frontRight)},-145 ${vx(95, variation.frontRight)},-125 L${vx(88, variation.frontRight)},-132 Q${vx(70, variation.frontRight)},-148 ${vx(50, variation.frontRight)},-160 Q${vx(28, variation.frontRight)},-172 0,-180" fill="#228B22"/>
      <path d="M0,-180 Q${vx(25, variation.frontRight)},-174 ${vx(48, variation.frontRight)},-162 Q${vx(66, variation.frontRight)},-150 ${vx(82, variation.frontRight)},-135 L${vx(76, variation.frontRight)},-140 Q${vx(62, variation.frontRight)},-152 ${vx(45, variation.frontRight)},-162 Q${vx(24, variation.frontRight)},-173 0,-180" fill="#2E8B2E"/>
      <path d="M0,-180 Q${vx(20, variation.frontRight)},-176 ${vx(40, variation.frontRight)},-166 Q${vx(55, variation.frontRight)},-156 ${vx(70, variation.frontRight)},-142 L${vx(65, variation.frontRight)},-146 Q${vx(52, variation.frontRight)},-158 ${vx(38, variation.frontRight)},-166 Q${vx(20, variation.frontRight)},-175 0,-180" fill="#32CD32"/>
      ${
        variation.extraFrontRight
          ? `<!-- Extra front right -->
      <path d="M0,-180 Q${vx(32, variation.frontRight)},-170 ${vx(58, variation.frontRight)},-154 Q${vx(78, variation.frontRight)},-140 ${vx(98, variation.frontRight)},-118 L${vx(92, variation.frontRight)},-125 Q${vx(74, variation.frontRight)},-142 ${vx(55, variation.frontRight)},-156 Q${vx(30, variation.frontRight)},-170 0,-180" fill="#1E7B1E"/>`
          : ""
      }

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

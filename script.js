let particles, sliders, m, n, a, b, v, N;

// Vibration strength parameters
let A = 0.02;
let minWalk = 0.002;

const settings = {
  nParticles: 90000, // Increased base density
  canvasSize: [window.innerWidth, window.innerHeight],
  drawHeatmap: false
};

const pi = 3.1415926535;

// Chladni 2D closed-form solution
const chladni = (x, y, a, b, m, n) =>
  a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);

/* Initialization */

const DOMinit = () => {
  let canvas = createCanvas(...settings.canvasSize);
  canvas.parent("sketch-container");

  // Sliders
  sliders = {
    m: select("#mSlider"),
    n: select("#nSlider"),
    a: select("#aSlider"),
    b: select("#bSlider"),
    v: select("#vSlider"),
    num: select("#numSlider"),
    dotColor: select("#dotColor"),
    bgColor: select("#bgColor"),
  };
};

const setupParticles = () => {
  particles = [];
  for (let i = 0; i < settings.nParticles; i++) {
    particles[i] = new Particle();
  }
};

/* Particle dynamics */

class Particle {
  constructor() {
    this.x = random(0, 1);
    this.y = random(0, 1);
    this.updateOffsets();
  }

  move() {
    let eq = chladni(this.x, this.y, a, b, m, n);
    this.stochasticAmplitude = v * abs(eq);
    if (this.stochasticAmplitude <= minWalk) this.stochasticAmplitude = minWalk;

    this.x += random(-this.stochasticAmplitude, this.stochasticAmplitude);
    this.y += random(-this.stochasticAmplitude, this.stochasticAmplitude);

    // Add slight random jitter to break perfect patterns
    this.x += random(-0.0015, 0.0015);
    this.y += random(-0.0015, 0.0015);

    this.updateOffsets();
  }

  updateOffsets() {
    this.x = constrain(this.x, 0, 1);
    this.y = constrain(this.y, 0, 1);
    this.xOff = width * this.x;
    this.yOff = height * this.y;
  }

  show() {
    point(this.xOff, this.yOff);
  }
}

const moveParticles = () => {
  let movingParticles = particles.slice(0, N);
  for (let particle of movingParticles) {
    particle.move();
    particle.show();
  }
};

const updateParams = () => {
  m = sliders.m.value();
  n = sliders.n.value();
  a = sliders.a.value();
  b = sliders.b.value();
  v = sliders.v.value();
  N = sliders.num.value();

  stroke(sliders.dotColor.value());
  background(sliders.bgColor.value());
};

const drawHeatmap = () => {
  if (settings.drawHeatmap) {
    let res = 3;
    for (let i = 0; i <= width; i += res) {
      for (let j = 0; j <= height; j += res) {
        let eq = chladni(i / width, j / height, a, b, m, n);
        noStroke();
        fill((eq + 1) * 127.5);
        square(i, j, res);
      }
    }
  }
};

const wipeScreen = () => {
  background(sliders.bgColor.value());
  stroke(sliders.dotColor.value());
};

function setup() {
  DOMinit();
  setupParticles();
}

function draw() {
  wipeScreen();
  updateParams();
  drawHeatmap();
  moveParticles();
}

// Spacebar toggle for UI
function keyPressed() {
  if (key === ' ') {
    document.getElementById("sidebar").classList.toggle("hidden");
  }
}

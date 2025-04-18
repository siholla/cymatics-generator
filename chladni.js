
let particles = [];
let sliders = {};
let m, n, a, b, v;

let A = 0.02;
let minWalk = 0.002;

const settings = {
  nParticles: 20000,
  canvasSize: [600, 600],
  drawHeatmap: false
};

const pi = Math.PI;

const chladni = (x, y, a, b, m, n) =>
  a * Math.sin(pi * n * x) * Math.sin(pi * m * y) + b * Math.sin(pi * m * x) * Math.sin(pi * n * y);

function setup() {
  let canvas = createCanvas(...settings.canvasSize);
  canvas.parent('sketch-container');
  pixelDensity(1);
  background(0);

  sliders = {
    m: select('#mSlider'),
    n: select('#nSlider'),
    a: select('#aSlider'),
    b: select('#bSlider'),
    v: select('#vSlider'),
    num: select('#numSlider'),
  };

  sliders.num.input(() => {
    settings.nParticles = parseInt(sliders.num.value());
    setupParticles(); // reinitialize particles
  });

  setupParticles();
}

function setupParticles() {
  particles = [];
  for (let i = 0; i < settings.nParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  m = float(sliders.m.value());
  n = float(sliders.n.value());
  a = float(sliders.a.value());
  b = float(sliders.b.value());
  v = float(sliders.v.value());

  noStroke();
  fill(255);
  for (let p of particles) {
    p.move();
    p.show();
  }
}

class Particle {
  constructor() {
    this.x = random();
    this.y = random();
  }

  move() {
    let eq = chladni(this.x, this.y, a, b, m, n);
    this.x += random(-v, v) * eq;
    this.y += random(-v, v) * eq;
    this.x = constrain(this.x, 0, 1);
    this.y = constrain(this.y, 0, 1);
  }

  show() {
    let px = this.x * width;
    let py = this.y * height;
    rect(px, py, 1, 1);
  }
}

let sliders = {};
let particles = [];
let A = 0.02;
let minWalk = 0.002;
let jitterStrength = 0.003;
let showUI = true;

let settings = {
  nParticles: 90000,
  canvasSize: [window.innerWidth, window.innerHeight],
  bg: [0, 0, 0],
  dot: [255, 255, 255]
};

function chladni(x, y, a, b, m, n) {
  const pi = Math.PI;
  return a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);
}

class Particle {
  constructor() {
    this.x = random(0, 1);
    this.y = random(0, 1);
  }

  move(a, b, m, n, v) {
    let eq = chladni(this.x, this.y, a, b, m, n);
    let amp = v * abs(eq);
    if (amp < minWalk) amp = minWalk;

    this.x += random(-amp, amp) + random(-jitterStrength, jitterStrength);
    this.y += random(-amp, amp) + random(-jitterStrength, jitterStrength);

    this.x = constrain(this.x, 0, 1);
    this.y = constrain(this.y, 0, 1);
  }

  draw() {
    point(this.x * width, this.y * height);
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  initSliders();
  for (let i = 0; i < settings.nParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(settings.bg);
  stroke(settings.dot);
  strokeWeight(1);
  noFill();

  let m = sliders.m.value();
  let n = sliders.n.value();
  let a = sliders.a.value();
  let b = sliders.b.value();
  let v = sliders.v.value();
  let N = sliders.num.value();

  for (let i = 0; i < N; i++) {
    particles[i].move(a, b, m, n, v);
    particles[i].draw();
  }
}

function initSliders() {
  sliders = {
    m: select('#mSlider'),
    n: select('#nSlider'),
    a: select('#aSlider'),
    b: select('#bSlider'),
    v: select('#vSlider'),
    num: select('#numSlider')
  };

  select('#dotColor').input(() => {
    settings.dot = hexToRgb(select('#dotColor').value());
  });

  select('#bgColor').input(() => {
    settings.bg = hexToRgb(select('#bgColor').value());
  });
}

function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  return [bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255];
}

function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
    document.getElementById('ui').classList.toggle('hidden', !showUI);
  }
}

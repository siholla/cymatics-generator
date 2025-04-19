let particles = [], sliders = {}, m, n, a, b, v, N, zoom, dotSize;
let current = {}, target = {};
let dotColorPicker, bgColorPicker;
let showUI = true;

const settings = {
  nParticles: 150000,
  drawHeatmap: false,
  easingDuration: 0.75,
  easing: t => (1 - t)**3 * 0 + 3 * (1 - t)**2 * t * 0.03 + 3 * (1 - t) * t**2 * 0.95 + t**3 * 1 // cubic-bezier(0.60, 0.03, 0.41, 0.95)
};

const pi = Math.PI;

const chladni = (x, y, a, b, m, n) =>
  a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);

function DOMinit() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('sketch-container');
  pixelDensity(1);

  sliders = {
    m: select('#mSlider'),
    n: select('#nSlider'),
    a: select('#aSlider'),
    b: select('#bSlider'),
    v: select('#vSlider'),
    num: select('#numSlider'),
    zoom: select('#zoomSlider'),
    dotSize: select('#dotSlider')
  };

  dotColorPicker = select('#dotColor');
  bgColorPicker = select('#bgColor');

  for (let key in sliders) {
    current[key] = float(sliders[key].value());
    target[key] = float(sliders[key].value());
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      showUI = !showUI;
      const panel = document.querySelector('header');
      panel.classList.toggle('hidden', !showUI);
    }
  });
}

function setupParticles() {
  particles = [];
  for (let i = 0; i < settings.nParticles; i++) {
    particles[i] = new Particle();
  }
}

class Particle {
  constructor() {
    this.x = random(0, 1);
    this.y = random(0, 1);
  }

  move() {
    let eq = chladni(this.x, this.y, a, b, m, n);
    let amp = v * abs(eq);
    if (amp <= 0.002) amp = 0.002;

    this.x += random(-amp, amp) + random(-0.0015, 0.0015);
    this.y += random(-amp, amp) + random(-0.0015, 0.0015);

    this.x = constrain(this.x, 0, 1);
    this.y = constrain(this.y, 0, 1);
  }

  show() {
    const centerX = 0.5;
    const centerY = 0.5;

    let zx = (this.x - centerX) * zoom + centerX;
    let zy = (this.y - centerY) * zoom + centerY;

    let xOff = zx * width;
    let yOff = zy * height;

    strokeWeight(dotSize);
    point(xOff, yOff);
  }
}

function moveParticles() {
  let movingParticles = particles.slice(0, N);
  for (let p of movingParticles) {
    p.move();
    p.show();
  }
}

function updateParams() {
  const easeStep = 0.05;
  for (let key in sliders) {
    target[key] = float(sliders[key].value());
    current[key] += (target[key] - current[key]) * settings.easing(easeStep);
  }

  m = current.m;
  n = current.n;
  a = current.a;
  b = current.b;
  v = current.v;
  N = current.num;
  zoom = current.zoom;
  dotSize = current.dotSize;
}

function drawHeatmap() {
  if (!settings.drawHeatmap) return;
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

function wipeScreen() {
  background(bgColorPicker.value());
  stroke(dotColorPicker.value());
}

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

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
  wipeScreen();
});


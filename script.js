let particles = [], sliders = {}, m, n, a, b, v, N;
let current = {}, target = {};
let dotColorPicker, bgColorPicker;
let rotateEnabled = true;
let angle = 0;

// vibration strength params
let A = 0.02;
let minWalk = 0.002;

const settings = {
  nParticles: 70000,
  drawHeatmap: false
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
    num: select('#numSlider')
  };

  dotColorPicker = select('#dotColor');
  bgColorPicker = select('#bgColor');

  select('#rotate').changed(() => {
    rotateEnabled = select('#rotate').checked();
  });

  select('#toggleUI').mousePressed(() => {
    const ui = document.getElementById('ui');
    ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
  });

  for (let key in sliders) {
    current[key] = float(sliders[key].value());
    target[key] = float(sliders[key].value());
  }
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
    this.updateOffsets();
  }

  move() {
    let eq = chladni(this.x, this.y, a, b, m, n);
    let amp = v * abs(eq);
    if (amp <= minWalk) amp = minWalk;

    this.x += random(-amp, amp);
    this.y += random(-amp, amp);
    this.x = constrain(this.x, 0, 1);
    this.y = constrain(this.y, 0, 1);

    this.updateOffsets();
  }

  updateOffsets() {
    this.xOff = width * this.x;
    this.yOff = height * this.y;
  }

  show() {
    point(this.xOff, this.yOff);
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
  for (let key in sliders) {
    target[key] = float(sliders[key].value());
    current[key] = lerp(current[key], target[key], 0.1); // easing
  }
  m = current.m;
  n = current.n;
  a = current.a;
  b = current.b;
  v = current.v;
  N = current.num;
}

function drawHeatmap() {
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
  if (rotateEnabled) {
    angle += 0.002;
    translate(width / 2, height / 2);
    rotate(angle);
    translate(-width / 2, -height / 2);
  }
  drawHeatmap();
  moveParticles();
}

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
  wipeScreen();
});

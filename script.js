let particles = [], sliders = {}, m, n, a, b, v, N, zoom, dotSize, jitterAmount, pixelGridSize;
let target = {};
let dotColorPicker, bgColorPicker;
let showUI = true;

const settings = {
  nParticles: 150000,
  drawHeatmap: false,
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
    dot: select('#dotSlider'),
    jitter: select('#jitterSlider'),
    grid: select('#gridSlider')
  };

  dotColorPicker = select('#dotColor');
  bgColorPicker = select('#bgColor');

  for (let key in sliders) {
    target[key] = parseFloat(sliders[key].value());

    sliders[key].input(() => {
      let tween = {};
      tween[key] = parseFloat(sliders[key].value());
      gsap.to(target, {
        duration: 0.5,
        ease: CustomEase.create("custom", "0.23, 0.62, 0.26, 0.84"),
        ...tween
      });
    });
  }

  const numberInputs = {
    m: select('#mNumber'),
    n: select('#nNumber'),
    a: select('#aNumber'),
    b: select('#bNumber'),
    v: select('#vNumber'),
    num: select('#numNumber'),
    zoom: select('#zoomNumber'),
    dot: select('#dotNumber'),
    jitter: select('#jitterNumber'),
    grid: select('#gridNumber')
  };

  for (let key in numberInputs) {
    numberInputs[key].elt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = parseFloat(numberInputs[key].value());
        const min = parseFloat(sliders[key].attribute('min'));
        const max = parseFloat(sliders[key].attribute('max'));

        if (!isNaN(value) && value >= min && value <= max) {
          sliders[key].value(value);
          let tween = {};
          tween[key] = value;
          gsap.to(target, {
            duration: 0.5,
            ease: CustomEase.create("custom", "0.23, 0.62, 0.26, 0.84"),
            ...tween
          });
        } else {
          numberInputs[key].value(sliders[key].value());
        }
      }
    });
  }

  select('#saveBtn').mousePressed(() => {
    saveCanvas('cymatic-pattern', 'png');
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      showUI = !showUI;
      const panel = document.querySelector('header');
      panel.classList.toggle('hidden', !showUI);
    }

    const key = e.key.toLowerCase();
    const increment = 1;
    if (key === 'a' || key === 'b' || key === 'm' || key === 'n') {
      const slider = sliders[key];
      let value = parseFloat(slider.value()) + increment;
      const min = parseFloat(slider.attribute('min'));
      const max = parseFloat(slider.attribute('max'));
      value = constrain(value, min, max);
      slider.value(value);
      let tween = {};
      tween[key] = value;
      gsap.to(target, {
        duration: 0.5,
        ease: CustomEase.create("custom", "0.23, 0.62, 0.26, 0.84"),
        ...tween
      });
    }
  });
}

function setupParticles() {
  particles = [];
  const gridSize = int(1 / pixelGridSize);
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      let x = map(i, 0, gridSize, -0.5, 0.5);
      let y = map(j, 0, gridSize, -0.5, 0.5);
      particles.push(new Particle(x, y));
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.updateOffsets();
  }

  move() {
    let eq = chladni(this.x, this.y, a, b, m, n);
    let amp = v * abs(eq);
    if (amp <= 0.002) amp = 0.002;

    let jitter = jitterAmount * 0.005;
    this.x += random(-amp, amp) + random(-jitter, jitter);
    this.y += random(-amp, amp) + random(-jitter, jitter);

    this.updateOffsets();
  }

  updateOffsets() {
    this.xOff = width / 2 + this.x * width * zoom;
    this.yOff = height / 2 + this.y * height * zoom;
  }

  show() {
    noStroke();
    fill(dotColorPicker.value());
    square(this.xOff, this.yOff, dotSize);
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
  m = target.m;
  n = target.n;
  a = target.a;
  b = target.b;
  v = target.v;
  N = target.num;
  zoom = target.zoom;
  dotSize = target.dot;
  jitterAmount = target.jitter;
  pixelGridSize = target.grid;
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

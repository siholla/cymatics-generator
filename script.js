let particles = [], sliders = {}, m, n, a, b, v, N, zoom, dotSize, jitterAmount;
let target = {};
let dotColorPicker, bgColorPicker;
let showUI = true;
let heldLetter = null;

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
    jitter: select('#jitterSlider')
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
    jitter: select('#jitterNumber')
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
    if (['a', 'b', 'm', 'n'].includes(key)) {
      heldLetter = key;
    }

    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && heldLetter) {
      const dir = e.key === 'ArrowUp' ? 1 : -1;
      const slider = sliders[heldLetter];
      if (!slider) return;

      let value = parseFloat(slider.value()) + dir * 0.05;
      const min = parseFloat(slider.attribute('min'));
      const max = parseFloat(slider.attribute('max'));
      value = constrain(value, min, max);

      slider.value(value);
      let tween = {};
      tween[heldLetter] = value;
      gsap.to(target, {
        duration: 0.5,
        ease: CustomEase.create("custom", "0.23, 0.62, 0.26, 0.84"),
        ...tween
      });
    }
  });

  document.addEventListener('keyup', (e) => {
    if (["a", "b", "m", "n"].includes(e.key.toLowerCase())) {
      heldLetter = null;
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
    this.x = random(-0.5, 0.5);
    this.y = random(-0.5, 0.5);
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
    strokeWeight(dotSize);
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
  m = target.m;
  n = target.n;
  a = target.a;
  b = target.b;
  v = target.v;
  N = target.num;
  zoom = target.zoom;
  dotSize = target.dot;
  jitterAmount = target.jitter;
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
  drawHeatmap();
  moveParticles();
}

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
  wipeScreen();
});


const canvas = document.getElementById('cymaticsCanvas')
const ctx = canvas.getContext('2d')

// UI elements
const densitySlider = document.getElementById('densitySlider')
const dotColorInput = document.getElementById('dotColor')
const bgColorInput = document.getElementById('bgColor')
const rotateToggle = document.getElementById('rotateToggle')

let angle = 0

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener('resize', resizeCanvas)
resizeCanvas()

function drawPattern() {
  const density = parseInt(densitySlider.value)
  const spacing = map(density, 5, 100, 80, 5)
  const dotColor = dotColorInput.value
  const bgColor = bgColorInput.value
  const rotate = rotateToggle.checked

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  ctx.save()
  ctx.translate(centerX, centerY)
  if (rotate) {
    ctx.rotate(angle)
  }

  for (let x = -centerX; x < centerX; x += spacing) {
    for (let y = -centerY; y < centerY; y += spacing) {
      const px = x / canvas.width + 0.5
      const py = y / canvas.height + 0.5

      const wave =
        Math.sin(Math.PI * 9 * px) * Math.sin(Math.PI * 14 * py) +
        Math.sin(Math.PI * 14 * px) * Math.sin(Math.PI * 9 * py)

      const brightness = Math.abs(wave)
      if (brightness > 0.5) {
        ctx.fillStyle = dotColor
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }

  ctx.restore()
}

function animate() {
  angle += 0.002
  drawPattern()
  requestAnimationFrame(animate)
}

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// Start animation
animate()

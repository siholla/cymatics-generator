
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let densitySlider = document.getElementById("density");
let dotColorPicker = document.getElementById("dotColor");
let bgColorPicker = document.getElementById("bgColor");
let rotateCheckbox = document.getElementById("rotate");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let angle = 0;

function generatePattern(density, dotColor, bgColor, rotate) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    if (rotate) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        ctx.translate(-width / 2, -height / 2);
        angle += 0.002;
    }

    let cols = density;
    let rows = density;
    let spacingX = width / cols;
    let spacingY = height / rows;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * spacingX;
            let y = j * spacingY;

            // Chladni-style wave interference function
            let value = Math.sin(i * Math.PI / cols * 10) * Math.sin(j * Math.PI / rows * 5);
            if (Math.abs(value) > 0.8) {
                ctx.fillStyle = dotColor;
                ctx.beginPath();
                ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    ctx.restore();
}

function animate() {
    let density = parseInt(densitySlider.value);
    let dotColor = dotColorPicker.value;
    let bgColor = bgColorPicker.value;
    let rotate = rotateCheckbox.checked;

    generatePattern(density, dotColor, bgColor, rotate);
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

animate();

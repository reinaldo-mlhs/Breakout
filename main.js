import { Breakout } from "./game.js";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
const font = new FontFace("DotGothic16", "url(https://fonts.googleapis.com/css2?family=DotGothic16&display=swap)");
font.load().then((f) => {
    document.fonts.add(f);
});

canvas.id = "breakout-canvas";
canvas.width = 600;
canvas.height = 600;
canvas.style.border = "1px solid white";

document.getElementById("canvas-container").appendChild(canvas);


const breakout = new Breakout(canvas);
breakout.start();

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    breakout.tick();
    window.requestAnimationFrame(render);
}

render();

import { Breakout } from "./game.js";

window.onload(() => {
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    const font = new FontFace("DotGothic16", "url(https://fonts.googleapis.com/css2?family=DotGothic16&display=swap)");

    font.load().then((f) => {
        document.fonts.add(f);
        ctx.font = "20px DotGothic16";
    }).catch(err => {
        console.log(err);
        ctx.font = "20px Arial";
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let isMobileDevice = false;

    if ("maxTouchPoints" in navigator) {
        isMobileDevice = navigator.maxTouchPoints > 0;
    }

    if (isMobileDevice) {
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
        resizeCanvas();
    }
    else {
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.border = "1px solid white";
        document.getElementById("canvas-container").style.marginTop = "10px";
    }
    canvas.id = "breakout-canvas";

    document.getElementById("canvas-container").appendChild(canvas);


    const breakout = new Breakout(canvas);
    breakout.start();
    console.log(breakout);

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0, 0, 0)";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();

        breakout.tick();
        window.requestAnimationFrame(render);
    }

    render();
});





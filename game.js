console.log("game file loaded");

import { Ball, Paddle, Brick, Collider, PowerUp } from "./objects.js";
import { playAudio, setCanvasFontSize } from "./util.js";


export class Breakout {
    constructor(canvas, isMobileDevice = false) {
        this.won = false;
        this.lost = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.numberOfLevels = 2;
        this.isMobileDevice = false;
        this.inPlay = false;

        this.canvas = canvas;

        this.ball = null;
        this.paddle = new Paddle(canvas);
        this.bricks = null;

        document.addEventListener("keydown", this.keyboardEvents.bind(this));

        if (this.isMobileDevice) {
            canvas.addEventListener("touchstart", this.setInPlay.bind(this));
            canvas.addEventListener("touchmove", this.paddle.onMoveTouch.bind(this.paddle, canvas));
        }
        else {
            canvas.addEventListener("mouseup", this.setInPlay.bind(this));
            canvas.addEventListener("mousemove", this.paddle.onMove.bind(this.paddle, canvas));
        }
        
    }

    keyboardEvents(evt) {
        if (evt.code === "Space") {
            this.inPlay = !this.inPlay;
        }
    }

    setInPlay(evt) {
        evt.preventDefault();
        this.inPlay = true;
    }

    buildBricks() {
        this.bricks = null;

        const brickWidth = 40;
        const brickHeight = brickWidth / 2;
        const paddingH = 60;
        const paddingV = 50;
        const rowGap = brickHeight;
        const colors = ["rgb(253, 21, 27)", "rgb(255, 179, 15)", "rgb(132, 147, 36)", "rgb(67, 127, 151)", "rgb(1, 41, 95)", "rgb(255, 179, 15)", "rgb(132, 147, 36)", "rgb(67, 127, 151)"];
        // const colors = ["#FF6B35","#F7C59F","#EFEFD0","#004E89","#1A659E"];
        // const colors = ["#FF4800","#FF5400","#FF6000","#FF6D00","#FF7900","#FF8500","#FF9100","#FF9E00","#FFAA00","#FFB600"];
        // const colors = ["#B76935","#A56336","#935E38","#815839","#6F523B","#5C4D3C","#4A473E","#38413F","#263C41","#143642"];

        function buildBricksFromPattern(pattern, colors) {
            const temp = [];
            pattern.forEach((rowPattern, outerIndex) => {
                temp.push([]);
                rowPattern.forEach((brk, index) => {
                    if (brk === "1") {
                        temp[outerIndex].push(new Brick(paddingH + (index * brickWidth), paddingV + (rowGap * outerIndex), brickWidth, brickHeight, colors[outerIndex]));
                    }
                });
            });

            return temp;
        }
        
        if (this.level === 1) {
            const pattern = [
                ["1","1","1","1","1","1","1","1","1","1","1","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["1","1","1","1","1","1","1","1","1","1","1","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["1","1","1","1","1","1","1","1","1","1","1","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["1","1","1","1","1","1","1","1","1","1","1","1"],
            ]
            this.bricks = buildBricksFromPattern(pattern, colors);
        }
        else if (this.level === 2) {
            const pattern = [
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
                ["1","1","0","1","1","0","0","1","1","0","1","1"],
            ]
            this.bricks = buildBricksFromPattern(pattern, colors);
        }
        else if (this.level === 3) {
            const pattern = [
                ["0","0","1","0","0","0","0","0","0","1","0","0"],
                ["0","1","1","1","0","0","0","0","1","1","1","0"],
                ["1","1","1","1","1","0","0","1","1","1","1","1"],
                ["0","1","1","1","0","0","0","0","1","1","1","0"],
                ["0","0","1","0","0","0","0","0","0","1","0","0"],
                ["0","0","0","0","0","1","1","0","0","0","0","0"],
                ["0","0","0","0","1","1","1","1","0","0","0","0"],
                ["0","0","0","0","0","1","1","0","0","0","0","0"],
            ]
            this.bricks = buildBricksFromPattern(pattern, colors);
        }
        else if (this.level === 4) {
            const pattern = [
                ["0","0","1","0","1","0","1","0","1","0","1","0"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","1","0","1","0","1","0","1","0","1","0","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","0","1","0","1","0","1","0","1","0","1","0"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","1","0","1","0","1","0","1","0","1","0","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","0","1","0","1","0","1","0","1","0","1","0"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","1","0","1","0","1","0","1","0","1","0","1"],
                ["0","0","0","0","0","0","0","0","0","0","0","0"],
                ["0","0","1","0","1","0","1","0","1","0","1","0"],
            ]
            this.bricks = buildBricksFromPattern(pattern, colors);
        }
        else if (this.level === 4) {
            const pattern = [
                ["1","1","1","0","0","1","1","0","0","1","1","1"],
                ["1","1","0","0","1","1","1","1","0","0","1","1"],
                ["1","0","0","1","1","1","1","1","1","0","0","1"],
                ["0","0","1","1","1","1","1","1","1","1","0","0"],
                ["0","1","1","1","0","0","0","0","1","1","1","0"],
                ["1","1","1","0","0","1","1","0","0","1","1","1"],
                ["1","1","0","0","1","1","1","1","0","0","1","1"],
                ["1","1","1","0","0","1","1","0","0","1","1","1"],
                ["0","1","1","1","0","0","0","0","1","1","1","0"],
                ["0","0","1","1","1","1","1","1","1","1","0","0"],
                ["1","0","0","1","1","1","1","1","1","0","0","1"],
                ["1","1","0","0","1","1","1","1","0","0","1","1"],
                ["1","1","1","0","0","1","1","0","0","1","1","1"],
            ]
            this.bricks = buildBricksFromPattern(pattern, colors);
        }

        
    }

    start(level = 1) {
        this.won = false;
        this.lost = false;
        this.score = 0;
        this.lives = level === 1 ? 3 : this.lives;

        this.level = 1;
        if (level <= this.numberOfLevels) {
            this.level = level;
        }
        
        this.ball = null;
        Collider.allInstances = [this.paddle];

        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2 + this.canvas.height / 4);

        this.buildBricks();
    }

    checkLost() {
        this.lives = Math.max(0, Math.min(this.lives - 1, 10));

        if (this.lost === false) {
            
            PowerUp.allInstances = undefined;
            this.inPlay = false;
            this.ball = null;

            if (this.lives === 0) {
                this.lost = true;
                playAudio("./assets/audio/gameover_fail.wav");
                setTimeout(() => {
                    this.start();
                }, 5000);
            }
            else {
                this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2 + this.canvas.height / 4);
            }
        }
    }

    checkWin() {
        const won = this.bricks.every(brickRow => {
            return brickRow.every(brk => brk.state === 0);
        });

        if (won) {
            this.won = true;
            PowerUp.allInstances = undefined;
            this.inPlay = false;
            this.ball = null;
            playAudio("./assets/audio/gameover_win.wav");
            setTimeout(() => {
                this.start(this.level + 1);
            }, 5000);
        }

    }

    doPowerUp(powerUpInstance) {
        console.log("pwer up");
        playAudio("./assets/audio/score.wav");
        powerUpInstance.inPlay = false;

        if (powerUpInstance.powerUp === "score") {
            this.score = this.score + 50;
        }
        else if (powerUpInstance.powerUp === "paddle_width_increase") {
            this.paddle.width = this.paddle.width + 30;
            setTimeout(() => this.paddle.width = this.paddle.width - 30, 5000);
        }
        else if (powerUpInstance.powerUp === "ball_pass_through") {
            this.ball.passThrough = true;
            setTimeout(() => this.ball.passThrough = false, 2000);
        }
        else if (powerUpInstance.powerUp === "extra_life") {
            this.lives = this.lives + 1;
        }
    }

    drawUI() {
        const ctx = this.canvas.getContext('2d');
        //score ui
        setCanvasFontSize(ctx, "20px");
        ctx.fillStyle = "white";
        ctx.fillText(this.lives, 50, 30);
        //lives ui
        setCanvasFontSize(ctx, "20px");
        ctx.fillStyle = "white";
        ctx.fillText(this.score, this.canvas.width - 50, 30);
        //level ui
        setCanvasFontSize(ctx, "20px");
        ctx.fillStyle = "white";
        ctx.textAlign = 'center';
        ctx.fillText("Level: " + this.level, this.canvas.width / 2, 30);
        //win ui
        if (this.won) {
            setCanvasFontSize(ctx, "50px");
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.fillText("YOU WON", this.canvas.width / 2, this.canvas.height / 2);
        }
        else if (this.lost) {
            setCanvasFontSize(ctx, "50px");
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.fillText("YOU LOST", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    tick() {

        if (this.ball?.outOfBounds) {
            this.checkLost();
        }

        if (this.ball?.scored > 0) {
            this.score = this.score + this.ball.scored;
            this.ball.scored = 0;
            this.checkWin();
        }

        this.ball?.render(this.canvas, this.inPlay);
        this.paddle.render(this.canvas);

        this.bricks.forEach(brickRow => {
            brickRow.forEach(brk => brk.render(this.canvas));
        });

        PowerUp.allInstances?.forEach((pwr, index) => {
            if (pwr.inPlay === false) {
                pwr = null;
                PowerUp.allInstances.splice(index, 1);
            }
            else {
                const caughtByPaddle = pwr.render(this.canvas, this.paddle);
                if (caughtByPaddle) this.doPowerUp(pwr);
            }
        });

        this.drawUI();
    }
}
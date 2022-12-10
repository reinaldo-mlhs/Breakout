console.log("game file loaded");

import { Ball, Paddle, Brick, Collider, PowerUp } from "./objects.js";

function playAudio(url) {
    new Audio(url).play();
}

export class Breakout {
    constructor(canvas) {
        this.won = false;
        this.lost = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.numberOfLevels = 2;

        this.canvas = canvas;

        this.ball = null;
        this.paddle = new Paddle(canvas);
        this.bricks = null;
    }

    buildBricks() {
        this.bricks = null;

        const brickHeight = 20;
        const brickWidth = 40;
        const paddingH = 20;
        const paddingV = 50;
        const rowGap = 20;
        
        if (this.level === 1) {
            const nBricksPerRow = Math.floor((this.canvas.width - (paddingH * 2)) / brickWidth);
            const brickCenterGapIndex = nBricksPerRow / 2;
            const rows = ["rgb(253, 21, 27)", "rgb(255, 179, 15)", "rgb(132, 147, 36)", "rgb(67, 127, 151)", "rgb(1, 41, 95)"];

            this.bricks = Array.from({ length: rows.length }, (_, iOut) => {
                return Array.from({ length: nBricksPerRow - 2 }, (_, i) => {
                    const tempIndex = i + 1 >= brickCenterGapIndex ? i + 2 : i;
                    return new Brick(paddingH + (tempIndex * brickWidth), paddingV + (rowGap * iOut), brickWidth, brickHeight, rows[iOut])
                });
            });
        }
        else if (this.level === 2) {
            const nBricksPerRow = Math.floor((this.canvas.width - (paddingH * 2)) / brickWidth);
            const rows = ["rgb(253, 21, 27)", "rgb(255, 179, 15)", "rgb(132, 147, 36)", "rgb(67, 127, 151)", "rgb(1, 41, 95)"];

            this.bricks = Array.from({ length: rows.length }, (_, iOut) => {
                return Array.from({ length: nBricksPerRow }, (_, i) => new Brick(paddingH + (i * brickWidth), paddingV + (rowGap * iOut), brickWidth, brickHeight, rows[iOut]));
            });
        }

        
    }

    start(level = 1) {
        this.won = false;
        this.lost = false;
        this.score = 0;
        this.lives = 3;

        this.level = 1;
        if (level <= this.numberOfLevels) {
            this.level = level;
        }
        
        this.ball = null;
        Collider.allInstances = [this.paddle];

        this.ball = new Ball();

        this.buildBricks();
    }

    checkLost() {
        this.lives = Math.max(0, Math.min(this.lives - 1, 10));

        if (this.lost === false) {
            if (this.lives === 0) {
                this.lost = true;
                playAudio("./audio/gameover_fail.wav");
                setTimeout(() => {
                    this.start();
                }, 5000);
            }
            else {
                this.ball = null;
                this.ball = new Ball();
            }
        }
    }

    checkWin() {
        const won = this.bricks.every(brickRow => {
            return brickRow.every(brk => brk.state === 0);
        });

        if (won) {
            this.won = true;
            this.ball.dX = 0;
            this.ball.dY = 0;
            playAudio("./audio/gameover_win.wav");
            setTimeout(() => {
                this.start(this.level + 1);
            }, 5000);
        }

    }

    drawUI() {
        const ctx = this.canvas.getContext('2d');
        //score ui
        ctx.font = "20px DotGothic16";
        ctx.fillStyle = "white";
        ctx.fillText(this.lives, 50, 30);
        //lives ui
        ctx.font = "20px DotGothic16";
        ctx.fillStyle = "white";
        ctx.fillText(this.score, this.canvas.width - 50, 30);
        //win ui
        if (this.won) {
            ctx.font = "50px DotGothic16";
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.fillText("YOU WON", this.canvas.width / 2, this.canvas.height / 2);
        }
        else if (this.lost) {
            ctx.font = "50px DotGothic16";
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.fillText("YOU LOST", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    tick() {

        if (this.ball.outOfBounds) {
            this.checkLost();
        }

        if (this.ball.scored > 0) {
            this.score = this.score + this.ball.scored;
            this.ball.scored = 0;
            this.checkWin();
        }

        this.ball.render(this.canvas);
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
                const score = pwr.render(this.canvas, this.paddle);
                this.score = this.score + score;
            }
        });

        this.drawUI();
    }
}
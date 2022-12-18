console.log("objects file loaded");
import { setCanvasFontSize, playAudio } from "./util.js";


export class Collider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if (Collider.allInstances === undefined) {
            Collider.allInstances = [this];
        }
        else {
            Collider.allInstances.push(this);
        }
    }
}
export class Ball {

    constructor(x, y, dX = 2, dY = 4) {
        this.x = x;
        this.y = y;
        this.dX = dX;
        this.dY = dY;

        this.radius = 5;
        this.outOfBounds = false;
        this.scored = 0;

        this.passThrough = false;
    }

    render(canvas, inPlay) {

        if (inPlay) {

            // checks collision against game borders
            if (this.x - this.radius <= 0) {
                playAudio("./assets/audio/bounce.flac");
                this.dX = Math.abs(this.dX);
            }
            if (this.x + this.radius >= canvas.width) {
                playAudio("./assets/audio/bounce.flac");
                this.dX = Math.abs(this.dX) * -1;
            }
            if (this.y - this.radius <= 0) {
                playAudio("./assets/audio/bounce.flac");
                this.dY = this.dY * -1;
            }
            else if (this.y + this.radius >= canvas.height) {
                playAudio("./assets/audio/fail.wav");
                this.outOfBounds = true;
            }


            for (let i = 0; i < Collider.allInstances.length; i++) {
                const c = Collider.allInstances[i];

                if (c instanceof Brick && c.state === 0) continue;

                //collision from left and right
                if (this.x - this.radius + this.dX < c.x + c.width &&
                    this.x + this.radius + this.dX > c.x &&
                    this.y - this.radius < c.y + c.height &&
                    this.y + this.radius > c.y) {

                    if (c instanceof Brick) {
                        playAudio("./assets/audio/glass_hit.mp3");
                        c.state = 0;
                        c.powerUpDrop();
                        this.scored = 10;
                        if (!this.passThrough) {
                            this.dX = this.dX * -1;
                        }
                    }
                    else {
                        this.dX = this.dX * -1;
                    }
                    
                }
                //collision from top and bottom
                if (this.x - this.radius < c.x + c.width &&
                    this.x + this.radius > c.x &&
                    this.y - this.radius + this.dY < c.y + c.height &&
                    this.y + this.radius + this.dY > c.y) {

                    if (c instanceof Brick) {
                        playAudio("./assets/audio/glass_hit.mp3");
                        c.state = 0;
                        c.powerUpDrop();
                        this.scored = 10;
                        if (!this.passThrough) {
                            this.dY = this.dY * -1;
                        }
                    }
                    else if (c instanceof Paddle) {
                        // console.log(this.dX, this.dY);
                        playAudio("./assets/audio/bounce.flac");
                        const paddleXReflexThreshold = c.width / 5;
                        // -------
                        // -|-|---|-|-

                        // (-)|-|---|-|-
                        if (this.x + this.dX < c.x + paddleXReflexThreshold) {
                            // -->
                            if (this.dX > 0) {
                                this.dX = -2;
                            }
                            // <--
                            else {
                                this.dX = -2.5;
                            }
                        }
                        // -|(-)|---|-|-
                        else if (this.x + this.dX < c.x + paddleXReflexThreshold * 2) {
                            if (this.dX > 0) {
                                this.dX = -1;
                            }
                            else {
                                this.dX = -1.5;
                            }
                        }
                        // -|-|---|(-)|-
                        else if (this.x + this.dX > c.x + c.width - paddleXReflexThreshold * 2) {
                            if (this.dX < 0) {
                                this.dX = 1;
                            }
                            else {
                                this.dX = 1.5;
                            }
                        }
                        // -|-|---|-|(-)
                        else if (this.x + this.dX > c.x + c.width - paddleXReflexThreshold) {
                            if (this.dX < 0) {
                                this.dX = 2;
                            }
                            else {
                                this.dX = 2.5;
                            }
                        }
                        this.dY = this.dY * -1;
                    };
                    
                }
            }

            this.x = this.x + this.dX;
            this.y = this.y + this.dY;
        }
        else {

        }
        
        const color = this.passThrough ? "yellow" : "white";
        drawBall(canvas.getContext('2d'), this.x, this.y, this.radius, color);
    }
}
export class Brick extends Collider {
    constructor(x, y, width, height, color = "rgb(237, 28, 36)") {
        super(x, y, width, height);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
        this.state = 1;
    }

    powerUpDrop() {
        const r = Math.random();
        // 15% chance of spawning power up
        if (r > 0.9) {
            if (PowerUp.allInstances) {
                PowerUp.allInstances.push(new PowerUp(this.x + (this.width / 2), this.y));
            }
            else {
                PowerUp.allInstances = [new PowerUp(this.x + (this.width / 2), this.y)];
            }
        }
    }

    render(canvas) {
        if (this.state === 1) drawBrick(canvas.getContext('2d'), this.x, this.y, this.width, this.height, this.color);
        // if (this.state === 0) drawRect(canvas.getContext('2d'), this.x, this.y, this.width, this.height, "rgb(0,255,0)");
    }
}
export class PowerUp {
    constructor(x, y, dY = 0.8) {
        this.x = x;
        this.y = y;
        this.dY = dY;

        this.inPlay = 1;

        this.powerUps = [
            "paddle_width_increase", "paddle_width_increase", "paddle_width_increase", "paddle_width_increase", "paddle_width_increase", "paddle_width_increase",
            "ball_pass_through", "ball_pass_through", "ball_pass_through", 
            "extra_life"
        ];
        this.powerUp = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];

        if (PowerUp.allInstances === undefined) {
            PowerUp.allInstances = [this];
        }
        else {
            PowerUp.allInstances.push(this);
        }
    }

    render(canvas, paddle) {
        this.y = this.y + this.dY;

        // out of bounds
        if (this.y >= canvas.height) {
            this.inPlay = false;
        }

        if (this.powerUp === "score") {
            drawScorePowerUp(canvas.getContext('2d'), 50, this.x, this.y);
        }
        else {
            if (this.powerUp === "paddle_width_increase") {
                drawPowerUp(canvas.getContext('2d'), this.x, this.y, 30, 10, "rgb(63, 72, 204)");
            }
            else if (this.powerUp === "ball_pass_through") {
                drawPowerUp(canvas.getContext('2d'), this.x, this.y, 30, 10, "yellow");
            }
            else if (this.powerUp === "extra_life") {
                drawHeart(canvas.getContext('2d'), this.x, this.y);
            }
        }

        if (this.inPlay) {
            if (this.x < paddle.x + paddle.width &&
                this.x > paddle.x &&
                this.y + this.dY < paddle.y + paddle.height &&
                this.y + this.dY > paddle.y) { 
                    return true;
            }
        }
        return false;
    }
}
export class Paddle extends Collider {
    constructor(canvas, x = 300, width = 70, height = 10, speed = 2) {
        super(x, canvas.height - 30, width, height);
        this.x = x;
        this.y = canvas.height - 30;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    onMove(canvas, evt) {
        if (canvas && evt) {
            var rect = canvas.getBoundingClientRect();
            this.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width - (this.width / 2);
            this.x = Math.max(0, Math.min(this.x, (canvas.width - this.width)));
        }
    }

    onMoveTouch(canvas, evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (canvas && evt) {
            var rect = canvas.getBoundingClientRect();
            this.x = (evt.changedTouches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width - (this.width / 2);
            this.x = Math.max(0, Math.min(this.x, (canvas.width - this.width)));
        }
    }

    render(canvas) {
        drawPaddle(canvas.getContext('2d'), this.x, this.y, this.width, this.height);
    }
}

function drawPaddle(ctx, x, y, w, h) {
    ctx.strokeStyle = "rgb(63, 72, 204)";
    ctx.fillStyle = "rgb(63, 72, 204)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.stroke();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.moveTo(x - 2 + w, y + 2);
    ctx.lineTo(x + 2, y + 2);
    ctx.stroke();
};

function drawBrick(ctx, x, y, w, h, color) {
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x, y, w, h,);
    ctx.stroke();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.moveTo(x - 2 + w, y + 2);
    ctx.lineTo(x + 2, y + 2);
    ctx.lineTo(x + 2, y - 2 + h);
    ctx.stroke();
};

function drawScorePowerUp(ctx, score, x, y) {
    setCanvasFontSize(ctx, "15px");
    ctx.fillStyle = "yellow";
    ctx.textAlign = 'center';
    ctx.fillText(score, x, y);
};

function drawPowerUp(ctx, x, y, w, h, color) {
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.stroke();
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.moveTo(x - 5 + w, y + 3);
    ctx.lineTo(x + 5, y + 3);
    ctx.stroke();
};

function drawBall(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
};


function drawHeart(ctx, fromx, fromy) {

    var x = fromx;
    var y = fromy;
    var width = 20;
    var height = 20;
  
    ctx.save();
    ctx.beginPath();
    var topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      x, y, 
      x - width / 2, y, 
      x - width / 2, y + topCurveHeight
    );
  
    // bottom left curve
    ctx.lineTo(x, y + height)
  
    // bottom right curve
    ctx.lineTo(x + width / 2, y + topCurveHeight)
  
    // top right curve
    ctx.bezierCurveTo(
      x + width / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
  
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    var topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      x, y, 
      x - width / 2, y, 
      x - width / 2, y + topCurveHeight
    );
  
    // bottom left curve
    ctx.lineTo(x, y + height)
  
    // bottom right curve
    ctx.lineTo(x + width / 2, y + topCurveHeight)
  
    // top right curve
    ctx.bezierCurveTo(
      x + width / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
  
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1
    ctx.stroke();

    ctx.restore();
}
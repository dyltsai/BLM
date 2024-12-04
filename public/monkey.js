class Monkey {
    constructor(app) {
        this.app = app;
        this.redSquare = new PIXI.Graphics();
        this.redSquare.beginFill(0xff0000);
        this.redSquare.drawRect(0, 0, 50, 50);
        this.redSquare.endFill();
        this.redSquare.x = 0;
        this.redSquare.y = app.screen.height / 2 - 25;
        this.app.stage.addChild(this.redSquare);

        this.redSquareVelocity = 2;
        this.attachedVine = null;
        this.jumpVelocityX = 5;
        this.jumpVelocityY = -15;
        this.gravity = 0.5;
    }

    animate() {
        if (this.redSquareVelocity !== 0) {
            this.redSquare.x += this.redSquareVelocity;
            if (this.redSquare.x <= 0 || this.redSquare.x + 50 >= this.app.screen.width) {
                this.redSquareVelocity *= -1;
            }
        }

        if (this.attachedVine) {
            const vine = this.attachedVine;
            const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
            const endY = vine.anchorY + vine.length * Math.cos(vine.angle);
            this.redSquare.x = endX - 25;
            this.redSquare.y = endY - 25;
        } else {
            this.redSquare.x += this.jumpVelocityX;
            this.redSquare.y += this.jumpVelocityY;
            this.jumpVelocityY += this.gravity;

            if (this.redSquare.y + 50 >= this.app.screen.height) {
                this.redSquare.y = this.app.screen.height - 50;
                this.jumpVelocityY = 0;
                this.redSquareVelocity = 2;
            }
        }
    }

    checkCollision(vineStartX, vineStartY, vineEndX, vineEndY) {
        const squareLeft = this.redSquare.x;
        const squareRight = this.redSquare.x + 50;
        const squareTop = this.redSquare.y;
        const squareBottom = this.redSquare.y + 50;

        return this.lineIntersectsRect(vineStartX, vineStartY, vineEndX, vineEndY, squareLeft, squareTop, squareRight, squareBottom);
    }

    lineIntersectsRect(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectBottom) {
        if ((x1 >= rectLeft && x1 <= rectRight && y1 >= rectTop && y1 <= rectBottom) ||
            (x2 >= rectLeft && x2 <= rectRight && y2 >= rectTop && y2 <= rectBottom)) {
            return true;
        }
        return this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectTop) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectTop, rectRight, rectBottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectBottom, rectLeft, rectBottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectBottom, rectLeft, rectTop);
    }

    lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom === 0) {
            return false;
        }
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
    }
}

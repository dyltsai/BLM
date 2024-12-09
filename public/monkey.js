class Monkey {
    constructor(app) {
        this.app = app;
        this.redSquare = new PIXI.Graphics();
        this.redSquare.beginFill(0xff0000);
        this.redSquare.drawRect(0, 0, 50, 50);
        this.redSquare.endFill();
        
        // Initialize position and state
        this.attachedVine = null;
        this.lastVineIndex = -1;
        this.jumpVelocityX = 0;
        this.jumpVelocityY = 0;
        this.gravity = 0.5;
        this.redSquareVelocity = 0;

        // Add to stage but don't set position yet
        this.app.stage.addChild(this.redSquare);
    }

    // New method to initialize with first vine
    initializeWithVine(firstVine) {
        this.attachedVine = firstVine;
        this.lastVineIndex = 0;
        const endX = firstVine.anchorX + firstVine.length * Math.sin(firstVine.angle);
        const endY = firstVine.anchorY + firstVine.length * Math.cos(firstVine.angle);
        this.redSquare.x = endX - 25;
        this.redSquare.y = endY - 25;
    }

    animate(vines) {
        if (this.redSquareVelocity !== 0) {
            this.redSquare.x += this.redSquareVelocity;
            if (this.redSquare.x <= 0 || this.redSquare.x + 50 >= this.app.screen.width) {
                this.redSquareVelocity *= -1;
            }
        }

        // Check collisions only with vines ahead of the last used vine
        if (!this.attachedVine) {
            for (let i = 0; i < vines.length; i++) {
                if (i <= this.lastVineIndex) continue;
                
                const vine = vines[i];
                const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
                const endY = vine.anchorY + vine.length * Math.cos(vine.angle);

                if (this.checkCollision(this.redSquare, vine.anchorX, vine.anchorY, endX, endY)) {
                    this.redSquareVelocity = 0;
                    this.attachedVine = vine;
                    this.lastVineIndex = i;
                    break;
                }
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

    jump() {
        if (this.attachedVine) {
            const vine = this.attachedVine;
            // Calculate angular velocity based on vine's current state
            const angularVelocity = vine.swingSpeed * vine.swingAmplitude * Math.cos(vine.time * vine.swingSpeed);
            
            // Base jump power
            const baseJumpPower = 15;
            
            // Modify jump power based on vine's angular velocity
            const jumpPower = baseJumpPower * (1 + Math.abs(angularVelocity) * 0.2);
            
            // Calculate jump direction based on vine angle and swing speed
            this.jumpVelocityX = jumpPower * Math.sin(vine.angle + Math.PI/2) * Math.sign(angularVelocity);
            this.jumpVelocityY = -jumpPower * Math.cos(vine.angle - (3 * Math.PI/7));
            
            this.attachedVine = null;
        }
    }

    checkCollision(square, vineStartX, vineStartY, vineEndX, vineEndY) {
        const squareLeft = square.x;
        const squareRight = square.x + 50;
        const squareTop = square.y;
        const squareBottom = square.y + 50;

        // Check if any part of the vine intersects with the square
        return this.lineIntersectsRect(vineStartX, vineStartY, vineEndX, vineEndY, squareLeft, squareTop, squareRight, squareBottom);
    }

    lineIntersectsRect(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectBottom) {
        // Check if either end of the line is inside the rectangle
        if ((x1 >= rectLeft && x1 <= rectRight && y1 >= rectTop && y1 <= rectBottom) ||
            (x2 >= rectLeft && x2 <= rectRight && y2 >= rectTop && y2 <= rectBottom)) {
            return true;
        }

        // Check if the line intersects any of the rectangle's sides
        return this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectTop) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectTop, rectRight, rectBottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectBottom, rectLeft, rectBottom) ||
               this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectBottom, rectLeft, rectTop);
    }

    lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom === 0) {
            return false; // Lines are parallel
        }
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
    }
}
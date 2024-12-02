class VineSimulator {
    constructor(width = 800, height = 600) {
        // Create the application
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xffffff,
            resizeTo: window
        });
    
        // Append the canvas to the document
        document.body.appendChild(this.app.view);
    
        // Vine properties
        this.vines = [];
        this.createVines();
    
        // Create red square
        this.createRedSquare();
    
        // Animate vines and red square
        this.app.ticker.add(this.animateVines.bind(this));
        this.app.ticker.add(this.animateRedSquare.bind(this));
    
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    
        // Track the last attached vine
        this.lastAttachedVine = null;
    
        // Physics properties for parabolic motion
        this.gravity = 0.5;
        this.jumpVelocityX = 0;
        this.jumpVelocityY = 0;
    
        // Update existing vines to swing slower
        this.updateExistingVines();
    }

    updateExistingVines() {
        for (const vine of this.vines) {
            vine.damping = 0.995; // Increased damping for significantly slower swinging
            vine.gravity = 0.01 * (1 + Math.random() * 0.1); // Further reduced gravity for wider swinging
        }
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            // Start moving the red square again if it has stopped
            if (this.redSquareVelocity === 0 && this.attachedVine) {
                const vine = this.attachedVine;
                this.jumpVelocityX = 5 * Math.cos(vine.angle); // Adjust the multiplier for desired speed
                this.jumpVelocityY = -5 * Math.sin(vine.angle); // Adjust the multiplier for desired speed
                this.attachedVine = null;
            } else if (this.redSquareVelocity === 0) {
                this.redSquareVelocity = 2;
            }
        }
    }
  
    createVines() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        
        // Vine lengths (proportional to screen height, ensuring they end before bottom)
        const lengths = [
            screenHeight * 0.6,  // Short vine
            screenHeight * 0.75, // Medium vine
            screenHeight * 0.5   // Shortest vine
        ];
  
        // Vine positions across the screen
        const xPositions = [
            screenWidth * 0.25,  // Left
            screenWidth * 0.5,   // Center
            screenWidth * 0.75   // Right
        ];
  
        // Create three vines with different characteristics
        for (let i = 0; i < 3; i++) {
            const vineGraphics = new PIXI.Graphics();
            
            // Vine properties
            const vine = {
                graphics: vineGraphics,
                anchorX: xPositions[i],
                anchorY: 0,
                length: lengths[i],
                angle: Math.PI / 4 * (i + 1) / 2, // Slightly different starting angles
                angleVelocity: 0,
                angleAcceleration: 0,
                damping: 0.995,
                gravity: 0.2 * (1 + i * 0.1) // Slight variation in gravity
            };
  
            // Style the vine line
            vineGraphics.lineStyle({
                width: 4,
                color: 0x008000,  // Dark green color
                alpha: 1
            });
  
            // Add the vine graphics to the stage
            this.app.stage.addChild(vineGraphics);
            this.vines.push(vine);
        }
    }
  
    createRedSquare() {
        this.redSquare = new PIXI.Graphics();
        this.redSquare.beginFill(0xff0000);
        this.redSquare.drawRect(0, 0, 50, 50); // Draw a 50x50 red square
        this.redSquare.endFill();
  
        // Position the red square to the left of the screen
        this.redSquare.x = 0; // Left edge of the screen
        this.redSquare.y = this.app.screen.height / 2 - 25; // Center vertically
  
        // Add the red square to the stage
        this.app.stage.addChild(this.redSquare);
  
        // Set initial velocity for the red square
        this.redSquareVelocity = 2;
        this.followingVine = null;
    }
  
    animateVines() {
        for (const vine of this.vines) {
            // Update the angle based on velocity and acceleration
            vine.angleVelocity += vine.angleAcceleration;
            vine.angle += vine.angleVelocity;
    
            // Apply damping to slow down the swinging
            vine.angleVelocity *= vine.damping;
    
            // Apply gravity to the vine's angle acceleration
            vine.angleAcceleration = -vine.gravity * Math.sin(vine.angle);
    
            // Draw the vine
            vine.graphics.clear();
            vine.graphics.lineStyle({
                width: 4,
                color: 0x008000,  // Dark green color
                alpha: 1
            });
            vine.graphics.moveTo(vine.anchorX, vine.anchorY);
            vine.graphics.lineTo(
                vine.anchorX + vine.length * Math.sin(vine.angle),
                vine.anchorY + vine.length * Math.cos(vine.angle)
            );
        }
    }

    animateRedSquare() {
        if (this.redSquareVelocity !== 0) {
            // Move the red square left to right
            this.redSquare.x += this.redSquareVelocity;
        
            // Bounce back when reaching the edges of the screen
            if (this.redSquare.x <= 0 || this.redSquare.x + 50 >= this.app.screen.width) {
                this.redSquareVelocity *= -1;
            }
        
            // Check for collision with vines
            for (const vine of this.vines) {
                const startX = vine.anchorX;
                const startY = vine.anchorY;
                const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
                const endY = vine.anchorY + vine.length * Math.cos(vine.angle);
        
                if (this.checkCollision(this.redSquare, startX, startY, endX, endY) && vine !== this.lastAttachedVine) {
                    this.redSquareVelocity = 0;
                    this.attachedVine = vine;
                    this.lastAttachedVine = vine;
                    this.moveScreenLeft();
                    break; // Stop checking further if a collision is detected
                }
            }
        } else if (this.attachedVine) {
            // Follow the trajectory of the vine
            const vine = this.attachedVine;
            const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
            const endY = vine.anchorY + vine.length * Math.cos(vine.angle);
            this.redSquare.x = endX - 25; // Center the square on the vine's end point
            this.redSquare.y = endY - 25;
        } else {
            // Apply parabolic motion
        this.redSquare.x += this.jumpVelocityX;
        this.redSquare.y += this.jumpVelocityY;
        this.jumpVelocityY += this.gravity;

        // Check for ground collision (bottom of the screen)
        if (this.redSquare.y + 50 >= this.app.screen.height) {
            this.redSquare.y = this.app.screen.height - 50;
            this.jumpVelocityY = 0;
            this.redSquareVelocity = 2; // Resume horizontal movement
        }
    }
}

    moveScreenLeft() {
        const screenWidth = this.app.screen.width;
        const offset = this.redSquare.x - screenWidth * 0.1; // Keep the square on the left part of the screen
    
        // Move all vines to the left
        for (const vine of this.vines) {
            vine.anchorX -= offset;
        }
    
        // Move the red square to the left part of the screen
        this.redSquare.x = screenWidth * 0.1;
    
        // Generate a new vine on the right
        this.createNewVine(screenWidth - offset);
    }

    createNewVine(xPosition) {
        const screenHeight = this.app.screen.height;
    
        // Random vine length (proportional to screen height, ensuring it ends before bottom)
        const length = screenHeight * (0.5 + Math.random() * 0.3);
    
        const vineGraphics = new PIXI.Graphics();
    
        // Vine properties
        const vine = {
            graphics: vineGraphics,
            anchorX: xPosition,
            anchorY: 0,
            length: length,
            angle: Math.PI / 4 * Math.random(), // Random starting angle
            angleVelocity: 0,
            angleAcceleration: 0,
            damping: 0.995, // Increased damping for significantly slower swinging
            gravity: 0.01 * (1 + Math.random() * 0.1) // Further reduced gravity for wider swinging
        };
    
        // Style the vine line
        vineGraphics.lineStyle({
            width: 4,
            color: 0x008000,  // Dark green color
            alpha: 1
        });
    
        // Add the vine graphics to the stage
        this.app.stage.addChild(vineGraphics);
        this.vines.push(vine);
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
  
// Initialize the vine simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VineSimulator();
});
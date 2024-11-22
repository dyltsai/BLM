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
    }
  
    animateVines() {
        this.vines.forEach(vine => {
            // Calculate pendulum physics
            vine.angleAcceleration = -vine.gravity * Math.sin(vine.angle) * 0.5;
            vine.angleVelocity += vine.angleAcceleration;
            vine.angleVelocity *= vine.damping;
            vine.angle += vine.angleVelocity;
  
            // Clear and redraw the vine
            vine.graphics.clear();
            vine.graphics.lineStyle({
                width: 4,
                color: 0x008000,
                alpha: 1
            });
  
            // Calculate end point of the vine using trigonometry
            const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
            const endY = vine.anchorY + vine.length * Math.cos(vine.angle);
  
            // Draw the swinging vine
            vine.graphics.moveTo(vine.anchorX, vine.anchorY);
            vine.graphics.lineTo(endX, endY);
        });
    }

    animateRedSquare() {
        // Move the red square left to right
        this.redSquare.x += this.redSquareVelocity;
  
        // Bounce back when reaching the edges of the screen
        if (this.redSquare.x <= 0 || this.redSquare.x + 50 >= this.app.screen.width) {
            this.redSquareVelocity *= -1;
        }

        // Check for collision with vines
        this.vines.forEach(vine => {
            const endX = vine.anchorX + vine.length * Math.sin(vine.angle);
            const endY = vine.anchorY + vine.length * Math.cos(vine.angle);
            if (this.checkCollision(this.redSquare, endX, endY)) {
                this.redSquareVelocity = 0;
            }
        });
    }

    checkCollision(square, vineEndX, vineEndY) {
        const squareLeft = square.x;
        const squareRight = square.x + 50;
        const squareTop = square.y;
        const squareBottom = square.y + 50;

        return (
            vineEndX >= squareLeft &&
            vineEndX <= squareRight &&
            vineEndY >= squareTop &&
            vineEndY <= squareBottom
        );
    }
}
  
// Initialize the vine simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VineSimulator();
});
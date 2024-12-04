class GameManager {
    constructor(width = 800, height = 600) {
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xffffff,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        // Initialize the vine system and monkey
        this.vines = [];
        this.monkey = new Monkey(this.app);

        // Create vines
        this.createVines();

        // Animate vines and red square
        this.app.ticker.add(this.animate.bind(this));

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
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
            const vine = new Vine(xPositions[i], lengths[i], Math.PI / 4 * (i + 1) / 2, 0.2 * (1 + i * 0.1));
            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
        }
    }

    animate() {
        // Update vines and monkey
        for (const vine of this.vines) {
            vine.update();
        }

        this.monkey.animate(this.vines);
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            // Start moving the red square again if it has stopped
            if (this.monkey.redSquareVelocity === 0 && this.monkey.attachedVine) {
                const vine = this.monkey.attachedVine;
                this.monkey.jumpVelocityX = 5 * Math.cos(vine.angle); // Adjust the multiplier for desired speed
                this.monkey.jumpVelocityY = -15 * Math.sin(vine.angle); // Adjust the multiplier for desired speed
                this.monkey.attachedVine = null;
            } else if (this.monkey.redSquareVelocity === 0) {
                this.monkey.redSquareVelocity = 2;
            }
        }
    }
}

// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});
class GameManager {
    constructor(width = 800, height = 600) {
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xffffff,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        // Initialize score
        this.score = 0;
        this.scoreText = new PIXI.Text('Score: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x000000
        });
        this.scoreText.x = this.app.screen.width - 120;
        this.scoreText.y = 20;
        this.app.stage.addChild(this.scoreText);

        // Initialize the vine system and monkey
        this.vines = [];
        this.monkey = new Monkey(this.app);
        this.lastVineIndex = -1; // Track the last vine the monkey was on

        // Create vines
        this.createVines();

        // Animate vines and monkey
        this.app.ticker.add(this.animate.bind(this));

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    createVines() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        const lengths = [
            screenHeight * 0.6,
            screenHeight * 0.75,
            screenHeight * 0.5
        ];

        const xPositions = [
            screenWidth * 0.25,
            screenWidth * 0.5,
            screenWidth * 0.75
        ];

        const baseAngle = 6;
        const baseAmplitude = 1;
        const baseSpeed = Math.PI;

        for (let i = 0; i < 3; i++) {
            const randomAmplitude = baseAmplitude * (1 + (Math.random() * 0.3 - 0.15));
            const randomSpeed = baseSpeed * (1 + (Math.random() * 0.3 - 0.15));

            const vine = new Vine(xPositions[i], lengths[i], baseAngle);
            vine.swingAmplitude = randomAmplitude;
            vine.swingSpeed = randomSpeed;

            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
        }
        this.monkey.initializeWithVine(this.vines[0]);
 
    }

    animate() {
        // Update vines and monkey
        for (const vine of this.vines) {
            vine.update();
        }

        this.monkey.animate(this.vines);

        // Check for score updates
        if (this.monkey.attachedVine) {
            const currentVineIndex = this.vines.indexOf(this.monkey.attachedVine);
            if (currentVineIndex !== this.lastVineIndex && this.lastVineIndex !== -1) {
                this.score++;
                this.scoreText.text = `Score: ${this.score}`;
            }
            this.lastVineIndex = currentVineIndex;
        }
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            this.monkey.jump();
        }
    }
}

// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});
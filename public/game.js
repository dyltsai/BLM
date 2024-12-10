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
        this.scoreText.x = this.app.screen.width - 120; // Always relative to screen
        this.scoreText.y = 20; // Fixed Y position
        this.app.stage.addChild(this.scoreText);

        // Initialize the vine system and monkey
        this.vines = [];
        this.monkey = new Monkey(this.app);
        this.lastVineIndex = -1; // Track the last vine the monkey was on
        this.lastVineX = this.app.screen.width; // Track the position of the last generated vine


        // Create vines
        this.createVines();

        // Animate vines and monkey
        this.app.ticker.add(this.animate.bind(this));

        // Input tracking
        this.keys = {}; // Tracks key press state
        this.scrollSpeed = 5; // Scroll speed for testing

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
        if (this.isGameOver) return;
    
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
    
        // Automatic scrolling if the monkey jumps
        const monkeyRightEdge = this.monkey.redSquare.x + 50; // Right side of the monkey
        const leftBoundary = this.app.screen.width * 0.70; // Target area for the monkey (left 50% of the screen)
    
        if (monkeyRightEdge > leftBoundary) {
            const scrollAmount = monkeyRightEdge - leftBoundary;
            this.scrollLeft(-scrollAmount); 
        }

        this.generateNewVines();
    
        // Keep score fixed at the top right of the screen
        this.scoreText.x = this.app.screen.width - 120; // Always relative to screen
        this.scoreText.y = 20; // Fixed Y position
    
        // Check if the monkey has hit the ground
        if (this.monkey.redSquare.y + 50 >= this.app.screen.height) {
            this.endGame();
        }
    }

    generateNewVines() {
        const screenWidth = this.app.screen.width;
        const buffer = 100;

        if (this.lastVineX < screenWidth + buffer) {
            const x = this.lastVineX + Math.random() * 200 + 200; 
            const length = this.app.screen.height * 0.5 + Math.random() * 100 - 50;
            const angle = (Math.random() * 20 - 10) * (Math.PI / 180);
            const vine = new Vine(x, length, angle);
            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
            this.lastVineX = x;
        }

        // Remove old vines that are far off-screen
        this.vines = this.vines.filter(vine => {
            if (vine.anchorX + vine.length < -100) {
                vine.graphics.destroy();
                return false;
            }
            return true;
        });
    }
    

    handleKeyDown(event) {
        this.keys[event.key] = true;
        if (event.key === ' ') {
            this.monkey.jump();
        }
    }

    endGame() {
        this.isGameOver = true;

        // Display Game Over Text
        const gameOverText = new PIXI.Text('Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xff0000,
            align: 'center'
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = this.app.screen.width / 2;
        gameOverText.y = this.app.screen.height / 2 - 50;
        this.app.stage.addChild(gameOverText);

        // Display Replay Button
        const replayButton = document.createElement('button');
        replayButton.innerText = 'Replay';
        replayButton.style.position = 'absolute';
        replayButton.style.left = `${this.app.screen.width / 2 - 50}px`;
        replayButton.style.top = `${this.app.screen.height / 2 + 10}px`;
        replayButton.style.padding = '10px 20px';
        replayButton.style.fontSize = '16px';
        document.body.appendChild(replayButton);

        replayButton.addEventListener('click', () => {
            document.body.removeChild(replayButton);
            location.reload();
        });
    }
}


// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});
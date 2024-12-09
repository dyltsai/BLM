class GameManager {
    constructor(width = 800, height = 600) {
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0xffffff,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        // Game over state
        this.isGameOver = false;

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

        // Check if the monkey has hit the ground
        if (this.monkey.redSquare.y + 50 >= this.app.screen.height) {
            this.endGame();
        }

    
    }

    handleKeyDown(event) {
        if (event.code === 'Space' && !this.isGameOver) {
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
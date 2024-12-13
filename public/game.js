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
        this.cameraOffsetX = 0; // Horizontal scroll offset


        // Create vines
        this.createVines();

        // Animate vines and monkey
        this.app.ticker.add(this.animate.bind(this));

        // Input tracking
        this.keys = {}; // Tracks key press state
        this.scrollSpeed = 5; // Scroll speed for testing

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
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
        // Inside the GameManager's animate() method

        // Update vines and monkey (apply camera offset)
        for (const vine of this.vines) {
            vine.update(this.cameraOffsetX);
        }
    
        this.monkey.animate(this.vines, this.cameraOffsetX);
    
        // Check for score updates
        if (this.monkey.attachedVine) {
            const currentVineIndex = this.vines.indexOf(this.monkey.attachedVine);
            if (currentVineIndex !== this.lastVineIndex && this.lastVineIndex !== -1) {
                this.score++;
                this.scoreText.text = `Score: ${this.score}`;
            }
            this.lastVineIndex = currentVineIndex;
        }
    
        // Handle left and right scrolling (adjust for camera offset)
        if (this.keys['d']) {
            this.scrollRight();
        }
        if (this.keys['a']) {
            this.scrollLeft();
        }
        // Collision check: if the monkey hits the bottom of the screen
    if (this.monkey.redSquare.y + 50 >= this.app.screen.height) {
        this.endGame(); // End the game when the red square hits the bottom
    }
    }
    

    scrollRight() {
        this.cameraOffsetX -= this.scrollSpeed;
        this.generateNewVines(); // Adjust vine generation based on new camera offset
    }
    
    scrollLeft(scrollAmount) {
        // Move all game objects to the right to simulate scrolling left
        this.app.stage.children.forEach(child => {
            if (child !== this.scoreText) { // Don't move the score text
                child.x += scrollAmount;
            }
        });
    
        // Adjust the camera's offset to simulate moving the screen left
        this.cameraOffsetX -= scrollAmount;
    }
    
    
    generateNewVines() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
    
        // Calculate the average distance between existing vines
        const vineCount = this.vines.length;
        if (vineCount < 2) return;
    
        const lastVine = this.vines[vineCount - 1];
        const secondLastVine = this.vines[vineCount - 2];
        const averageDistance = lastVine.graphics.x - secondLastVine.graphics.x;
    
        // Check if we need to generate new vines
        if (lastVine.graphics.x + this.cameraOffsetX < screenWidth && this.canGenerateVines) {
            const lengths = [
                screenHeight * 0.6,
                screenHeight * 0.75,
                screenHeight * 0.5
            ];
    
            const baseAngle = 6;
            const baseAmplitude = 1;
            const baseSpeed = Math.PI;
    
            const randomAmplitude = baseAmplitude * (1 + (Math.random() * 0.3 - 0.15));
            const randomSpeed = baseSpeed * (1 + (Math.random() * 0.3 - 0.15));
    
            // Generate new vine starting after the last vine
            const vine = new Vine(lastVine.graphics.x + averageDistance, lengths[Math.floor(Math.random() * lengths.length)], baseAngle);
            vine.swingAmplitude = randomAmplitude;
            vine.swingSpeed = randomSpeed;
    
            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
    
            // Prevent further vine generation until the next frame
            this.canGenerateVines = false;
            setTimeout(() => {
                this.canGenerateVines = true;
            }, 100); // Adjust the delay as needed
        }
    }
    
    

    handleKeyDown(event) {
        this.keys[event.key] = true;
        if (event.key === ' ') {
            this.monkey.jump();
        }
    }

    handleKeyUp(event) {
        this.keys[event.key] = false;
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
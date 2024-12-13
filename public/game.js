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
    
        // Vine settings (lengths, etc.)
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
    
        // We'll generate 6 vines initially
        const totalVinesToGenerate = 6;
    
        for (let i = 0; i < totalVinesToGenerate; i++) {
            const randomAmplitude = baseAmplitude * (1 + (Math.random() * 0.3 - 0.15));
            const randomSpeed = baseSpeed * (1 + (Math.random() * 0.3 - 0.15));
    
            // Calculate X position for each vine, spaced out evenly
            const xPosition = (screenWidth / (totalVinesToGenerate + 1)) * (i + 1);
    
            // Randomly pick vine length
            const length = lengths[Math.floor(Math.random() * lengths.length)];
    
            const vine = new Vine(xPosition, length, baseAngle);
            vine.swingAmplitude = randomAmplitude;
            vine.swingSpeed = randomSpeed;
    
            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
        }
    
        // Initialize monkey with the first vine
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
    
    scrollLeft() {
        this.cameraOffsetX += this.scrollSpeed;
    }
    
    
    generateNewVines() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
    
        // Get the x position of the rightmost vine
        const lastVine = this.vines[this.vines.length - 1];
    
        // Calculate the new vine's x position (right of the last vine)
        const newVineX = lastVine.graphics.x + lastVine.graphics.width + 150;  // Adjust '150' as needed for spacing
    
        // Only generate a new vine if the rightmost vine has passed the screen edge
        if (newVineX > screenWidth) {
            // Vine length and other properties
            const lengths = [
                screenHeight * 0.6,
                screenHeight * 0.75,
                screenHeight * 0.5
            ];
    
            const baseAngle = 6;
            const baseAmplitude = 1;
            const baseSpeed = Math.PI;
    
            // Randomize swing amplitude and speed
            const randomAmplitude = baseAmplitude * (1 + (Math.random() * 0.3 - 0.15));
            const randomSpeed = baseSpeed * (1 + (Math.random() * 0.3 - 0.15));
    
            // Create new vine and add to the stage
            const vine = new Vine(newVineX, lengths[Math.floor(Math.random() * lengths.length)], baseAngle);
            vine.swingAmplitude = randomAmplitude;
            vine.swingSpeed = randomSpeed;
    
            this.vines.push(vine);
            this.app.stage.addChild(vine.graphics);
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
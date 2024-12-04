class GameManager {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xffffff,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        this.vines = [];
        this.createVines();
        this.monkey = new Monkey(this.app);
        this.lastAttachedVine = null;
        this.gravity = 0.5;
        this.jumpVelocityX = 5;
        this.jumpVelocityY = -15;

        this.app.ticker.add(this.animate.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    createVines() {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        const lengths = [screenHeight * 0.6, screenHeight * 0.75, screenHeight * 0.5];
        const xPositions = [screenWidth * 0.25, screenWidth * 0.5, screenWidth * 0.75];

        for (let i = 0; i < 3; i++) {
            const vine = new Vine(xPositions[i], lengths[i], Math.PI / 4 * (i + 1) / 2, 0.2 * (1 + i * 0.1));
            this.app.stage.addChild(vine.graphics);
            this.vines.push(vine);
        }
    }

    animate() {
        for (const vine of this.vines) {
            vine.update();
        }
        this.monkey.animate();
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            if (this.monkey.redSquareVelocity === 0 && this.monkey.attachedVine) {
                const vine = this.monkey.attachedVine;
                this.monkey.jumpVelocityX = 5 * Math.cos(vine.angle);
                this.monkey.jumpVelocityY = -15 * Math.sin(vine.angle);
                this.monkey.attachedVine = null;
            } else if (this.monkey.redSquareVelocity === 0) {
                this.monkey.redSquareVelocity = 2;
            }
        }
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});

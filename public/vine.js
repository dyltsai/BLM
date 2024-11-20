// Vine Simulator
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

      // Create the initial vine line
      this.createVineLine();
  }

  createVineLine() {
      // Create a graphics object for drawing the vine
      const vineGraphics = new PIXI.Graphics();

      // Style the vine line
      vineGraphics.lineStyle({
          width: 4,
          color: 0x008000,  // Dark green color
          alpha: 1
      });

      // Draw a vertical line from top to bottom of the canvas
      vineGraphics.moveTo(this.app.screen.width / 2, 0);
      vineGraphics.lineTo(this.app.screen.width / 2, this.app.screen.height);

      // Add the vine graphics to the stage
      this.app.stage.addChild(vineGraphics);
  }
}

// Initialize the vine simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new VineSimulator();
});
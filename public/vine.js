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

      // Vine properties
      this.vines = [];
      this.createVines();

      // Animate vines
      this.app.ticker.add(this.animateVines.bind(this));
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
}

// Initialize the vine simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new VineSimulator();
});
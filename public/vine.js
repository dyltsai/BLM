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
      this.vineGraphics = new PIXI.Graphics();
      this.anchorX = this.app.screen.width / 2;
      this.anchorY = 0;
      this.vineLength = this.app.screen.height * 0.8;
      
      // Pendulum physics
      this.angle = Math.PI / 4; // Starting angle (45 degrees)
      this.angleVelocity = 0;
      this.angleAcceleration = 0;
      this.damping = 0.995; // Slight air resistance
      this.gravity = 0.2; // Gravity effect

      // Create and animate the vine
      this.createVineLine();
      this.app.ticker.add(this.animateVine.bind(this));
  }

  createVineLine() {
      // Clear previous graphics
      this.vineGraphics.clear();

      // Style the vine line
      this.vineGraphics.lineStyle({
          width: 4,
          color: 0x008000,  // Dark green color
          alpha: 1
      });

      // Add the vine graphics to the stage
      this.app.stage.addChild(this.vineGraphics);
  }

  animateVine() {
      // Calculate pendulum physics
      this.angleAcceleration = -this.gravity * Math.sin(this.angle) * 0.5;
      this.angleVelocity += this.angleAcceleration;
      this.angleVelocity *= this.damping;
      this.angle += this.angleVelocity;

      // Clear and redraw the vine
      this.vineGraphics.clear();
      this.vineGraphics.lineStyle({
          width: 4,
          color: 0x008000,
          alpha: 1
      });

      // Calculate end point of the vine using trigonometry
      const endX = this.anchorX + this.vineLength * Math.sin(this.angle);
      const endY = this.anchorY + this.vineLength * Math.cos(this.angle);

      // Draw the swinging vine
      this.vineGraphics.moveTo(this.anchorX, this.anchorY);
      this.vineGraphics.lineTo(endX, endY);
  }
}

// Initialize the vine simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new VineSimulator();
});
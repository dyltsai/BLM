class Vine {
    constructor(xPosition, length, angle, gravity) {
        this.graphics = new PIXI.Graphics();
        this.anchorX = xPosition;
        this.anchorY = 0;
        this.length = length;
        this.angle = angle;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.damping = 0.995;
        this.gravity = gravity;
    }

    update() {
        // Update the angle based on velocity and acceleration
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;

        // Apply damping to slow down the swinging
        this.angleVelocity *= this.damping;

        // Apply gravity to the vine's angle acceleration
        this.angleAcceleration = -this.gravity * Math.sin(this.angle);

        // Draw the vine
        this.graphics.clear();
        this.graphics.lineStyle({
            width: 4,
            color: 0x008000,  // Dark green color
            alpha: 1
        });
        this.graphics.moveTo(this.anchorX, this.anchorY);
        this.graphics.lineTo(
            this.anchorX + this.length * Math.sin(this.angle),
            this.anchorY + this.length * Math.cos(this.angle)
        );
    }
}
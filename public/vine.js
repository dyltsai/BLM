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
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;
        this.angleVelocity *= this.damping;
        this.angleAcceleration = -this.gravity * Math.sin(this.angle);

        this.graphics.clear();
        this.graphics.lineStyle({
            width: 4,
            color: 0x008000,
            alpha: 1
        });
        this.graphics.moveTo(this.anchorX, this.anchorY);
        this.graphics.lineTo(
            this.anchorX + this.length * Math.sin(this.angle),
            this.anchorY + this.length * Math.cos(this.angle)
        );
    }
}

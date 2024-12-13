class Vine {
    constructor(xPosition, length, angle, gravity) {
        this.graphics = new PIXI.Graphics();
        this.anchorX = xPosition;
        this.anchorY = 0;
        this.length = length;
        this.baseAngle = angle;
        this.swingAmplitude = Math.PI / 4;
        this.swingSpeed = Math.PI;
        this.time = Math.random() * Math.PI * 2; // Random starting phase
    }

    update(cameraOffsetX) {
        this.time += 0.016;
        this.angle = this.baseAngle +
            this.swingAmplitude * Math.sin(this.time * this.swingSpeed);
    
        this.graphics.clear();
        this.graphics.lineStyle({
            width: 4,
            color: 0x008000,
            alpha: 1
        });
        // Apply camera offset to vine rendering
        this.graphics.moveTo(this.anchorX + cameraOffsetX, this.anchorY); // Apply camera offset
        this.graphics.lineTo(
            this.anchorX + this.length * Math.sin(this.angle) + cameraOffsetX,
            this.anchorY + this.length * Math.cos(this.angle)
        );
    }
}
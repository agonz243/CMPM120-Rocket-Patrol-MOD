class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        // Move Spaceship left
        this.x -= this.moveSpeed;

        // If ship goes offscreen, wrap it back around
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}

class MiniSpaceship extends Spaceship {
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        this.points = pointValue * 2;
        this.moveSpeed = game.settings.spaceshipSpeed + 3;
    }
}
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// Define global variables for UI size
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
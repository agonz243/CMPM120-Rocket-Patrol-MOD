/*
*   Name: Aaron Gonzales
*   Project Title: Rocket Patrol Mod
*   Date: Apr 16th, 2022
*   Time to Complete: 6 hours
*
*
*   Point Breakdown:
*   Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
*   Implement mouse control for player movement and mouse click to fire (20)
*   Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
*   Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
*   Implement parallax scrolling (10)
*   Display the time remaining (in seconds) on the screen (10)
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// Define global variables for UI size
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
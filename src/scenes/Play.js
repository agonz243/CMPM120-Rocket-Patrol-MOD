class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('particle', './assets/particle.png')
        this.load.image('minispaceship', './assets/minispaceship.png')
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        if (game.settings.mode == 'easy') {
            this.p1Rocket = new MiniRocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        } else {
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        }

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // Initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // Add text to screen on creation
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER Flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.input.on('pointerdown', function (pointer) {
            if (game.settings.mode == 'easy') {
                console.log('down');
                this.p1Rocket.isFiring = true;
            }
        }, this);
    }


    update() {

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        // Reset to menu on ← press
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            // Move rocket
            this.p1Rocket.update();

            // Move spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions for ship 03
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);

            let randomVal = Phaser.Math.Between(1, 10);
            if (randomVal % 3 == 0) {
                this.ship03 = new MiniSpaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'minispaceship', 0, 10).setOrigin(0,0);
            } else if (this.ship03 instanceof MiniSpaceship) {
                this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
            }
        }

        // check collisions for ship 02
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);

            let randomVal = Phaser.Math.Between(1, 10);
            if (randomVal % 3 == 0) {
                this.ship02 = new MiniSpaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'minispaceship', 0, 20).setOrigin(0,0);
            } else if (this.ship02 instanceof MiniSpaceship) {
                this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'minispaceship', 0, 20).setOrigin(0,0);
            }
        }

        // check collisions for ship 01
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);

            let randomVal = Phaser.Math.Between(1, 10);
            if (randomVal % 3 == 0) {
                this.ship01 = new MiniSpaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'minispaceship', 0, 30).setOrigin(0, 0);
            } else if (this.ship01 instanceof MiniSpaceship) {
                this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
            }
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again  
          boom.destroy();                       // remove explosion sprite
        });  
        
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.showParticles(ship);
        this.sound.play('sfx_explosion');
      }

    showParticles(ship) {
        let particles = this.add.particles('particle');

        let emitter = particles.createEmitter({
            x: ship.x,
            y: ship.y,
            angle: { min: 0, max: 360 },
            speed: 400,
            gravityY: 350,
            lifespan: 1000,
            quantity: 6,
            scale: { start: 0.1, end: 2 },
            blendMode: 'ADD'
        });

        this.clock = this.time.delayedCall(200, () => {
            particles.destroy();
        }, null, this);
    }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let player;
let cursors;
let tokens;
let obstacles;
let score = 0;
let scoreText;

let ground;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/character.png');
  this.load.image('obstacle', 'assets/obstacle.png');
  this.load.image('token', 'assets/token.png');
  this.load.image('ground', 'assets/ground.png'); // Ground asset
}

function create() {
  // Background
  this.add.image(400, 200, 'background').setScrollFactor(1, 0);

  // Ground
  ground = this.physics.add.staticGroup();
  ground.create(400, 390, 'ground').setScale(2).refreshBody();

  // Player
  player = this.physics.add.sprite(100, 300, 'player').setScale(0.5);
  player.setCollideWorldBounds(true);

  // Obstacles
  obstacles = this.physics.add.group();
  this.time.addEvent({
    delay: 2000,
    loop: true,
    callback: () => {
      const obstacle = obstacles.create(800, 350, 'obstacle');
      obstacle.setVelocityX(-200);
      obstacle.body.setAllowGravity(false); // Prevent gravity
    },
  });

  // Tokens
  tokens = this.physics.add.group();
  this.time.addEvent({
    delay: 3000,
    loop: true,
    callback: () => {
      const token = tokens.create(800, Phaser.Math.Between(200, 350), 'token');
      token.setVelocityX(-200);
      token.body.setAllowGravity(false); // Prevent gravity
    },
  });

  // Collisions
  this.physics.add.collider(player, ground);
  this.physics.add.collider(obstacles, ground);
  this.physics.add.collider(tokens, ground);

  // Score
  scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-300);
  }
}


function collectToken(player, token) {
  token.destroy();
  score += 10;
  scoreText.setText(`Score: ${score}`);
}

function gameOver() {
  this.scene.restart();
  score = 0;
}

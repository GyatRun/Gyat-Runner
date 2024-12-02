
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

function preload() {
  this.load.image('background', 'https://via.placeholder.com/800x400');
  this.load.image('player', 'https://via.placeholder.com/100');
  this.load.image('obstacle', 'https://via.placeholder.com/50x50');
  this.load.image('token', 'https://via.placeholder.com/25x25');
}

function create() {
  // Background
  this.add.image(400, 200, 'background').setScrollFactor(1, 0);

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
    },
  });

  // Score
  scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

  // Collisions
  this.physics.add.collider(player, obstacles, gameOver, null, this);
  this.physics.add.overlap(player, tokens, collectToken, null, this);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();
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

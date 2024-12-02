const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, // Gravity for the game world
      debug: false,        // Turn this to true to see hitboxes for debugging
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Initialize the game
const game = new Phaser.Game(config);

let player;
let cursors;
let ground;
let obstacles;
let tokens;
let score = 0;
let scoreText;

function preload() {
  // Load assets
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/character.png');
  this.load.image('obstacle', 'assets/obstacle.png');
  this.load.image('token', 'assets/token.png');
  this.load.image('ground', 'assets/ground.png'); // Add a ground image
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

  // Input Controls
  cursors = this.input.keyboard.createCursorKeys();

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
  this.physics.add.collider(player, ground); // Player collides with ground
  this.physics.add.collider(obstacles, ground); // Obstacles stop on the ground
  this.physics.add.collider(tokens, ground); // Tokens stop on the ground

  // Score
  scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
  // Reset horizontal velocity
  player.setVelocityX(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-160); // Move left
    player.flipX = true; // Flip sprite to face left
  } else if (cursors.right.isDown) {
    player.setVelocityX(160); // Move right
    player.flipX = false; // Face right
  }

  // Jumping
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-300); // Jump
  }
}

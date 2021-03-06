// 'use strict' is helpful because it forces you to write better code by preventing functions
// with bad syntax from executing and requiring you to declare a variable before using it.
'use strict';

// rowImage size
const rowImX = 101;
const rowImY = 83;

// Player's start Position
const startPositionX = rowImX * 2;
const startPositionY = rowImY * 5 - 20;

// Min and Max player's movements on canvas
const playerMaxX = rowImX * 4;
const playerMinX = 0;
const playerMaxY = rowImY * 5 - 20;
const playerMinY = 20;

// Enemies our player must avoid
// Enemy declaration, consists of position(x,y), speed
let Enemy = function (posX, posY, speed) {
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.posX += this.speed * dt;

    // Enemy starts again from the left in random position and speed
    if (this.posX > playerMaxX + rowImX) {
        this.posX = -rowImX;
        this.posY = rowImY * (Math.floor(Math.random() * 3) + 1) - 20;
        this.speed = Math.random() * 100 + 10;
    }

    //Check collision between player and enemy
    checkCollisionWithPlayer(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Holds all available player avatar
const playerSprite = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
let Player = function (posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.sprite = playerSprite[Math.floor(Math.random() * 5)];
};

Player.prototype.update = function () {
    //If players reach the water (MinY position) will return to the start position
    if (this.posY <= playerMinY) {
        allEnemies.splice(2,4);
        addStones();
        this.posX = startPositionX;
        this.posY = startPositionY;
        this.sprite = playerSprite[Math.floor(Math.random() * 5)];
    }
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
};

Player.prototype.handleInput = function (keyPress) {
    if (keyPress == 'left' && this.posX > playerMinX) {
        this.posX = this.posX - rowImX;
    }
    if (keyPress == 'up' && this.posY > playerMinY) {
        this.posY = this.posY - rowImY;
    }
    if (keyPress == 'right' && this.posX < playerMaxX) {
        this.posX = this.posX + rowImX;
    }
    if (keyPress == 'down' && this.posY < playerMaxY) {
        this.posY = this.posY + rowImY;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player(startPositionX, startPositionY);
const allEnemies = [];
for (var i = 0; i < 3; i++) {
    // the enemy will appear only on stone-block (on Y-axis is position 0-1-2 out of 5)
    // Math.floor(Math.random() * 3 -> reproduces numbers 0,1,2
    let enemy = new Enemy(-rowImX, rowImY * (Math.floor(Math.random() * 3) + 1) - 20, Math.random() * 100);
    allEnemies.push(enemy);
}
addStones();

// Add stone enemy
function addStones(){
    for (var i = 0; i < 2; i++) {
        let stone = new Enemy(rowImX * (Math.floor(Math.random() * 4)),rowImY * 4 - 20, 0);
        stone.sprite = 'images/Rock.png';
        allEnemies.push(stone);
    }
}

// Method to check collision between player and enemy
function checkCollisionWithPlayer(enemy){
    if (player.posX >= enemy.posX - 70 && player.posX <= enemy.posX + 70) {
        if (player.posY >= enemy.posY - 70 && player.posY <= enemy.posY + 70) {
            allEnemies.splice(2,4);
            addStones();
            player.posX = startPositionX;
            player.posY = startPositionY;
            player.sprite = playerSprite[Math.floor(Math.random() * 5)];
        }
    }
}

// instruction div
let instructionDiv = document.createElement('div');
instructionDiv.setAttribute('class', 'instructions');
instructionDiv.innerHTML = '<h2>Game Instructions</h2>' +
    '<ol>' +
    '<li>Use the arrows <img src="images/keys.png"> in order to move your player!</li>' +
    '<li>Avoid rocks, bugs and water!</li>' +
    '<li>Have fun!</li>' +
    '</ol>';
document.body.appendChild(instructionDiv);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
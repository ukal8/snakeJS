/*
* ---------------------------------------------------------
*   Variables
* ---------------------------------------------------------
*/
var snake,
    ctx,
    screenWidth,
    screenHeight,
    snakeLength,
    snakeSize,
    food,
    snakeDirection,
    gameState,
    gameOver,
    restartButton,
    score;

/*
 * ---------------------------------------------------------
 *   Game initialize
 * ---------------------------------------------------------
 */
gameInit();
snakeInit();
foodInit();
setInterval(gameLoop, 50);


/*
 * ---------------------------------------------------------
 *   Game functions
 * ---------------------------------------------------------
 */
function gameInit() {
  var canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  canvas.width = screenWidth;
  canvas.height = screenHeight;

  document.addEventListener('keydown', keyboardKeys);

  gameOver = document.getElementById('game-over');
  restartButton = document.getElementById('restart');
  restartButton.addEventListener('click', gameRestart);
  score = document.getElementById('score');

  setState('PLAY');
}

function gameLoop() {
  gameDraw();
  if (gameState == 'PLAY') {
    snakeUpdate();
    snakeDraw();
    foodDraw();
  } else if (gameState == 'GAME OVER') {
      displayBlock(gameOver);
      score.innerHTML = snakeLength;
  }
}

function gameDraw() {
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, screenWidth, screenHeight);
}

function gameRestart() {
  snakeInit();
  foodInit();
  setState('PLAY');
  gameOver.style.display = 'none';
}

/*
 * ---------------------------------------------------------
 *   Snake functions
 * ---------------------------------------------------------
 */
function snakeInit() {
  snake = [];
  snakeLength = 3;
  snakeSize = 15;
  snakeDirection = 'right';
  for (var i = snakeLength - 1; i >= 0; i--) {
    snake.push({
      x: i,
      y: 0
    });
  }
}

function snakeDraw() {
  for (var i = 0; i < snake.length; i++) {
    ctx.fillStyle = 'black';
    ctx.fillRect(snake[i].x * snakeSize, snake[i].y * snakeSize, snakeSize, snakeSize);
  }
}

function snakeUpdate() {
  var snakeHeadX = snake[0].x;
  var snakeHeadY = snake[0].y;

  if (snakeDirection == 'down') {
    snakeHeadY++;
  } else if (snakeDirection == 'right') {
    snakeHeadX++;
  } else if (snakeDirection == 'up') {
    snakeHeadY--;
  } else if (snakeDirection == 'left') {
    snakeHeadX--;
  }

  var snakeTail = snake.pop();
  snakeTail.x = snakeHeadX;
  snakeTail.y = snakeHeadY;
  snake.unshift(snakeTail);

  foodCollision(snakeHeadX, snakeHeadY);
  wallCollision(snakeHeadX, snakeHeadY);
  snakeCollision(snakeHeadX, snakeHeadY);
}

/*
 * ---------------------------------------------------------
 *   Food functions
 * ---------------------------------------------------------
 */
function foodInit() {
  food = {
    x: 0,
    y: 0
  };
  setFoodPosition();
}

function foodDraw() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
  var randomX = Math.floor(Math.random() * screenWidth);
  var randomY = Math.floor(Math.random() * screenHeight);
  food.x = Math.floor(randomX / snakeSize);
  food.y = Math.floor(randomY / snakeSize);
}

/*
 * ---------------------------------------------------------
 *   Keyboard Events
 * ---------------------------------------------------------
 */
function keyboardKeys(event) {
  if (event.keyCode == 37 && snakeDirection != 'right') {
    snakeDirection = 'left';
  } else if (event.keyCode == 38 && snakeDirection != 'down') {
    snakeDirection = 'up';
  } else if (event.keyCode == 39 && snakeDirection != 'left') {
    snakeDirection = 'right';
  } else if (event.keyCode == 40 && snakeDirection != 'up') {
    snakeDirection = 'down';
  }
}

/*
 * ---------------------------------------------------------
 *   Collisions
 * ---------------------------------------------------------
 */
function foodCollision(snakeHeadX, snakeHeadY) {
  if (snakeHeadX == food.x && snakeHeadY == food.y) {
    snake.push({});
    snakeLength++;
    setFoodPosition();
  }
}

function wallCollision(snakeHeadX, snakeHeadY) {
  if (snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX * snakeSize > screenWidth || snakeHeadY * snakeSize > screenHeight) {
    setState('GAME OVER');
  }
}

function snakeCollision(snakeHeadX, snakeHeadY) {
  for (var i = 1; i < snake.length; i++) {
    if (snakeHeadX == snake[i].x && snakeHeadY == snake[i].y) {
      setState('GAME OVER');
    }
  }
}

/*
 * ---------------------------------------------------------
 *   Game states
 * ---------------------------------------------------------
 */
function setState(state) {
  gameState = state;
}

function displayBlock(block) {
  block.style.display = 'block';
}

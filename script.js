const board = document.querySelector(".board");
const instructionText = document.querySelector(".instruction");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#highScore");
const snakeBox = document.querySelector('.snake'); 
const foodBox = document.querySelector('.food');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let gameInterval;
let gameSpeed = 200;
let gameStarted = false;
let highScore = 0;

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = createGameElement("food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function createGameElement(className) {
  const element = document.createElement("div");
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "left":
      head.x--;
      break;
    case "down":
      head.y++;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  if (head.x == food.x && head.y == food.y) {
    updateScore();
    food = generateFood();
    gameSpeed -= 5;
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeed);
  } else snake.pop();
}

function startGame() {
  updateHighScore();
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
    draw();
    checkCollision();
  }, gameSpeed);
}
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) resetGame();
  }
}
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeed = 200;
  updateScore();
}
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  console.log(currentScore), highScore;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

function handleKeyPress(e) {
  if (gameStarted != true && e.key == " ") {
    startGame();
  }
  if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") {
    if (direction == "down") return;
    direction = "up";
  } else if (e.key == "a" || e.key == "A" || e.key == "ArrowLeft") {
    if (direction == "right") return;
    direction = "left";
  } else if (e.key == "s" || e.key == "S" || e.key == "ArrowDown") {
    if (direction == "up") return;
    direction = "down";
  } else if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") {
    if (direction == "left") return;
    direction = "right";
  }
}

window.addEventListener("keydown", handleKeyPress);

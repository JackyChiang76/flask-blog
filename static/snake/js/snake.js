const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
let count = 0;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = {
  x: 320,
  y: 320
};

let score = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function appleOnSnake(x, y) {
  return snake.cells.some(cell => cell.x === x && cell.y === y);
}

function resetApple() {
  let x, y
  do {
    x = getRandomInt(0, 30) * grid;
    y = getRandomInt(0, 30) * grid;
  } while (appleOnSnake(x, y))

  apple.x = x
  apple.y = y
}

function loop() {

  requestAnimationFrame(loop);

  if (++count < 4) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // WALL COLLISION (Game Over)
  if (
    snake.x < 0 ||
    snake.x >= canvas.width ||
    snake.y < 0 ||
    snake.y >= canvas.height
  ) {
    gameOver();
    return;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw Apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw Snake
  ctx.fillStyle = "lime";

  snake.cells.forEach(function (cell, index) {

    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Apple collision
    if (cell.x === apple.x && cell.y === apple.y) {

      snake.maxCells++;
      score++;

      document.getElementById("score").innerText = score;

      resetApple();
    }

    // Self collision
    for (let i = index + 1; i < snake.cells.length; i++) {

      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
      }

    }

  });

}

function gameOver() {

  submitScore();
  alert("Game Over! Score: " + score);
  restartGame();

}

document.addEventListener("keydown", function (e) {

  if (e.key === "ArrowLeft" && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }

  else if (e.key === "ArrowUp" && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }

  else if (e.key === "ArrowRight" && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }

  else if (e.key === "ArrowDown" && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }

});

function submitScore(){

//fetch("/submit_score",{
fetch(canvas.dataset.submitUrl,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({score:score})
})
.then(res=>res.json())
.then(data=>{
document.getElementById("highscore").innerText = data.highscore;
})

}

function restartGame(){

snake.x = 160;
snake.y = 160;
snake.cells = [];
snake.maxCells = 4;
snake.dx = grid;
snake.dy = 0;

score = 0;

resetApple();

document.getElementById("score").innerText = score;

}

resetApple();
requestAnimationFrame(loop);

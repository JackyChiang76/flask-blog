const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restart-btn");

const grid = 20;

// 每移動一格的時間（毫秒）。用時間戳計算，速度不受螢幕更新率影響。
// 67ms ≈ 原本 60Hz 螢幕上「每 4 frame 走一格」的速度。
const STEP_MS = 67;

// ---------- 遊戲狀態 ----------
const STATE = {
  READY: "ready",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover"
};

let state = STATE.READY;

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

// 方向佇列：最多暫存 2 個轉向，每格只取 1 個，防止同一格內快速反向
const MAX_QUEUE = 2;
let directionQueue = [];

// 開局時的最高分，用來判斷 New Record
let startHighscore = 0;
let isNewRecord = false;

// 時間戳 tick
let lastTime = null;
let accumulator = 0;

const DIRECTIONS = {
  ArrowLeft: { dx: -grid, dy: 0 },
  ArrowUp: { dx: 0, dy: -grid },
  ArrowRight: { dx: grid, dy: 0 },
  ArrowDown: { dx: 0, dy: grid }
};

// ---------- 工具函式 ----------
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function appleOnSnake(x, y) {
  return snake.cells.some(cell => cell.x === x && cell.y === y);
}

function resetApple() {
  let x, y;
  do {
    x = getRandomInt(0, canvas.width / grid) * grid;
    y = getRandomInt(0, canvas.height / grid) * grid;
  } while (appleOnSnake(x, y));

  apple.x = x;
  apple.y = y;
}

// 兩個方向是否在同一軸（相同或相反）
function sameAxis(a, b) {
  return (a.dx !== 0 && b.dx !== 0) || (a.dy !== 0 && b.dy !== 0);
}

function isOpposite(a, b) {
  return a.dx === -b.dx && a.dy === -b.dy;
}

function readHighscore() {
  const value = parseInt(highscoreEl.innerText, 10);
  return Number.isNaN(value) ? 0 : value;
}

// ---------- 狀態切換：所有轉換集中在這裡 ----------
function setState(next) {
  state = next;

  if (next === STATE.PLAYING) {
    // 從待機或暫停進入時重設時間，避免恢復瞬間連跳好幾格
    lastTime = null;
    accumulator = 0;
  }

  if (next === STATE.PAUSED) {
    directionQueue = [];
  }
}

function startGame(dir) {
  snake.dx = dir.dx;
  snake.dy = dir.dy;
  startHighscore = readHighscore();
  isNewRecord = false;
  setState(STATE.PLAYING);
}

function gameOver() {
  isNewRecord = score > startHighscore;
  setState(STATE.GAMEOVER);
  submitScore();
}

function restartGame() {
  snake.x = 160;
  snake.y = 160;
  snake.dx = grid;
  snake.dy = 0;
  snake.maxCells = 4;
  // 開局就畫出完整蛇身（頭在右、身體向左），待機時玩家看得到方向
  snake.cells = [];
  for (let i = 0; i < snake.maxCells; i++) {
    snake.cells.push({ x: snake.x - i * grid, y: snake.y });
  }

  directionQueue = [];
  score = 0;
  isNewRecord = false;
  scoreEl.innerText = score;

  resetApple();
  setState(STATE.READY);
}

// ---------- 遊戲更新：每個 tick 走一格 ----------
function step() {
  // 每格只套用一個排隊中的方向
  if (directionQueue.length > 0) {
    const next = directionQueue.shift();
    snake.dx = next.dx;
    snake.dy = next.dy;
  }

  snake.x += snake.dx;
  snake.y += snake.dy;

  // 撞牆
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

  // 吃到食物：只判斷蛇頭
  if (snake.x === apple.x && snake.y === apple.y) {
    snake.maxCells++;
    score++;
    scoreEl.innerText = score;
    resetApple();
  }

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // 撞到自己：只判斷蛇頭與其餘身體
  for (let i = 1; i < snake.cells.length; i++) {
    if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
      gameOver();
      return;
    }
  }
}

// ---------- 繪製 ----------
function drawOverlay(lines) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = 32;
  const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.font = line.main ? "bold 36px Arial" : "18px Arial";
    ctx.fillStyle = line.color || "white";
    ctx.fillText(line.text, canvas.width / 2, startY + i * lineHeight + (line.main ? -8 : 0));
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  ctx.fillStyle = "lime";
  snake.cells.forEach(cell => {
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
  });

  if (state === STATE.READY) {
    drawOverlay([
      { text: "Press an arrow key to start", main: true },
      { text: "Space / P to pause" }
    ]);
  } else if (state === STATE.PAUSED) {
    drawOverlay([
      { text: "Paused", main: true },
      { text: "Press Space to resume" }
    ]);
  } else if (state === STATE.GAMEOVER) {
    const lines = [
      { text: "Game Over", main: true },
      { text: "Score: " + score }
    ];
    if (isNewRecord) {
      lines.push({ text: "New Record!", color: "gold" });
    }
    lines.push({ text: "Press Enter to restart" });
    drawOverlay(lines);
  }
}

// ---------- 主迴圈：只有一條，從不重複啟動 ----------
function loop(now) {
  requestAnimationFrame(loop);

  if (state === STATE.PLAYING) {
    if (lastTime === null) lastTime = now;
    // 上限避免分頁卡頓後一次補跑太多格
    accumulator += Math.min(now - lastTime, 250);
    lastTime = now;

    while (accumulator >= STEP_MS && state === STATE.PLAYING) {
      step();
      accumulator -= STEP_MS;
    }
  }

  draw();
}

// ---------- 輸入 ----------
const GAME_KEYS = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " ", "p", "P", "Enter"];

document.addEventListener("keydown", function (e) {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) {
    return;
  }
  if (!GAME_KEYS.includes(e.key)) return;

  // 遊戲用到的鍵一律攔截，避免頁面捲動
  e.preventDefault();

  const dir = DIRECTIONS[e.key];

  switch (state) {
    case STATE.READY:
      // 與蛇身相反的方向會立即撞自己，忽略
      if (dir && !isOpposite(dir, snake)) startGame(dir);
      break;

    case STATE.PLAYING:
      if (dir) {
        const last = directionQueue.length > 0
          ? directionQueue[directionQueue.length - 1]
          : snake;
        // 只接受與「最後一個方向」垂直的轉向；佇列滿了就丟棄
        if (!sameAxis(dir, last) && directionQueue.length < MAX_QUEUE) {
          directionQueue.push(dir);
        }
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        setState(STATE.PAUSED);
      }
      break;

    case STATE.PAUSED:
      // 暫停時方向鍵一律忽略
      if (e.key === " " || e.key === "p" || e.key === "P") {
        setState(STATE.PLAYING);
      }
      break;

    case STATE.GAMEOVER:
      if (e.key === "Enter") restartGame();
      break;
  }
});

// 切到別的分頁自動暫停；回來時保持暫停，由玩家按鍵繼續
document.addEventListener("visibilitychange", function () {
  if (document.hidden && state === STATE.PLAYING) {
    setState(STATE.PAUSED);
  }
});

restartBtn.addEventListener("click", function () {
  restartGame();
  // 移除焦點，避免之後按 Space / Enter 再次觸發按鈕
  restartBtn.blur();
});

// ---------- 伺服器 ----------
function submitScore() {
  fetch(canvas.dataset.submitUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ score: score })
  })
    .then(res => res.json())
    .then(data => {
      if (data.highscore !== undefined) {
        highscoreEl.innerText = data.highscore;
      }
    })
    .catch(err => console.error("submitScore failed:", err));
}

// ---------- 啟動 ----------
restartGame();
requestAnimationFrame(loop);

"use strict";

////////////////////////////////////////////////////////////////////////////
// ----Global Variables----
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const playBtn = document.querySelector(".btn-play");
const scoreText = document.querySelector(".score");

canvas.width = canvas.height = 700;
const height = canvas.height / 20;
const width = canvas.width / 20;

let gameOn = false; // State Variable button/game state
let lost = false; // Keep track if the player have lost or not
let gameTick; // Game Timer (will be toggled on and off for pausing and ending/starting game)
let score = 0; // Keeping track with the score
let blocks = []; // Array of coordinates of snake
let prevDir = "up"; // Previous direction, prevent snake from going same direction at the same time
let apple; // Contains coordinates of the apple

// Direction State Variables
let up = true;
let down = false;
let left = false;
let right = false;

////////////////////////////////////////////////////////////////////////////
// ----Functions----

// Used the clear the board
function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Used to increase the length of the snake
function addBlock(xoff, yoff) {
  blocks.push([xoff, yoff, width, height]);
}

// Render the snake onto the canvas
function renderSnake(col = "#002e07") {
  ctx.fillStyle = col;
  blocks.forEach((b) => {
    ctx.fillRect(...b);
  });
  renderApple();
}

// Render the apple onto the canvas
function renderApple() {
  ctx.fillStyle = "darkred";
  ctx.fillRect(...apple);
}

// Move or turn the snake depending on the direction
function moveSnake() {
  clearBoard();

  // Guard clause
  if (prevDir === "up" && down) {
    down = false;
    up = true;
  }
  if (prevDir === "down" && up) {
    up = false;
    down = true;
  }
  if (prevDir === "left" && right) {
    right = false;
    left = true;
  }
  if (prevDir === "right" && left) {
    left = false;
    right = true;
  }

  // If snake is going up
  if (up) {
    let bl = blocks[0];
    blocks.pop();
    blocks.unshift([
      bl[0], // x-offset
      bl[1] - height, // y-offset
      bl[2], // block width
      bl[3], // block height
    ]);
    prevDir = "up";
  }

  // If snake is going down
  if (down) {
    let bl = blocks[0];
    blocks.pop();
    blocks.unshift([
      bl[0], // x-offset
      bl[1] + height, // y-offset
      bl[2], // block width
      bl[3], // block height
    ]);
    prevDir = "down";
  }

  // If snake is going left
  if (left) {
    let bl = blocks[0];
    blocks.pop();
    blocks.unshift([
      bl[0] - width, // x-offset
      bl[1], // y-offset
      bl[2], // block width
      bl[3], // block height
    ]);
    prevDir = "left";
  }

  if (right) {
    let bl = blocks[0];
    blocks.pop();
    blocks.unshift([
      bl[0] + width, // x-offset
      bl[1], // y-offset
      bl[2], // block width
      bl[3], // block height
    ]);
    prevDir = "right";
  }
}

// Generates a random coordinate that isn't a coordinate of the snake
function randCoord() {
  let coord;
  while (blocks.includes(coord) || !coord) {
    coord = Math.floor(Math.random() * 19 + 1) * 35;
  }
  return coord;
}

// Assigns the apple a new random coordinate
function genApple() {
  apple = [randCoord(), randCoord(), width, height];
}

// Checks whether an array is equal
function arrayEqual(a1, a2) {
  return JSON.stringify(a1) == JSON.stringify(a2);
}

// Increase length of snake if it ate an apple
function addLengthIfAteApple() {
  if (!blocks.some((block) => arrayEqual(apple, block))) return null;
  // Increase Score
  score++;
  scoreText.textContent = `Score: ${score}`;

  genApple();
  if (up) {
    blocks.push([
      blocks[0][0], // x-offset
      blocks[0][1] - height, // y-offset
      blocks[0][2], // block width
      blocks[0][3], // block height
    ]);
  }
  if (down) {
    blocks.push([
      blocks[0][0], // x-offset
      blocks[0][1] - height, // y-offset
      blocks[0][2], // block width
      blocks[0][3], // block height
    ]);
  }
  if (left) {
    blocks.push([
      blocks[0][0] - width, // x-offset
      blocks[0][1], // y-offset
      blocks[0][2], // block width
      blocks[0][3], // block height
    ]);
  }
  if (right) {
    blocks.push([
      blocks[0][0] + width, // x-offset
      blocks[0][1], // y-offset
      blocks[0][2], // block width
      blocks[0][3], // block height
    ]);
  }
}

// Checks if the player has lost
function checkLose() {
  // Check if snake enter itself
  const [head, ...body] = blocks;
  body.forEach((bl) => {
    if (arrayEqual(head, bl)) lost = true;
  });

  // Check if snake is outside of map
  if (
    blocks.some((bl) => {
      return (
        bl[0] < 0 ||
        bl[1] < 0 ||
        bl[0] > canvas.height - height ||
        bl[1] > canvas.height - height
      );
    })
  ) {
    lost = true;
  }
}

// Initialization Function
function init() {
  clearBoard();

  genApple();

  // Initial Position of Snake
  addBlock(350, 280);
  addBlock(350, 315);
  addBlock(350, 350);
  addBlock(350, 385);

  window.addEventListener("keydown", function (e) {
    if (!gameOn) return; // Check if game is on

    // Check if any other key other than arrow keys are pressed
    if (
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      // If so keep current direction
      p[prevDir] = true;
    } else {
      up = e.key === "ArrowUp" ? true : false;
      down = e.key === "ArrowDown" ? true : false;
      left = e.key === "ArrowLeft" ? true : false;
      right = e.key === "ArrowRight" ? true : false;
      // console.log(up, down, left, right);
    }
  });
}

// *Main Function that is going to be run every tick*
function main() {
  moveSnake();
  addLengthIfAteApple();
  renderSnake();
  checkLose();
  if (lost) {
    clearBoard();
    ctx.fillStyle = "black";
    ctx.font = "100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", 350, 370);
  }
}

////////////////////////////////////////////////////////////////////////////
// ----Building Main App----

playBtn.addEventListener("click", function () {
  if (gameOn) return;
  init();

  gameTick = setInterval(() => {
    main();

    // Remove play button
    playBtn.classList.add("hidden");
    scoreText.classList.remove("hidden");
    gameOn = true;
  }, 100);
});

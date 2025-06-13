document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const height = 20;
  const tetris = document.getElementById("tetris");
  const scoreDisplay = document.getElementById("score");
let dropSpeed = 1000;
let fastDropId = null;
  let timerId;
  let currentPosition = 0;
  let currentRotation = 0;
let score = 0;
// Crear celdas
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    tetris.appendChild(cell);
  }

  const cells = document.querySelectorAll("#tetris div");

  // Tetrominos
  const tetrominoes = {
    l: [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2],
    ],
    z: [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
    ],
    t: [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1],
    ],
    o: [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
    ],
    i: [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ],
  };

  const colors = {
    l: "l",
    z: "z",
    t: "t",
    o: "o",
    i: "i",
  };

  const tetrominoTypes = Object.keys(tetrominoes);
  let currentTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  let current = tetrominoes[currentTetrominoType][currentRotation];

  function draw() {
    current.forEach(index => {
      cells[currentPosition + index].classList.add("filled", colors[currentTetrominoType]);
    });
  }

  function undraw() {
    current.forEach(index => {
      cells[currentPosition + index].classList.remove("filled", colors[currentTetrominoType]);
    });
 }

  function collision() {
  return current.some((index) => {
    const pos = currentPosition + index;
    return (
      pos >= width * height || // toca el fondo
      cells[pos].classList.contains("taken") // toca otra ficha congelada
    );
  });
}

  

 function freeze() {
  current.forEach(index => {
    cells[currentPosition + index].classList.add("taken");
  });
  clearLines(); // limpia filas si están llenas
  newTetromino(); // empieza una nueva ficha
}


 function newTetromino() {
  currentPosition = 3;
  currentRotation = 0;
  currentTetrominoType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  current = tetrominoes[currentTetrominoType][currentRotation];

  if (collision()) {
    alert("¡Game Over!");
    clearInterval(timerId);
  } else {
    draw(); // ✅ Muy importante
  }
}


  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition--;
    if (collision()) currentPosition++;
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition++;
    if (collision()) currentPosition--;
    draw();
  }

  function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % tetrominoes[currentTetrominoType].length;
    current = tetrominoes[currentTetrominoType][currentRotation];
    if (collision()) {
      currentRotation = (currentRotation - 1 + tetrominoes[currentTetrominoType].length) % tetrominoes[currentTetrominoType].length;
      current = tetrominoes[currentTetrominoType][currentRotation];
    }
    draw();
  }

 function moveDown() {
  undraw();
  currentPosition += width;
  if (collision()) {
    currentPosition -= width;
    draw();
    freeze();
    return;
  }
  draw();
}

  function clearLines() {
    for (let row = 0; row < height; row++) {
      const rowIndices = [];
      for (let col = 0; col < width; col++) {
        rowIndices.push(row * width + col);
      }

      if (rowIndices.every(i => cells[i].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.textContent = score;

        rowIndices.forEach(i => {
          cells[i].classList.remove("taken", "filled", ...Object.values(colors));
          cells[i].className = "cell";
        });

        for (let i = row * width - 1; i >= 0; i--) {
          cells[i + width].className = cells[i].className;
        }

        for (let i = 0; i < width; i++) {
          cells[i].className = "cell";
        }
      }
    }
  }

 function control(e) {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    rotate();
  } else if (e.key === "ArrowDown") {
    if (!fastDropId) {
      clearInterval(timerId); // detener el intervalo lento
      fastDropId = setInterval(moveDown, 100); // velocidad rápida
    }
  }
}

function stopFastDrop(e) {
  if (e.key === "ArrowDown") {
    clearInterval(fastDropId);
    fastDropId = null;
    startDropInterval(); // volver a velocidad normal
  }
  document.addEventListener("keyup", stopFastDrop);

}
function startDropInterval() {
  clearInterval(timerId);
  timerId = setInterval(moveDown, dropSpeed);
}

startDropInterval();


document.addEventListener("keyup", stopFastDrop);

  document.addEventListener("keydown", control);


  draw();
  timerId = setInterval(moveDown, 1000);
});


let rows = 50;//Establish the numbers of rows
let cols = 50;//Establish the numbers of columns
let generation = 0;//Initial state
let playing = false;//Initial state
const generationCounter = document.getElementById("counter");
const startButton = document.getElementById("start");
const randomButton = document.getElementById("random");
const restartButton = document.getElementById("restart");
const clearButton = document.getElementById("clear");

let grid = new Array(rows);//Actual grid
let nextGrid = new Array(rows);//Next grid

let timer;
let reproductionTime = 200;//time between generations

//function to initializeGrids
function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

//function to reset grids
function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

//function to copy and reset grids
function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// Initialize
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

// Create the table
function createTable() {
  let gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    // Throw error
    console.error("ERROR THERE ARE NOT A GRID CONTAINER");
  }
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      //
      let cell = document.createElement("td");//creating all the cells
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);//making the hierarchy
  }
  gridContainer.appendChild(table);//making the hierarchy
}

//let the user choose the pattern
function cellClickHandler() {
  let rowcol = this.id.split("_");
  let row = rowcol[0];
  let col = rowcol[1];

  let classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

//update the view of the table and the generation count
function updateView() {
  generation++;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
  generationCounter.innerHTML = `Current generation: ${generation}`;
}

function setupControlButtons() {
  // Start button
  startButton.onclick = startButtonHandler;
  //Random button
  randomButton.onclick = randomButtonHandler;
  //Restart button
  restartButton.onclick = restartButtonHandler;
  //Clear button
  clearButton.onclick = clearButtonHandler;
}

//How the clear button works
function clearButtonHandler() {
  console.log("Game clear");
  let cellsList = document.getElementsByClassName("live");

  let cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids();
}

//how the restart button works
function restartButtonHandler() {
  clearButtonHandler();
  startButton.innerHTML = "Start";
  playing = false;
  generation = 0;
  generationCounter.innerHTML = "";
  clearTimeout(timer);
  initializeGrids();
}

//how the random button works
function randomButtonHandler() {
  if (!playing) {
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var isLive = Math.round(Math.random());
        if (isLive == 1) {
          var cell = document.getElementById(i + "_" + j);
          cell.setAttribute("class", "live");
          grid[i][j] = 1;
        }
      }
    }
  }
}

//start/pause/continue button handler
function startButtonHandler() {
  if (playing) {
    console.log("Game paused");
    playing = false;
    this.innerHTML = "Continue";
    clearTimeout(timer);
  } else {
    console.log("Continue");
    playing = true;
    this.innerHTML = "Pause";
    play();
  }
}

// run the life game
function play() {
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  // copy NextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  // copy all 1 values to "live" in the table
  updateView();
}

//the logic of the game rules
function applyRules(row, col) {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}

function countNeighbors(row, col) {
  let count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

// Start everything
window.onload = initialize;

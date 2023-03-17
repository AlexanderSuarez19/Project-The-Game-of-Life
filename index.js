let rows = 50; //Establish the numbers of rows
let cols = 50; //Establish the numbers of columns
let generation = 0; //Define a variable that will keep the count of the generations, starting at 0.
let playing = false; //Define a variable that will change when the game is being played, starting in false.
//Definition of constants that will be asigned to the elements with the correspondent ID
const generationCounter = document.getElementById("counter");
const startButton = document.getElementById("start");
const randomButton = document.getElementById("random");
const restartButton = document.getElementById("restart");
const clearButton = document.getElementById("clear");

let grid = new Array(rows); //Define a variable that will store an array with the size of the number of rows.
let nextGrid = new Array(rows); //Define a variable that will store an array, that will be the states of the next generation, with the size of the number of rows.

let timer; //Definition of a variable that will store the ID of the setTimeOut functions to use in the clearTimeOut function.
let reproductionTime = 200; //Definition of a variable that store the time between generations in ms.

//Function to initializeGrids, for each index of rows it will create two new Arrays of columns, one for the current grid and one for the next generation grid.
function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

//Function to reset grids. Set the rows and columns to 0. This will be used in the update view function
function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

//Function to copy and reset grids, sets the current grid to the next and the next to 0.
function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

// Initialize everything. Create the table, the grids, reset the grids just in case, and set up the buttons to work properly.
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

// Function to create the table
function createTable() {
  let gridContainer = document.getElementById("gridContainer"); //Selects the element with the ID of gridContainer and stores it in a variable
  let table = document.createElement("table"); //Selects the element with the ID of table and stores it in a variable

  for (let i = 0; i < rows; i++) {
    //For loop that will create a "tr" element for each row.
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      //Nested for loop that will create a "td" element (the cells of the table) for each column.
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j); //Also in each loop an unique ID will be set to each td element
      cell.setAttribute("class", "dead"); //As well as a class="dead"
      cell.onclick = cellClickHandler; //Set that each cell will have an onclick function asigned.
      tr.appendChild(cell); //Add each cell to the same row
    }
    table.appendChild(tr); //Add all the rows to the table.
  }
  gridContainer.appendChild(table); //Add the table to the grid container.
}

//Function that will execute when a cell is clicked.
function cellClickHandler() {
  let rowcol = this.id.split("_"); //Split the id of the cell, for example if the id="2_4", the rowcol variable will be [2, 4]
  let row = rowcol[0]; //Store the value of the row and column of the clicked cell.
  let col = rowcol[1];

  let classes = this.getAttribute("class"); //Get the atribute of the class (live or dead).
  if (classes.indexOf("live") > -1) {
    //If the class is live, change it to dead and set the value of that grid to 0, this will be used in the updateView function
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live"); //If the class is dead, change it to live and set the value of that grid to 1, this will be used in the updateView function
    grid[row][col] = 1;
  }
}

//Function update the view of the table and the generation count
function updateView() {
  generation++; //each time we start an update of the view of the table we add a generation.
  for (let i = 0; i < rows; i++) {
    //Loop through all the table and get IDs of each cell.
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        //If the value of the cell is 0, set the class to dead, else, set it to live.
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
  generationCounter.innerHTML = `Current generation: ${generation}`; //After each view update display a text with the Current generation
}

//Function that sets the onclicks functions of each button.
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

//Function that will run when the clear button is clicked
function clearButtonHandler() {
  let cellsList = document.getElementsByClassName("live"); //Get an array-like object that will contain all the cells with the class "live"

  let cells = []; //Create an array that will store all the cells with the live class
  for (let i = 0; i < cellsList.length; i++) {
    //Store in the cells array all the elements in the cellList array-like object
    cells.push(cellsList[i]);
  }

  for (let i = 0; i < cells.length; i++) {
    //Change the class of all cells to "dead"
    cells[i].setAttribute("class", "dead");
  }
  resetGrids(); //After all the cells have the dead class, set the grid to 0 with the resetGrids functions.
}

//Function that will run when the reset button is clicked
function restartButtonHandler() {
  clearButtonHandler(); //First execute the clear function to change all the cells to dead
  startButton.innerHTML = "Start"; //Then change the text of the start button to "Start" in case that is changed
  playing = false; //Set the variable to false to indicate that the user is not longer playing.
  generation = 0; //Set the generation to 0.
  generationCounter.innerHTML = ""; //Hide the display with the current generation count.
  clearTimeout(timer); //Stop the timeOutFunctions
  initializeGrids(); //Initialize the Grids (create the table again)
}

//Function that will run when the random button is clicked
function randomButtonHandler() {
  if (!playing) {
    //Only work is the user is not currently playing
    clearButtonHandler(); //Clear the table in case any cell had been pressed before
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var isLive = Math.round(Math.random()); //For each cell, generate a random number between 0 and 1
        if (isLive == 1) {
          //If the number is 1, set the cell to live, else, left it with the dead class
          var cell = document.getElementById(i + "_" + j);
          cell.setAttribute("class", "live");
          grid[i][j] = 1;
        }
      }
    }
  }
}

//Function that will run when the start button is clicked
function startButtonHandler() {
  if (playing) {
    //If the user has already clicked the button and is playing
    playing = false; //Set the variable playing to false
    this.innerHTML = "Continue"; //Change the text of the button to Continue
    clearTimeout(timer); //Stop the setTimeOut functions
  } else {
    //Else, if the user haven't clicked the button before
    playing = true; //Set the playing variable to true
    this.innerHTML = "Pause"; //Change the text of the button to Pause
    play(); //Execute the play function.
  }
}

//Function that will execute the game
function play() {
  computeNextGen(); //Execute the function computeNextGen

  if (playing) {
    //If the variable playing is true
    timer = setTimeout(play, reproductionTime); //Do a setTimeOut function that will execute the play funciton each 2000ms (because thats the value of reproductionTime).
    //And store the ID to use the clearTimeout in the timer variable.
  }
}

//Function that will be executed each time the play function is called
function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j); //This will apply the rules defined below to each cell
    }
  }
  // Execute the function to copy NextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  //Execute the function to update the view of the table with the new grids.
  updateView();
}

//Function to apply the logic of the game rules.
function applyRules(row, col) {
  let numNeighbors = countNeighbors(row, col); //Store in a variable the count of neighbors
  if (grid[row][col] == 1) {
    //Only if the cell is alive to the next tests
    if (numNeighbors < 2) {
      //If you have less than two neighbors, set to dead in the next grid
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      //If you have 2 or 3 neighbors, stay alive in the next grid
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      //If you have more than 3 neighbors, set to dead in the next grid
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    //If the cell is dead do the next
    if (numNeighbors == 3) {
      //If the cell have exactly 3 neighbors, set to live in the next grid
      nextGrid[row][col] = 1;
    }
  }
}
//Function to count the number of neighbors
function countNeighbors(row, col) {
  let count = 0; //Start the count in 0
  ///These if checks if the adjacent cells are live and if so, add 1 unit to the count
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
  return count; //Return the total count
}

// Execute the initialize function when the window is loaded.
window.onload = initialize;

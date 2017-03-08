//2018 Game Logic

function Game2048 () {
  this.board = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
  ];

  this.score  = 0;
  this.won = false;
  this.lost = false;
  this._generateTile();
  this._generateTile();
}

//Private method to generate a tile

Game2048.prototype._generateTile = function () {
  //Initial value is equal to Random Number < .8
  //condition = true ? return x : else return y
  var initialValue = (Math.random() < 0.8) ? 2 : 4;

  //call private method getAvailablePosition
  var emptyTile = this._getAvailablePosition();

  //if emptyTile update board with found position.
  if (emptyTile) {
    this.board[emptyTile.x][emptyTile.y] = initialValue;
  }
};


Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];

  this.board.forEach(function(row, rowIndex){
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });
  });

  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

//Render board
Game2048.prototype._renderBoard = function () {
  //for each row in board, console out the row
  this.board.forEach(function(row){ console.log(row); });
};

//Move Left
Game2048.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;

        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.push(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);


  });

  this.board = newBoard;
  return boardChanged;
};
//Move Right
Game2048.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  //For each row in the board newRow equals row filtered for empty element
  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    //Loop through newRow, with index strating newRow.length
    //Starting at the end of the row
    //while i greater than 0, decrement i
    for (i=newRow.length - 1; i>0; i--) {

      //if previous element equals current element
      if (newRow[i-1] === newRow[i]) {
        //Set the current index to the multiple of itself by 2
        newRow[i]   = newRow[i] * 2;
        //Empty the previous index contents
        newRow[i-1] = null;
        //update score to new valued tile
        that._updateScore(newRow[i]);
      }

      //if the length of the new row does not equal current row length
      if (newRow.length !== row.length) boardChanged = true;
    }

    //merged equals the filtered new row where i is not null
    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    //while merged length is les than 4
    while(merged.length < 4) {
      //Add items to the front of array
      merged.unshift(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

Game2048.prototype._moveUp = function () {
  //Flip and rotate board
  this._transposeMatrix();
  //Move left which is moving up on the flipped board
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  //Move right which is moving down on the flipped board
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

//Transpose the 4x4 board (turn it 90 degrees)
Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};

Game2048.prototype.move = function (direction) {
  if (!this._gameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
      this._isGameLost();
    }
  }
};

Game2048.prototype._updateScore = function (value) {
  this.score += value;

  console.log("Score Updated: " + this.score);

  if (value === 2048) {
    this.won = true;
  }
};

// Game2048.prototype.win = function () {
//   return this.won;
// };

Game2048.prototype._gameFinished = function () {
  return this.won;
};

Game2048.prototype._isGameLost = function () {
  if (this._getAvailablePosition())
    return;

  var that   = this;
  var isLost = true;

  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (cell, cellIndex) {
      var current = that.board[rowIndex][cellIndex];
      var top, bottom, left, right;

      if (that.board[rowIndex][cellIndex - 1]) {
        left  = that.board[rowIndex][cellIndex - 1];
      }
      if (that.board[rowIndex][cellIndex + 1]) {
        right = that.board[rowIndex][cellIndex + 1];
      }
      if (that.board[rowIndex - 1]) {
        top    = that.board[rowIndex - 1][cellIndex];
      }
      if (that.board[rowIndex + 1]) {
        if (current === top || current === bottom || current === left || current === right)
        bottom = that.board[rowIndex + 1][cellIndex];
      }

        isLost = false;
    });
  });

  this.lost = isLost;
};


//-------------
//View Logic
//-------------


function renderTiles () {
  //For each row on the board
  game.board.forEach(function(row, rowIndex){
      //For each cell in the row
    row.forEach(function (cell, cellIndex) {
      if (cell) {
        //Assign titleContainer to the element with id of tile-container
        var tileContainer = document.getElementById("tile-container");
        //Assign newTile to created div
        var newTile       = document.createElement("div");

        // Update the class with dynamic data for behavior
        newTile.classList  = "tile val-" + cell;
        newTile.classList += " tile-position-" + rowIndex + "-" + cellIndex;
        newTile.innerHTML  = (cell);

        //Append new Tile to the tile container
        tileContainer.appendChild(newTile);
      }
    });
  });
}

//Updates the score
function updateScore () {
  //Stores the current game score
  var score          = game.score;
  //Grabs elements by js-score class name
  var scoreContainer = document.getElementsByClassName("js-score");

  //Convert the scoreContainer to an Array
  //For each span in the score container
  Array.prototype.slice.call(scoreContainer).forEach(function (span) {
    //Update the span with score
    span.innerHTML = score;
  });
}

function gameStatus () {
  if (game.won) {
    document.getElementById("game-over").classList = "show-won";
  } else if (game.lost) {
    document.getElementById("game-over").classList = "show-lost";
  }
}

// Keyboard move listner
function moveListeners (event) {
  //Keys that represent movement
  var keys = [37, 38, 39, 40];

  //console.log('KEY CODE: ',event.keyCode);
  //If there is no key code on this event, will return -1, then return nothing
  if (keys.indexOf(event.keyCode) < 0)
    return;

    //play sound on every move
   ion.sound.play("tap");

    //Based on the keyCode received, execute move accordingly
  switch (event.keyCode) {
    case 37: game.move("left");  break;
    case 38: game.move("up");    break;
    case 39: game.move("right"); break;
    case 40: game.move("down");  break;
  }

  game._renderBoard();
  //reset tiles
  resetTiles();
  renderTiles();
  //update the score on every keyboard event
  updateScore();
  //update the game status on every keyboard event
  gameStatus();
}

//Rest Tiles
function resetTiles () {
  //Target th tiles container based on ID
  var tilesContainer = document.getElementById("tile-container");

  //Grab all tiles off the tile Container
  var tiles          = tilesContainer.getElementsByClassName("tile");

  Array.prototype.slice.call(tiles).forEach(function (tile) {
    //remove the child from the tiles container
    tilesContainer.removeChild(tile);
  });
}

document.addEventListener("keydown", moveListeners);

// Load sounds from ion.sound.min.js
function loadSounds () {
  ion.sound({
    // Installing snap and tap sounds
    sounds: [{name: "snap"}, {name: "tap"}],

    path: "lib/sounds/",
    preload: true,
    volume: 1.0
  });
}


//Interaction Logic

// window.onload = function () {
//   game = new Game2048();
//   renderTiles();
// };

$(document).ready(function(){

  game = new Game2048();
  renderTiles();
  // var game = new Game2048();
  // game._renderBoard();
  // console.log('Game is ready');

  // console.log("Move Up");
  // game.move("up");
  // game._renderBoard();
  // console.log("Move Down");
  // game.move("down");
  // game._renderBoard();
  //   console.log("Move Left");
  // game.move("left");
  // game._renderBoard();
  //   console.log("Move Right");
  // game.move("right");
  // game._renderBoard();


});

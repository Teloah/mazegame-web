(function() {
"use strict";

var cellsize = 24;

var cellType = Object.freeze({
  PASSAGE : "passage",
  WALL : "wall",
  BORDER : "border",
  DOOR : "door"
});

var game = {
  lastLoopTime : new Date(),
  elapsedSecs : 0,
  frames : 0,
  lastFrames : 0
};

var player = {
  position : {
    x : 1,
    y : 1
  }
};

var gfx = {
  bricks :     { left: 2,   width: 24 },
  darkbricks : { left: 28,  width: 24 },
  door :       { left: 54,  width: 24 },
  ground :     { left: 80,  width: 24 },
  key :        { left: 106, width: 13 },
  zombie :     { left: 123, width: 16 },
  player :     { left: 142, width: 15 },
  box :        { left: 160, width: 15 },
  getImageFor : function(celltype) {
    switch (celltype) {
      case cellType.PASSAGE: return this.ground;
      case cellType.WALL: return this.bricks;
      case cellType.BORDER: return this.darkbricks;
      case cellType.DOOR: return this.door;
      default: return this.ground;
    }
  }
};

var maze = {
  width : 30,
  height : 20,
  cells : [],
  getCell : function(x, y) {
    return this.cells[x][y];
  },
  setCell : function(x, y, value) {
    this.cells[x][y] = value;
  },
  init : function() {
    var x = 0, y = 0;
    for (x; x < this.width; x++) {
      this.cells[x] = [];
      y = 0;
      for (y; y < this.height; y++) {
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
          this.setCell(x, y, cellType.BORDER);
        } else {
          if (x % 2 === 0 && y % 2 === 0) {
            this.setCell(x, y, cellType.WALL);
          } else {
            this.setCell(x, y, cellType.PASSAGE);
          }
        }
      }
    };
    this.cells[0][1] = cellType.DOOR;
  },
  canMoveInto: function(x, y) {
    return this.cells[x][y] === cellType.PASSAGE;
  }
};


var keys = [
  { // left
    ord: 37,
    exec : function() {
      var destX = player.position.x - 1;
      if (maze.canMoveInto(destX, player.position.y)) {
        player.position.x = destX;
      }
    }
  },
  { // up
    ord: 38,
    exec : function() {
      var destY = player.position.y - 1;
      if (maze.canMoveInto(player.position.x, destY)) {
        player.position.y = destY;
      }
    }
  },
  { // right
    ord: 39,
    exec : function() {
      var destX = player.position.x + 1;
      if (maze.canMoveInto(destX, player.position.y)) {
        player.position.x = destX;
      }
    }
  },
  { // down
    ord: 40,
    exec : function() {
      var destY = player.position.y + 1;
      if (maze.canMoveInto(player.position.x, destY)) {
        player.position.y = destY;
      }
    }
  }
];

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  keys.forEach(function(key, index, array) {
    if (event.which === key.ord) {
      key.exec();
    }
  });
}

var canvasGame = document.getElementById("maingame"),
  contextGame = canvasGame.getContext("2d"),
  requestAnimFrame = window.requestAnimationFrame,
  imgSprites = new Image();
imgSprites.src = "images/sprites.png";
imgSprites.onload = init;

function init() {
  maze.init();
  requestAnimFrame(gameLoop);
  console.log("initialized");
}

function gameLoop() {
  document.getElementById("score").innerHTML = "<p>Score: " + game.elapsedSecs.toString() + "</p>";
  contextGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
  paintMaze();
  paintImage(gfx.player, player.position.x * cellsize, player.position.y * cellsize);
  paintElapsedTime();
  requestAnimFrame(gameLoop);
}

function paintMaze() {
  var x = 0, y;
  for (x; x < maze.width; x++) {
    y = 0;
    for (y; y < maze.height; y++) {
      paintImage(gfx.getImageFor(maze.getCell(x, y)), x * cellsize, y * cellsize);
    }
  }
}

function paintElapsedTime() {
  var tickTime = new Date();
  if ((tickTime - game.lastLoopTime) > 1000) {
    game.lastFrames = game.frames;
    game.frames = 0;
    game.lastLoopTime = tickTime;
    game.elapsedSecs++;
  }
  game.frames++;
  contextGame.font = "30px Verdana";
  contextGame.fillText(game.elapsedSecs.toString(), cellsize, canvasGame.height - cellsize);
  contextGame.font = "15px Verdana";
  contextGame.fillText(game.lastFrames.toString(), cellsize, canvasGame.height - 50);
}

function paintImage(sprite, x, y) {
  contextGame.drawImage(imgSprites, sprite.left, 2, sprite.width, cellsize, x, y, sprite.width, cellsize);
}

}());

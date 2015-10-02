(function() {
"use strict";

var cellsize = 24;

var cellType = Object.freeze({
  PASSAGE : "passage",
  WALL : "wall",
  BORDER : "border",
  DOOR : "door"
});

var itemType = Object.freeze({
  TREASURE : "treasure",
  ZOMBIE : "zombie"
});

function Pos(x, y) {
  this.x = x;
  this.y = y;
}
Pos.prototype.equals = function(x, y) {
  return (this.x === x && this.y ===y);
};

// ---------------------------- TIMER ------------------------------

function Timer(owner, timeout) {
  this.owner = owner;
  this.lastTime = new Date();
  this.timeout = timeout;
}
Timer.prototype.onTick = function(owner) {
};
Timer.prototype.tick = function() {
  var tickTime = new Date();
  if ((tickTime - this.lastTime) > this.timeout) {
    this.lastTime = tickTime;
    this.onTick(this.owner);
  }
};

// ---------------------------- GAME ------------------------------

function Game() {
  this.elapsedSecs = 0;
  this.frames = 0;
  this.lastFrames = 0;
  this.timer = new Timer(this, 1000);
  this.timer.onTick = function(owner) {
    owner.lastFrames = owner.frames;
    owner.frames = 0;
    owner.elapsedSecs++;
  };
}
Game.prototype.tick = function() {
  this.timer.tick();
};

var game = new Game();

// ---------------------------- ITEM ------------------------------

function Item(x, y) {
  this.position = new Pos(x, y);
}
Item.prototype.tick = function() {
};

// ---------------------------- ITEMLIST ------------------------------

function ItemList() {
  this.items = [];
}
ItemList.prototype.addItem = function(item) {
  this.items.push(item);
};
ItemList.prototype.removeItem = function(item) {
  var index = this.items.indexOf(item);
  if (index > -1) {
    this.items.splice(index, 1);
  }
};
ItemList.prototype.forEach = function(callback) {
  this.items.forEach(callback);
};
ItemList.prototype.getItems = function(x, y) {
  var list = [];
  this.items.forEach(function(item) { if (item.position.equals(x, y)) { list.push(item); } });
  return list;
};

var player = new Item(1, 1);

var gfx = {
  bricks :     { left: 2,   width: 24 },
  darkbricks : { left: 28,  width: 24 },
  door :       { left: 54,  width: 24 },
  ground :     { left: 80,  width: 24 },
  key :        { left: 106, width: 13 },
  zombie :     { left: 123, width: 16 },
  player :     { left: 142, width: 15 },
  box :        { left: 160, width: 15 },
  getCellImage : function(imageid) {
    switch (imageid) {
      case cellType.PASSAGE: return this.ground;
      case cellType.WALL: return this.bricks;
      case cellType.BORDER: return this.darkbricks;
      case cellType.DOOR: return this.door;
      default: return this.ground;
    }
  },
  getItemImage : function(item) {
    switch (item.type) {
      case itemType.TREASURE: return this.box;
      case itemType.ZOMBIE: return this.zombie;
    }
  }
};

// ---------------------------- MAZE ------------------------------

function Cell(x, y, celltype) {
  this.position = new Pos(x, y);
  this.type = celltype;
}

var maze = {
  width : 30,
  height : 20,
  cells : [],
  items : new ItemList(),
  getCell : function(x, y) {
    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
      return null;
    } else {
      return this.cells[x][y];
    }
  },
  setCell : function(value) {
    this.cells[value.position.x][value.position.y] = value;
  },
  addItem : function(item) {
    this.items.addItem(item);
  },
  init : function() {
    this.generate();
    this.getCell(0, 1).type = cellType.DOOR;
  },
  canMoveInto: function(x, y) {
    return this.getCell(x, y).type === cellType.PASSAGE;
  },
  moveItem: function(item, x, y) {
    this.items.removeItem(item);
    item.moveTo(x, y);
    this.items.addItem(item);
  },
  getNeighbours: function(pos) {
    var neighbours = new Array(
      this.getCell(pos.x, pos.y - 1),
      this.getCell(pos.x + 1, pos.y),
      this.getCell(pos.x, pos.y + 1),
      this.getCell(pos.x - 1, pos.y));
    return neighbours.filter(function(n) { return n !== null; });
  },
  getRandomNeighbour: function(pos, predicate) {
    var neighbours = this.getNeighbours(pos);
    if (predicate) {
      neighbours = neighbours.filter(predicate);
    }
    if (neighbours.length > 0) {
      var id = Math.random() * neighbours.length;
      var cell = neighbours[Math.floor(id)];
      return cell;
    }
    return null;
  },
  tick: function() {
    this.items.forEach(function(item) { item.tick(); });
  },
  generate: function() {
    // using Growing Tree algorithm from
    // http://www.astrolog.org/labyrnth/algrithm.htm

    // This is a general algorithm, capable of creating Mazes of different
    // textures. It requires storage up to the size of the Maze. Each time
    // you carve a cell, add that cell to a list. Proceed by picking a cell
    // from the list, and carving into an unmade cell next to it. If there
    // are no unmade cells next to the current cell, remove the current cell
    // from the list. The Maze is done when the list becomes empty. The
    // interesting part that allows many possible textures is how you pick a
    // cell from the list. For example, if you always pick the most recent
    // cell added to it, this algorithm turns into the recursive
    // backtracker. If you always pick cells at random, this will behave
    // similarly but not exactly to Prim's algorithm. If you always pick the
    // oldest cells added to the list, this will create Mazes with about as
    // low a "river" factor as possible, even lower than Prim's algorithm.
    // If you usually pick the most recent cell, but occasionally pick a
    // random cell, the Maze will have a high "river" factor but a short
    // direct solution. If you randomly pick among the most recent cells,
    // the Maze will have a low "river" factor but a long windy solution.
    var x = 0, y = 0;
    for (x; x < this.width; x++) {
      this.cells[x] = [];
      y = 0;
      for (y; y < this.height; y++) {
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
          this.setCell(new Cell(x, y, cellType.BORDER));
        } else {
          this.setCell(new Cell(x, y, cellType.PASSAGE));
        }
      }
    }
    var stack = [];
    stack[0] = new Cell(1, 1, cellType.PASSAGE);
    var neighbour, cell;
    console.log("generating...");
    while (stack.length > 0) {
      cell = stack[stack.length - 1];
      console.log("-- cell: ", cell);
      neighbour = this.getRandomNeighbour(cell.position);
      console.log("-- neightbour: ", neighbour);
      /* if (neighbour) {
        stack[stack.length] = neighbour;
      } else {
        stack[stack.length - 1] = undefined;
      } */
      stack.pop();
    }
    console.log("done");
  }
};

// ---------------------------- ITEMS ------------------------------

function Treasure(x, y) {
  Item.call(this, x, y);
  this.type = itemType.TREASURE;
}
Treasure.prototype = Object.create(Item.prototype);
Treasure.prototype.constructor = Treasure;

function Monster(x, y) {
  Item.call(this, x, y);
}
Monster.prototype = Object.create(Item.prototype);
Monster.prototype.constructor = Monster;
Monster.prototype.moveTo = function (x, y) {
  this.position.x = x;
  this.position.y = y;
};

function Zombie(x, y) {
  Monster.call(this, x, y);
  this.type = itemType.ZOMBIE;
  this.timer = new Timer(this, 500);
  this.timer.onTick = function(owner) {
    var cell = maze.getRandomNeighbour(owner.position,
      function(c) {
        if (!maze.canMoveInto(c.position.x, c.position.y)) {
          return false;
        }
        var items = maze.items.getItems(c.position.x, c.position.y);
        var cnt = items.length, i = 0;
        for (i; i < cnt; i++) {
          if (items[i] instanceof Monster) {
            return false;
          }
        }
        return true;
      }
    );
    if (cell) {
      maze.moveItem(owner, cell.position.x, cell.position.y);
    }
  };
}
Zombie.prototype = Object.create(Monster.prototype);
Zombie.prototype.constructor = Zombie;
Zombie.prototype.tick = function() {
  this.timer.tick();
};

// ---------------------------- KEYS ------------------------------

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

var score = document.getElementById("score");

function init() {
  maze.init();
  for (var x = 3; x < 10; x = x + 2) {
    maze.addItem(new Zombie(maze.width - x, maze.height - x));
  }
  maze.addItem(new Treasure(maze.width - 5, maze.height - 4));
  requestAnimFrame(gameLoop);
  console.log("initialized");
}

function gameLoop() {
  score.innerHTML = "<p>Score: " + game.elapsedSecs.toString() + "</p>";
  contextGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
  maze.tick();
  paintMaze();
  paintItems();
  paintImage(gfx.player, player.position.x * cellsize, player.position.y * cellsize);
  paintElapsedTime();
  requestAnimFrame(gameLoop);
}

function paintMaze() {
  var x = 0, y;
  for (x; x < maze.width; x++) {
    y = 0;
    for (y; y < maze.height; y++) {
      paintImage(gfx.getCellImage(maze.getCell(x, y).type), x * cellsize, y * cellsize);
    }
  }
}

function paintItems() {
  maze.items.forEach(function(item) {
    paintImage(gfx.getItemImage(item), item.position.x * cellsize, item.position.y * cellsize);
  });
}

function paintElapsedTime() {
  game.tick();
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

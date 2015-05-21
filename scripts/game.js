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

function Item(x, y) {
  this.position = new Pos(x, y);
}
Item.prototype.tick = function() {
};

function ItemList() {
  this.items = [];
}
ItemList.prototype.getRow = function(x) {
  var list = this.items[x];
  if (!list) {
    list = [];
    this.items[x] = list;
  }
  return list;
};
ItemList.prototype.addItem = function(item) {
  var list = this.getRow(item.position.x);
  list[item.position.y] = item;
};
ItemList.prototype.removeItem = function(item) {
  var list = this.getRow(item.position.x);
  list[item.position.y] = undefined;
};
ItemList.prototype.getItem = function(x, y) {
  var list = this.getRow(x);
  return list[y];
};
ItemList.prototype.forEach = function(callback) {
  var x = 0, y = 0, list = [], item;
  for (x; x < this.items.length; x++) {
    list = this.getRow(x);
    y = 0;
    for (y; y < list.length; y++) {
      item = list[y];
      if (item) {
        callback(item);
      }
    }
  }
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
    var x = 0, y = 0;
    for (x; x < this.width; x++) {
      this.cells[x] = [];
      y = 0;
      for (y; y < this.height; y++) {
        if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
          this.setCell(new Cell(x, y, cellType.BORDER));
        } else {
          if (x % 2 === 0 && y % 2 === 0) {
            this.setCell(new Cell(x, y, cellType.WALL));
          } else {
            this.setCell(new Cell(x, y, cellType.PASSAGE));
          }
        }
      }
    }
    this.getCell(0, 1).type = cellType.DOOR;
  },
  canMoveInto: function(x, y) {
    if (this.getCell(x, y).type !== cellType.PASSAGE)
      return false;
    var item = this.items.getItem(x, y);
    return !(item instanceof Monster);
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
      function(c) { return maze.canMoveInto(c.position.x, c.position.y); }
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
  document.getElementById("score").innerHTML = "<p>Score: " + game.elapsedSecs.toString() + "</p>";
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

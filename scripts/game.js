(function() {
"use strict";

var cellsize = 24;

var game = {
	lastLoopTime : new Date(),
	elapsedSecs : 0,
	frames : 0,
	lastFrames : 0
};

var player = {
	left : 24,
	top : 24
};

var cellType = Object.freeze({
	PASSAGE : "passage",
	WALL : "wall",
	BORDER : "border"
});

var maze = {
	width : 30,
	height : 20,
	cells : [],
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
					this.setCell(x, y, cellType.PASSAGE);
				}
			};
			console.log(this.cells[x]);
		};
	}
};

var keys = [
	{	// left
		ord: 37,
		exec : function() {
			if (player.left > cellsize) { 
				player.left = player.left - cellsize;
			}
		}
	},
	{	// up
		ord: 38,
		exec : function() {
			if (player.top > cellsize) {
				player.top = player.top - cellsize;
			}
		}
	},
	{	// right
		ord: 39,
		exec : function() {
			if (player.left < maze.width - cellsize * 2) {
				player.left = player.left + cellsize;
			}
		}
	},
	{	// down
		ord: 40,
		exec : function() {
			if (player.top < maze.height - cellsize * 2) {
				player.top = player.top + cellsize;
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
};

var gfx = {
	bricks :     { left: 2,   width: 24 },
	darkbricks : { left: 28,  width: 24 },
	door :       { left: 54,  width: 24 },
	ground :     { left: 80,  width: 24 },
	key :        { left: 106, width: 13 },
	zombie :     { left: 123, width: 16 },
	player :     { left: 142, width: 15 },
	box :        { left: 160, width: 15 }
};

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

function paintBorders() {
	paintImageRow(gfx.darkbricks, 0, maze.width * cellsize, 0);
	paintImageColumn(gfx.darkbricks, cellsize, maze.height * cellsize - cellsize, 0);
	paintImageColumn(gfx.darkbricks, cellsize, maze.height * cellsize - cellsize, maze.width * cellsize - cellsize);
	paintImageRow(gfx.darkbricks, 0, maze.width * cellsize, maze.height * cellsize - cellsize);
	paintImage(gfx.door, 0, cellsize);
	
	fillImageRect(gfx.ground, cellsize, cellsize, maze.width * cellsize - cellsize, maze.height * cellsize - cellsize);
}

function gameLoop() {
	document.getElementById("score").innerHTML = "<p>Score: " + game.elapsedSecs.toString() + "</p>";
	contextGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
	paintBorders();
	paintImage(gfx.player, player.left, player.top);
	paintElapsedTime();
	requestAnimFrame(gameLoop);
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
	contextGame.fillText(game.elapsedSecs.toString(), cellsize, canvasGame.height * cellsize - cellsize);
	contextGame.font = "15px Verdana";
	contextGame.fillText(game.lastFrames.toString(), cellsize, canvasGame.height * cellsize - 50);
}

function paintImageRow(sprite, start, end, y) {
	for (var x = start; x < end; x += cellsize) {
		paintImage(sprite, x, y);
	}
}

function paintImageColumn(sprite, start, end, x) {
	for (var y = start; y < end; y += cellsize) {
		paintImage(sprite, x, y);
	}
}

function paintImage(sprite, x, y) {
	contextGame.drawImage(imgSprites, sprite.left, 2, sprite.width, cellsize, x, y, sprite.width, cellsize);
}

function fillImageRect(sprite, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += cellsize) {
		for (var y = y1; y < y2; y += cellsize) {
			paintImage(sprite, x, y);
		}
	}
}
}());

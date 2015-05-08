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

var maze = {
	width : 720,
	height : 480
};

var keys = [
	{
		// left
		ord: 37,
		exec : function() {
			player.left = player.left - cellsize;
		}
	},
	{
		// up
		ord: 38,
		exec : function() {
			player.top = player.top - cellsize;
		}
	},
	{
		// right
		ord: 39,
		exec : function() {
			player.left = player.left + cellsize;
		}
	},
	{
		// down
		ord: 40,
		exec : function() {
			player.top = player.top + cellsize;
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
	requestAnimFrame(gameLoop);
	console.log("initialized");
}

function paintBorders() {
	paintImageRow(gfx.darkbricks, 0, maze.width, 0);
	paintImageColumn(gfx.darkbricks, cellsize, maze.height - cellsize, 0);
	paintImageColumn(gfx.darkbricks, cellsize, maze.height - cellsize, maze.width - cellsize);
	paintImageRow(gfx.darkbricks, 0, maze.width, maze.height - cellsize);
	paintImage(gfx.door, 0, cellsize);
	
	fillImageRect(gfx.ground, cellsize, cellsize, maze.width - cellsize, maze.height - cellsize);
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
	contextGame.fillText(game.elapsedSecs.toString(), cellsize, canvasGame.height - cellsize);
	contextGame.font = "15px Verdana";
	contextGame.fillText(game.lastFrames.toString(), cellsize, canvasGame.height - 50);
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

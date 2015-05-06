(function() {
"use strict";

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

var keys = [
	{
		// left
		ord: 37,
		down: false,
		exec : function() {
			player.left = player.left - 24;
		}
	},
	{
		// up
		ord: 38,
		down: false,
		exec : function() {
			player.top = player.top - 24;
		}
	},
	{
		// right
		ord: 39,
		down: false,
		exec : function() {
			player.left = player.left + 24;
		}
	},
	{
		// down
		ord: 40,
		down: false,
		exec : function() {
			player.top = player.top + 24;
		}
	}
];

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
	keys.forEach(function(key, index, array) {
		if (event.which === key.ord) {
			key.down = true;
			key.exec();
		}
	});
}

function handleKeyUp(event) {
	keys.forEach(function(key, index, array) {
		if (event.which === key.ord) {
			key.down = false;
		}
	});
}

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
	paintImageRow(gfx.darkbricks, 0, 720, 0);
	paintImageColumn(gfx.darkbricks, 24, 480 - 24, 0);
	paintImageColumn(gfx.darkbricks, 24, 480 - 24, 720 - 24);
	paintImageRow(gfx.darkbricks, 0, 720, 480 - 24);
	paintImage(gfx.door, 0, 24);
	
	fillImageRect(gfx.ground, 24, 24, 720 - 24, 480 - 24);
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
	if (tickTime - game.lastLoopTime > 1000) {
		game.lastFrames = game.frames;
		game.frames = 0;
		game.lastLoopTime = tickTime;
		game.elapsedSecs++;
	}
	game.frames++;
	contextGame.font = "30px Verdana";
	contextGame.fillText(game.elapsedSecs.toString(), 24, canvasGame.height - 24);
	contextGame.font = "15px Verdana";
	contextGame.fillText(game.lastFrames.toString(), 24, canvasGame.height - 50);
}

function paintImageRow(sprite, start, end, y) {
	for (var x = start; x < end; x += 24) {
		paintImage(sprite, x, y);
	}
}

function paintImageColumn(sprite, start, end, x) {
	for (var y = start; y < end; y += 24) {
		paintImage(sprite, x, y);
	}
}

function paintImage(sprite, x, y) {
	contextGame.drawImage(imgSprites, sprite.left, 2, sprite.width, 24, x, y, sprite.width, 24);
}

function fillImageRect(sprite, x1, y1, x2, y2) {
	for (var x = x1; x < x2; x += 24) {
		for (var y = y1; y < y2; y += 24) {
			paintImage(sprite, x, y);
		}
	}
}
}());

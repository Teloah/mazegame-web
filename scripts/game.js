"use strict"

var game = {
	lastLoopTime : new Date(),
	elapsedSecs : 0,
	frames : 0,
	lastFrames : 0
}

var keys = {
	right : {
		down: false
	},
	left : {
		down: false
	}
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
	if (event.which === 39) {
		keys.right.down = true;
		contextGame.globalAlpha = 0.5;
	}
}

function handleKeyUp(event) {
	if (event.which === 39) {
		keys.right.down = false;
		contextGame.globalAlpha = 1;
	}
}

var canvasGame = document.getElementById("maingame"),
	contextGame = canvasGame.getContext("2d"),
	gfx_bricks = { left: 2, width: 24 },
	gfx_darkbricks = { left: 28, width: 24 },
	gfx_door = { left: 54, width: 24 },
	gfx_ground = { left: 80, width: 24 },
	gfx_key = { left: 106, width: 13 },
	gfx_zombie = { left: 123, width: 16 },
	gfx_player = { left: 142, width: 15 },
	gfx_box = { left: 160, width: 15 },
	requestAnimFrame = window.requestAnimationFrame,
	imgSprites = new Image();
imgSprites.src = "images/sprites.png";
imgSprites.onload = init;

function init() {
	requestAnimFrame(gameLoop);
	console.log("initialized");
}

function paintBorders() {
	paintImageRow(gfx_darkbricks, 0, 720, 0);
	paintImageColumn(gfx_darkbricks, 24, 480 - 24, 0);
	paintImageColumn(gfx_darkbricks, 24, 480 - 24, 720 - 24);
	paintImageRow(gfx_darkbricks, 0, 720, 480 - 24);
	paintImage(gfx_door, 0, 24);
	
	fillImageRect(gfx_ground, 24, 24, 720 - 24, 480 - 24);
	paintImage(gfx_player, 24, 24);
}

function gameLoop() {
	document.getElementById("score").innerHTML = "<p>Score: " + game.elapsedSecs.toString() + "</p>";
	contextGame.clearRect(0, 0, canvasGame.width, canvasGame.height);
	paintBorders();
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

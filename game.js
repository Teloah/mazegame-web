"use strict"

var canvasGame = document.getElementById("background"),
		contextGame = canvasGame.getContext("2d"),
		imgSprites = new Image();
imgSprites.src = "images/bricks24.png";
imgSprites.addEventListener("load", init, false);

function init() {
	var pat = contextGame.createPattern(imgSprites, "repeat");
	contextGame.fillStyle = pat;
	contextGame.globalAlpha = 0.5;
	contextGame.fillRect(0, 0, 600, 400);
	console.log("initialized");
}

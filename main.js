// allows picking a random element within any array.
Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
}

// return a random number between the mix and max value.
function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

// delay (ugly sleep) for the given value in milliseconds.
function delay(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// preload a given image and return it's HTMLImageElement.
function preload(url) {
	var img = new Image();
	img.src = url;
	return img;
}

// define the goat's behaviour.
class Goat {
	direction = "left";

	constructor() {
		this.element = document.getElementById("goat");
	}
	walk() {
		// get the goat's starting position.
		var rect = this.element.getBoundingClientRect();
		var goatStartingPosition = rect.left;
		var goatWidth = rect.width;

		// get the width of the window.
		var windowWidth = window.innerWidth;

		// always toggle the walking direction.
		if (this.direction === "left") {
			this.direction = "right";
		} else {
			this.direction = "left";
		}
		// get the direction of travel.
		// var direction = ['right', 'left'].random();

		var num;

		switch (this.direction) {
			case "right":
				this.element.style.transform = "scaleX(-1)";
				num = randomBetween(goatStartingPosition, windowWidth - goatWidth)
				break;
			case "left":
				this.element.style.transform = "";
				num = randomBetween(0, goatStartingPosition);
				break;
		}

		var milliseconds = 5;

		// mark that the goat is currently walking;
		this.walking = true;
		(async function (parent) {
			// going right, increment.
			if (parent.direction === "right") {
				for (let i = goatStartingPosition; i < num; i++) {
					if (parent.dead) { return }
					parent.element.style.left = i + "px";
					await delay(milliseconds);
				}
				return
			}
			// going left, decrement.
			for (let i = goatStartingPosition; i > num; i--) {
				if (parent.dead) { return }
				parent.element.style.left = i + "px";
				await delay(milliseconds);
			}
		})(this).then(() => {
			this.walking = false;
		})
	}
}

// preload our assets into an atlas.
var atlas = {
	goatDead: preload("/assets/goat.png"),
	goatSkeleton: preload("/assets/goat-skeleton.png"),
	audio: {
		thunder: new Audio("/assets/thunder.mp3")
	}
}

var intervalId;

// no actual goats were harmed in the making of this temple.
var bolt = document.getElementById("bolt");
var btn = document.getElementById("sacrifice-btn");
btn.addEventListener("click", () => {
	clearInterval(intervalId);
	goat.dead = true;
	goat.element.setAttribute("src", atlas.goatDead.src)

	// play the thunderclap, but make sure it plays again if user spams.
	atlas.audio.thunder.currentTime = 0;
	atlas.audio.thunder.play();

	var rect = goat.element.getBoundingClientRect();

	(async function () {
		for (let i = 0; i < 10; i++) {
			if (i % 3) {
				bolt.style.display = "inline";
				bolt.style.top = -(rect.top + rect.height / 2) + "px";
				bolt.style.left = (rect.left + rect.width / 2) + "px";
				goat.element.setAttribute("src", atlas.goatSkeleton.src);
			} else {
				goat.element.setAttribute("src", atlas.goatDead.src);
			}
			await delay(50);
		}
		bolt.style.display = "none";
		goat.element.setAttribute("src", atlas.goatDead.src);
	})()

	goat.element.style.transform = "scaleY(-1)";
	goat.element.style.top = (rect.height / 4) + "px"
});

// capra hircus: deploy!
var goat = new Goat();
intervalId = setInterval(() => {
	if (!goat.walking || goat.dead) {
		goat.walk();
	}
}, 1000)


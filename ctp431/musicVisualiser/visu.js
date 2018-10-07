var song
var snowflakes = []
var lower_freqs = [22, 44, 88, 177, 355, 710, 1420, 2840, 5680, 11360]
var upper_freqs = [44, 88, 177, 355, 710, 1420, 2840, 5680, 11360, 22720]
var center_freqs = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

function setup(){
	song = loadSound("song.mp3")

	//https://www.parts-express.com/Data/Default/Images/Catalog/Original/294-836_HR_0.jpg
	speaker = loadImage("speaker.png")
	createCanvas(640, 480)

	amp = new p5.Amplitude()
	//amp.setInput(song)


	//lowPassFilter = new p5.LowPass();
	//song.disconnect()
	//song.connect(lowPassFilter)

	highPassFilter = new p5.HighPass();
	song.disconnect()
	song.connect(highPassFilter)

	fft = new p5.FFT()

	background(200)
}

function mousePressed(){
	if(song.isPlaying()){
		song.pause()
	} else{
		song.play()
	}
}

function draw(){

	background('rgba(200, 200, 200, 0.2)')

	var dirY = (mouseY / height - 0.5) * 4;
	var dirX = (mouseX / width - 0.5) * 4;


	var t = frameCount/60

	var rms = amp.getLevel()
	var spectrum = fft.analyze()
	//var waveform = fft.waveform()

	if(rms > 0.1){
		for(var i = 0; i < 10; ++i){
			var energy = fft.getEnergy(lower_freqs[i], upper_freqs[i])
			for (let flake of snowflakes) {
	 		   if(flake.posX > i*width/10 && flake.posX < (i+1)*width/10)
	 		   flake.bounce(0.2*Math.sqrt(energy/(255*2))) // update snowflake position
			}
		}
	}
	if(rms > 0.2){
		var a = Math.random()*255
		var b = Math.random()*255
		var c = Math.random()*255
		background('rgba('+a+','+b+','+c+',0.8)')
	}

	// create a random number of snowflakes each frame
	for (var i = 0; i < random(7); i++) {
		snowflakes.push(new snowflake()); // append snowflake object
	}

	noStroke()
	var c = color("black")
	fill(c)
	// loop through snowflakes with a for..of loop
	for (let flake of snowflakes) {
	    flake.update(t) // update snowflake position
	    flake.display() // draw snowflake
	}

	drawSpeakers()
}

var gravity = 3
// snowflake class
function snowflake(){
	// initialize coordinates
	this.posX = 0
	this.posY = 3* height/4 + random(-50, 0)
	this.initialangle = random(0, 2 * PI)
	this.size = random(2, 5)
	this.speedY = pow(this.size, 0.5)
	this.maxSpeedY = 2*pow(this.size, 0.5)
	this.lifeTime = 180

	// radius of snowflake spiral
	// chosen so the snowflakes are uniformly spread out in area
	this.radius = sqrt(random(pow(width / 2, 2)))

	this.update = function(time) {
		// x position follows a circle
		let w = 0.6 // angular speed
		let angle = w * time + this.initialangle
		this.posX = width/2 + this.radius * sin(angle)

		// different size snowflakes fall at slightly different y speeds
		this.posY += this.speedY
		if(this.speedY < this.maxSpeedY){
			this.speedY = min(this.speedY + gravity, this.maxSpeedY)
		}

		// delete snowflake if past end of screen
		if (this.posY > height + 10 || this.posY < -10 || this.lifeTime < 0) {
			let index = snowflakes.indexOf(this)
			snowflakes.splice(index, 1)
		}
		this.lifeTime -= 1
	};

	this.bounce = function(power) {
		this.speedY -= 2+power*15
	}

	this.display = function() {
		ellipse(this.posX, this.posY, this.size)
	};
}

function drawGradient(x, y, radius, hue) {
  for (var r = radius; r > 0; --r) {
    fill(hue, 90, 90);
    ellipse(x, y, r, r);
    hue = (hue + 1) % 360;
  }
}

function drawSpeakers(){

	speakers = 10
	for(var i = 0; i < speakers; ++i){
		var energy = fft.getEnergy(lower_freqs[i], upper_freqs[i])

		image(speaker, i*width/speakers, height-(30*(1+energy/255)), width/speakers, 50)
	}
	scale(2)
}

//https://p5js.org/examples/simulate-snowflakes.html
//https://p5js.org/examples/color-radial-gradient.html
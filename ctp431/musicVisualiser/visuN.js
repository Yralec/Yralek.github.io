var log44100 = Math.log(44100)
var gradientCircles = []
var particleArray = []
var radialGradients = []
var alphaVal = 0.2
var rms = 0;
var t = 0
var frames = 0
var particleColoringCooldown = 30

var pause = false

/*function mousePressed(){
	if(song.isPlaying()){
		song.pause()
		pause = true
	} else{
		song.play()
		pause = false
	}
}*/

function preload(){
	song = loadSound("song.mp3")
}

function setup() {
	song.play()
	var canvas = createCanvas(640, 640);
	canvas.parent("canvasContainer")
	background(0, 0, 0)

	amp = new p5.Amplitude()
	fft = new p5.FFT()
}

var power = 0
var oldPower = 0

function draw() {
	if (!pause) {

		var rms = amp.getLevel()
		var db = 20.0*Math.log10(rms);
		power = 70 + db

		background('rgba(0,0,0,'+alphaVal+')')

		particles()
		if(power - oldPower > 0.1){
			particleColoring()
			particleColoring()
		}
		if(frames > 180){	//3 seconds and look to change
			incrementDisplayOnBeat()
		} else{
			++frames
		}
		oldPower = power
	}
}

function particles(){
	push()
	t = frameCount/60

	rms = amp.getLevel()

	for (let particle of particleArray) {
		   particle.bounce(rms)
	}


	for (var i = 0; i < random(Math.round(rms*5)); i++) {
		particleArray.push(new particle())
	}

	translate(width/2, height/2)
	noStroke()
	var c = color("white")
	fill(c)
	for (let particle of particleArray) {
	    particle.update(t)
	    particle.display()
	}
	pop()
}

function particleColoring(){
	var centroid = fft.getCentroid()

	particleColoringCooldown = 30
	colorMode(HSB)

	var index = random(10)
	var startAngle = (2*PI*index/10)%(2*PI)
	var endAngle = (2*PI*(index+1)/10)%(2*PI)
	var c = color(index*36, 80, 80)

	for(let particle of particleArray){
		if(particle.initialangle > startAngle && particle.initialangle < endAngle){
			particle.colour = c
		}
	}
}

var gravity = -1
var display = 16
var displayModes = 18

function particle(){

	this.radius = 0
	this.initialangle = random(0, 2 * PI)
	this.size = random(2, 5)
	this.speed = pow(this.size, 0.5)
	this.maxSpeed = -2*pow(this.size, 0.5)
	this.lifeTime = 60
	this.minRadius = 25
	this.maxRadius = 0.8*width/2
	this.colour = color('white')
	this.displayNum = display
}

	particle.prototype.update = function(time) {


		this.speed = Math.max(this.speed + gravity, this.maxSpeed)
		if(this.radius == this.minRadius && this.speed < 0){
			this.speed = 0
		} else if(this.radius == this.maxRadius && this.speed > 0){
			this.speed = 0
		}

		this.radius = Math.min(this.maxRadius, Math.max(this.radius + this.speed, this.minRadius))

		if (this.lifeTime < 0) {
			let index = particleArray.indexOf(this)
			particleArray.splice(index, 1)
		}
		this.lifeTime -= 1
	};

	particle.prototype.bounce = function(strength) {
			if(power - oldPower > 0){
				this.speed += power/10 //*strength
			}
	}

	particle.prototype.display = function(){
		switch (this.displayNum){
			case 0:
			case 1:
			case 2:
			case 3:
				this.displayOutwardsCircle()
				break
			case 4:
			case 5:
			case 6:
			case 7:
				this.displayInwardsCircle()
				break
			case 8:
				this.displayHorizontalUp()
				break
			case 9:
				this.displayHorizontalDown()
				break
			case 10:
				this.displayVerticalLeft()
				break
			case 11:
				this.displayVerticalRight()
				break
			case 12:
			case 13:
			case 14:
				this.displayRotationClockWise()
				break
			case 15:
			case 16:
			case 17:
				this.displayRotationAntiClockWise()
				break
		}
	}

	particle.prototype.displayInwardsCircle = function() {
		fill(this.colour)
		var posX = (this.maxRadius - this.radius) * cos(this.initialangle)
		var posY = (this.maxRadius - this.radius) * sin(this.initialangle)
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayOutwardsCircle = function() {
		fill(this.colour)
		var posX = this.radius * cos(this.initialangle)
		var posY = this.radius * sin(this.initialangle)
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayRotationClockWise = function() {
		fill(this.colour)
		var posX = this.maxRadius*this.initialangle/(2*PI) * cos(2*PI*this.radius/this.maxRadius + 2*PI*frameCount/60)
		var posY = this.maxRadius*this.initialangle/(2*PI) * sin(2*PI*this.radius/this.maxRadius + 2*PI*frameCount/60)
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayRotationAntiClockWise = function() {
		fill(this.colour)
		var posX = this.maxRadius*this.initialangle/(2*PI) * cos(-2*PI*this.radius/this.maxRadius - 2*PI*frameCount/60)
		var posY = this.maxRadius*this.initialangle/(2*PI) * sin(-2*PI*this.radius/this.maxRadius - 2*PI*frameCount/60)
		ellipse(posX, posY, this.size)
	};


	particle.prototype.displayHorizontalDown = function() {
		fill(this.colour)
		var posX = -width/2 + this.initialangle*width/(2*PI)
		var posY = -height/2 + this.radius*height/this.maxRadius
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayHorizontalUp = function() {
		fill(this.colour)
		var posX = -width/2 + this.initialangle*width/(2*PI)
		var posY = height/2 - this.radius*height/this.maxRadius
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayVerticalLeft = function() {
		fill(this.colour)
		var posY = -height/2 + this.initialangle*height/(2*PI)
		var posX = width/2 - this.radius*width/this.maxRadius
		ellipse(posX, posY, this.size)
	};

	particle.prototype.displayVerticalRight = function() {
		fill(this.colour)
		var posY = -height/2 + this.initialangle*height/(2*PI)
		var posX = -width/2 + this.radius*width/this.maxRadius
		ellipse(posX, posY, this.size)
	};




function incrementDisplayOnBeat(){
	/*if(power - oldPower > 0.15){
		display = Math.floor(random(displayModes))
		frames = 0
	}*/
}
var notes = []
var leftLineGeometries = []
var rightLineGeometries = []
var limits = [-0.15, 0.15]
var limitsY = [0.1, 0.2]
var leftDown = [false, false, false]
var rightDown = [false, false, false]
var noteOnDistance = 0.02
var noteOffDistance = 0.04
var currentMelodyNote = 0
var currentMelodyFinger = 0 //0 index, 1 middle, 2 ring
var info = document.getElementById('info')
var melody = [1,2,3,6,7,9,10]
var melody2 = [0,2,4,5,8,9,11]
var chordMelody = [[-3,-1,0,2,4],[-5,-3,-1,0,2],[-7,-5,-3,-1,0],[-8,-7,-4,-3,-1]]
var currentChord = 0
var chords2 = [[-3,0,4,0],[-5,-1,2,-1],[-7,-3,0,-3],[-8,-4,-1,-4]]	//['a','G','F','E']
var volLeftBounds = [0.05,0.2]
var volLeft = 0.25
var volRight = 0.5
// Set up plugins

function setup3D(){
	Leap.loop({
		background: true
	})
	.use('transform', {
		vr: 'desktop' // Switch to meters.
	})
	.use('boneHand', {
		targetEl: document.body,
		jointColor: new THREE.Color(0xffffff),
		rendererOps: {
			antialias: true
		}
	})
	.use('proximity')

	Leap.loopController.on('frame', function(frame){

	    if (!frame.hands.length > 0) return;


	    var hands = frame.hands
	    for(var i = 0; i < 1; ++i){
		    var hand = hands[0]
		    if(!hand){return}
			leftHand(hand)
			var hand = hands[1]
			if(!hand){return}
			rightHand(hand)
		}
	})

	// Set up scene

	var scene = Leap.loopController.plugins.boneHand.scene;
	var camera = Leap.loopController.plugins.boneHand.camera;
	var renderer = Leap.loopController.plugins.boneHand.renderer;
	camera.position.set(0, 0.3, 0.6);

	var controls = new THREE.OrbitControls(camera);
	var axisHelper = new THREE.AxisHelper(0.1);
	scene.add(axisHelper);


	var base = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshPhongMaterial({
		color: 0x222222
	}));
	base.position.set(0, 0, 0);
	base.rotateX(Math.PI * -0.5);

	scene.add(base);


	var board = createColouredScale(scene)
		for(var i = 0; i < 3; ++i){
			leftLineGeometries[i] = new THREE.Geometry()
			leftLineGeometries[i].vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -10 ) );
			addLine(leftLineGeometries[i])
			rightLineGeometries[i] = new THREE.Geometry()
			rightLineGeometries[i].vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -10 ) );
			addLine(rightLineGeometries[i])
		}
}


function createColouredScale(base){
	var d = limits[1] - limits[0]
	var max = 4
	for(var i = 0; i < max; ++i){
		var geometry = new THREE.PlaneGeometry(1 * d/max,0.2,max)
		var material = new THREE.MeshBasicMaterial({color: new THREE.Color().setHSL(i/max,0.8,0.5), side: THREE.DoubleSide})
		var plane = new THREE.Mesh(geometry, material)
		plane.translateX(limits[0] + d*i/(max-1))
		base.add(plane)
	}
	return plane
}

function addLine(geo){
	var line = new THREE.Line(geo, new THREE.LineBasicMaterial({color: 0x0000ff}))
	scene.add(line)
}

function positionToMidi(position){
	var d = (limits[1] - limits[0])
	if(position < limits[0]){
		position = limits[0]
	} else if(position > limits[1]){
		position = limits[1]
	}
	return 60 + (position - limits[0])/d * 12
}

function positionToChord(position){
	var d = (limits[1] - limits[0])
	if(position < limits[0]){
		position = limits[0]
	} else if(position > limits[1]){
		position = limits[1]
	}
	var chord = Math.floor((position - limits[0])/d * 4)
	if(chord >= 4){
		chord = 3
	}
	return chord
}



function leftHand(hand){
	var thumbTip = new THREE.Vector3().fromArray(hand.thumb.tipPosition)
	leftLineGeometries[0].vertices[0].fromArray(hand.indexFinger.tipPosition)
	leftLineGeometries[0].vertices[1] = thumbTip
	leftLineGeometries[0].verticesNeedUpdate = true
	leftLineGeometries[1].vertices[0].fromArray(hand.middleFinger.tipPosition)
	leftLineGeometries[1].vertices[1] = thumbTip
	leftLineGeometries[1].verticesNeedUpdate = true
	leftLineGeometries[2].vertices[0].fromArray(hand.ringFinger.tipPosition)
	leftLineGeometries[2].vertices[1] = thumbTip
	leftLineGeometries[2].verticesNeedUpdate = true

	var d1 = leftLineGeometries[0].vertices[0].distanceTo(leftLineGeometries[0].vertices[1])
	var d2 = leftLineGeometries[1].vertices[0].distanceTo(leftLineGeometries[1].vertices[1])
	var d3 = leftLineGeometries[2].vertices[0].distanceTo(leftLineGeometries[2].vertices[1])

	leftThumbY = thumbTip.y
	var chord = positionToChord(thumbTip.x)
	currentChord = chord
	if(!leftDown[0] && d1 < noteOnDistance ){
		leftHandOn(0)
	} else if(leftDown[0] && d1 > noteOffDistance){
		leftHandOff(0)
	}
}

function leftHandOn(f){
	leftDown[f] = true
	playLeft(currentChord, f)
}

function leftHandOff(f){
	leftDown[f] = false
}

function playLeft(chord, pos){
	playChord(chord, pos, 0)
}

function playChord(chord, finger, pos){
	keyDown(60+chords2[chord][pos], volLeft)
	if(leftDown[finger] == true){
		setTimeout(()=>{
			if(leftDown[finger] == true){
				playChord(chord, finger, (pos+1)%4)
			}
		}, arpeggioToMs(leftThumbY))
	}
}

function rightHand(hand){
	var thumbTip = new THREE.Vector3().fromArray(hand.thumb.tipPosition)
	rightLineGeometries[0].vertices[0].fromArray(hand.indexFinger.tipPosition)
	rightLineGeometries[0].vertices[1] = thumbTip
	rightLineGeometries[0].verticesNeedUpdate = true
	rightLineGeometries[1].vertices[0].fromArray(hand.middleFinger.tipPosition)
	rightLineGeometries[1].vertices[1] = thumbTip
	rightLineGeometries[1].verticesNeedUpdate = true
	rightLineGeometries[2].vertices[0].fromArray(hand.ringFinger.tipPosition)
	rightLineGeometries[2].vertices[1] = thumbTip
	rightLineGeometries[2].verticesNeedUpdate = true

	var d1 = rightLineGeometries[0].vertices[0].distanceTo(rightLineGeometries[0].vertices[1])
	var d2 = rightLineGeometries[1].vertices[0].distanceTo(rightLineGeometries[1].vertices[1])
	var d3 = rightLineGeometries[2].vertices[0].distanceTo(rightLineGeometries[2].vertices[1])

	if(!rightDown[0] && d1 < noteOnDistance ){
		rightHandOn(0)
	} else if(rightDown[0] && d1 > noteOffDistance){
		rightHandOff(0)
	}
	if(!rightDown[1] && d2 < noteOnDistance){
		rightHandOn(1)
	} else if(rightDown[1] && d2 > noteOffDistance){
		rightHandOff(1)
	}
	if(!rightDown[2] && d3 < noteOnDistance){
		rightHandOn(2)
	} else if(rightDown[2] && d3 > noteOffDistance){
		rightHandOff(2)
	}
}

function rightHandOn(f){
	currentMelodyNote = fingerNoteMapping(currentMelodyFinger, currentMelodyNote, f)
	currentMelodyFinger = f
	keyDown(melodyToNote(currentMelodyNote))
	rightDown[f] = true
	console.log(currentMelodyNote)
}

function rightHandOff(f){
	rightDown[f] = false
}

function melodyToNote(x){
	console.log("c "+currentChord+", x "+x)
	return 60 + chordMelody[currentChord][x]//12*Math.floor(x/7) +  (x%7+7)%7]
}

function arpeggioToMs(y){
	if( y > limitsY[1]){
		y = limitsY[1]
	} else if(y < limitsY[0]){
		y = limitsY[0]
	}
	var ms = Math.round(500 - (y-limitsY[0])* 10 * 400)
	return ms
}


//p5
function setup(){
	createCanvas(720, 400)
	noStroke();
	colorMode(HSB, 1, 1, 1)
	max = 4
	for(var i = 0; i < max; ++i){
		fill(color(i/max,0.8,0.5))
		rect(i*width/max, 0, width/4, height)
	}
	return plane
}

function draw(){
	var chord = Math.floor(mouseX*4/width)
	if(chord >= 4){
		chord = 3
	} else if(chord < 0){
		chord = 0
	}
	currentChord = chord

	leftThumbY = limitsY[0] + (height - mouseY)/height * (limitsY[1]-limitsY[0])
}

function mousePressed(){

	fill(color(currentChord/max,0.8,0.8))
	pressedChord = currentChord
	rect(currentChord*width/max, 0, width/4, height)
	leftHandOn(0)
}

function mouseReleased(){
	fill(color(pressedChord/max,0.8,0.5))
	rect(pressedChord*width/max, 0, width/4, height)
	leftHandOff(0)
}

function keyPressed(){
	if(key == 'a'){
		rightHandOn(0)
	} else if(key == 's'){
		rightHandOn(1)
	} else if(key == 'd'){
		rightHandOn(2)
	}
}

function keyReleased(){
	if(key == 'a'){
		rightHandOff(0)
	} else if(key == 's'){
		rightHandOff(1)
	} else if(key == 'd'){
		rightHandOff(2)
	}
}

//setup3D()
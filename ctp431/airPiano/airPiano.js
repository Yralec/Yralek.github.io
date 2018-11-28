var notes = []
var leftLineGeometries = []
var rightLineGeometries = []
var limits = [-0.15, 0.15]
var leftDown = [false, false, false]
var rightDown = [false, false, false]
var noteOnDistance = 0.02
var noteOffDistance = 0.04
var currentMelodyNote = 0
var currentMelodyFinger = 0 //0 index, 1 middle, 2 ring
var info = document.getElementById('info')
var melody = [1,2,3,6,7,9,10]
// Set up plugins

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


function setup(){
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
	for(var i = 0; i < 12; ++i){
		var geometry = new THREE.PlaneGeometry(1 * d/12,0.2,12)
		var material = new THREE.MeshBasicMaterial({color: new THREE.Color().setHSL(i/12,0.8,0.5), side: THREE.DoubleSide})
		var plane = new THREE.Mesh(geometry, material)
		plane.translateX(limits[0] + d*i/11)
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

setup()



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

	//console.log(thumbTip)
	//console.log(d1+" "+d2+" "+d3)
	var midi = positionToMidi(thumbTip.x)
	info.innerHTML = Tone.Frequency(midi, "midi").toNote()
	if(!leftDown[0] && d1 < noteOnDistance ){
		playLeftIndex(midi)
		leftDown[0] = true
	} else if(leftDown[0] && d1 > noteOffDistance){
		leftDown[0] = false
	}
	if(!leftDown[1] && d2 < noteOnDistance){
		playLeftMiddle(midi)
		leftDown[1] = true
	} else if(leftDown[1] && d2 > noteOffDistance){
		leftDown[1] = false
	}
	if(!leftDown[2] && d3 < noteOnDistance){
		playLeftRing(midi)
		leftDown[2] = true
	} else if(leftDown[2] && d3 > noteOffDistance){
		leftDown[2] = false
	}
}

function playLeftIndex(midi){
	keyDown(midi)
}
function playLeftMiddle(midi){
	keyDown(midi+4)
}
function playLeftRing(midi){
	keyDown(midi+7)
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
		playRight(-1,-1,-7, 0)
		rightDown[0] = true
	} else if(rightDown[0] && d1 > noteOffDistance){
		rightDown[0] = false
	}
	if(!rightDown[1] && d2 < noteOnDistance){
		playRight(+1,0,-1, 1)
		rightDown[1] = true
	} else if(rightDown[1] && d2 > noteOffDistance){
		rightDown[1] = false
	}
	if(!rightDown[2] && d3 < noteOnDistance){
		playRight(7,1,1, 2)
		rightDown[2] = true
	} else if(rightDown[2] && d3 > noteOffDistance){
		rightDown[2] = false
	}
}

function playRight(x,y,z, f){
	if(currentMelodyFinger == 0){
		currentMelodyNote+=x
		keyDown(melodyToNote(currentMelodyNote))
	} else if(currentMelodyFinger == 1){
		currentMelodyNote+=y
		keyDown(melodyToNote(currentMelodyNote))
	} else{
		currentMelodyNote+=z
		keyDown(melodyToNote(currentMelodyNote))
	}
	currentMelodyFinger = f
}

function melodyToNote(x){
	return 60 + 12*Math.floor(x/7) + melody[(x%7+7)%7]
}

document.addEventListener('keydown', (e)=>{
	if(e.key == 'a'){
		playRight(-1,-1,-7, 0)
	} else if(e.key == 's'){
		playRight(1,0,-1, 1)
	} else if(e.key == 'd'){
		playRight(7,1,1, 2)
	}
})
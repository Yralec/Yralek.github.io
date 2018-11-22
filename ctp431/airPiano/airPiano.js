//emitter.setMaxListeners(50)

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
	.use('proximity');


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

//createScale(3)
createScale(4)
//createScale(5)

scene.add(base);

function createScale(scale){
	var s = 69+(scale-4)*12
	createWhitePianoNote(s)
	createBlackPianoNote(s+1)
	createWhitePianoNote(s+2)
	createBlackPianoNote(s+3)
	createWhitePianoNote(s+4)
	createWhitePianoNote(s+5)
	createBlackPianoNote(s+6)
	createWhitePianoNote(s+7)
	createBlackPianoNote(s+8)
	createWhitePianoNote(s+9)
	createBlackPianoNote(s+10)
	createWhitePianoNote(s+11)
}

function createNote(midiNote, w, h, color){
	var planeGeo = new THREE.PlaneGeometry(w, h);
	var material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		color: new THREE.Color(color)
	});
	var buttonMesh = new THREE.Mesh(planeGeo, material);
	var iPlane = new InteractablePlane(buttonMesh, Leap.loopController)
	iPlane.note_ = midiNote
	iPlane.on('touch', function() {
			play(this.note_)})
		.on('release', function() {
			release(this.note_)})
	var squareButton = new PushButton(
		iPlane,
		{
			locking: false,
			longThrow: -0.01
		}

	)
	return {squareButton, buttonMesh}
}

function createWhitePianoNote(midiNote){

	var {squareButton, buttonMesh} = createNote(midiNote, 0.028, 0.1, 'white')

	var pos = getWhitePos(midiNote)
	if(pos == -1){
		return null
	} else{
		buttonMesh.position.set(0.03*(pos), 0.02, 0.1);
		squareButton.plane.resetPosition(); // resets the original position, etc to the current one
		base.add(buttonMesh);
		return squareButton
	}
}
function createBlackPianoNote(midiNote){

	var {squareButton, buttonMesh} = createNote(midiNote, 0.015, 0.1, 'black')

	var pos = getBlackPos(midiNote)
	if(pos == -1){
		return
	} else{
		buttonMesh.position.set(-0.015 + 0.03*(pos), 0.06, 0.106);
		squareButton.plane.resetPosition(); // resets the original position, etc to the current one
		base.add(buttonMesh);
		return squareButton
	}
}

function getWhitePos(midiNote){
	var x = (((midiNote - 69) % 12) +12)%12
	var pos = 0
	switch (x){
		case 0:
			pos = 0
			break;
		case 2:
			pos = 1
			break;
		case 4:
			pos = 2
			break;
		case 5:
			pos = 3
			break;
		case 7:
			pos = 4
			break;
		case 9:
			pos = 5
			break;
		case 11:
			pos = 6
			break;
		default:
			console.error("ERR incorrect white note midi")
			pos = -1
			break;
	}
	return pos
}
function getBlackPos(midiNote){
	var x = (((midiNote - 69) % 12) +12)%12
	var pos = 0
	switch (x){
		case 1:
			pos = 1
			break;
		case 3:
			pos = 2
			break;
		case 6:
			pos = 4
			break;
		case 8:
			pos = 5
			break;
		case 10:
			pos = 6
			break;
		default:
			console.error("ERR incorrect black note midi")
			pos = -1
			break;
	}
	return pos
}
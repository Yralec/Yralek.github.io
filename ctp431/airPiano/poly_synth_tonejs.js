var synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();

// one octave up
synth.set("detune", 0);

synth.set({
	oscillator:{
		type:"square"
	},
	filter:{
		Q:6,
		type:"lowpass",
		frequency: 1000,
		rolloff:-24
	},
	filterEnvelope:{
		attack:0,
		decay:1,
		sustain:1.0,
		release:0.0001,
		baseFrequency: 1000,
		octaves:0
	},
	envelope:{
		attack:0.0,
		decay:0,
		sustain:1,
		release:0.3
	}
});

function midi2freq(midi_note_num) {
	var freq = 440.0*Math.pow(2.0,(midi_note_num-69)/12)
	return freq
}

// Qwerty-Hancock note on/off handlers
function keyDown(midi_note_num) {
	synth.triggerAttack(midi2freq(midi_note_num), undefined, 0.5);
};

function keyUp(midi_note_num) {
	synth.triggerRelease(midi2freq(midi_note_num));
};

function majorChordDown(midi_note_num){
	keyDown(midi_note_num)
	keyDown(midi_note_num+4)
	keyDown(midi_note_num+7)
}

function majorChordUp(midi_note_num){
	keyUp(midi_note_num)
	keyUp(midi_note_num+4)
	keyUp(midi_note_num+7)
}

function minorChordDown(midi_note_num){
	keyDown(midi_note_num)
	keyDown(midi_note_num+3)
	keyDown(midi_note_num+7)
}

function minorChordUp(midi_note_num){
	keyUp(midi_note_num)
	keyUp(midi_note_num+3)
	keyUp(midi_note_num+7)
}

function pianoDown(midi_note_num){

}

function play(midi_note_num){
	keyDown(midi_note_num)
}

function release(midi_note_num){
	keyUp(midi_note_num)
}





















function createScale(scale) {
	var s = 69 + (scale - 4) * 12
	createWhitePianoNote(s)
	createBlackPianoNote(s + 1)
	createWhitePianoNote(s + 2)
	createBlackPianoNote(s + 3)
	createWhitePianoNote(s + 4)
	createWhitePianoNote(s + 5)
	createBlackPianoNote(s + 6)
	createWhitePianoNote(s + 7)
	createBlackPianoNote(s + 8)
	createWhitePianoNote(s + 9)
	createBlackPianoNote(s + 10)
	createWhitePianoNote(s + 11)
}

function createNote(midiNote, w, h, color) {

	var planeGeo = new THREE.PlaneGeometry(w, h);
	var material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		color: new THREE.Color(color)
	});
	var buttonMesh = new THREE.Mesh(planeGeo, material);
	var iPlane = new InteractablePlane(buttonMesh, Leap.loopController)
	iPlane.note_ = midiNote
	iPlane.on('touch', function() {
			play(this.note_)
		})
		.on('release', function() {
			release(this.note_)
		})
	var squareButton = new PushButton(
		iPlane, {
			locking: false,
			longThrow: -0.01
		}

	)

	var newNote = new Note(squareButton, proximity)

	notes.push(newNote)

	return {
		squareButton,
		buttonMesh
	}
}

function createWhitePianoNote(midiNote) {

	var {
		squareButton,
		buttonMesh
	} = createNote(midiNote, 0.028, 0.1, 'white')

	var pos = getWhitePos(midiNote)
	if (pos == -1) {
		return null
	} else {
		buttonMesh.position.set(0.03 * (pos), 0.02, 0.1);
		squareButton.plane.resetPosition(); // resets the original position, etc to the current one
		base.add(buttonMesh);
		return squareButton
	}
}

function createBlackPianoNote(midiNote) {

	var {
		squareButton,
		buttonMesh
	} = createNote(midiNote, 0.015, 0.1, 'black')

	var pos = getBlackPos(midiNote)
	if (pos == -1) {
		return
	} else {
		buttonMesh.position.set(-0.015 + 0.03 * (pos), 0.06, 0.106);
		squareButton.plane.resetPosition(); // resets the original position, etc to the current one
		base.add(buttonMesh);
		return squareButton
	}
}

/**
 * Coverts 0-11 to 0-6 mapping the halfnotes from C to the corresponding white key
 * @param  {int} midiNote
 * @return {int} position
 */
function getWhitePos(midiNote) {
	var x = (((midiNote - 69) % 12) + 12) % 12
	var pos = 0
	switch (x) {
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

/**
 * Coverts 0-11 to 1-6 mapping the halfnotes from C to the corresponding black key
 * @param  {int} midiNote
 * @return {int} position
 */
function getBlackPos(midiNote) {
	var x = (((midiNote - 69) % 12) + 12) % 12
	var pos = 0
	switch (x) {
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

function note(button, proximity) {
	this.button = button
	this.proximity = proximity
}










function playRightIndex(){
	if(currentMelodyFinger == 0){
		keyDown(melodyToNote(--currentMelodyNote))	//x-1
	} else if(currentMelodyFinger == 1){
		keyDown(melodyToNote(--currentMelodyNote))	//x-1
	} else{
		currentMelodyNote-=2
		keyDown(melodyToNote(currentMelodyNote))	//x-2
	}
	currentMelodyFinger = 0
	console.log(1)
}
function playRightMiddle(){
	if(currentMelodyFinger == 0){
		keyDown(melodyToNote(++currentMelodyNote))	//x+1
	} else if(currentMelodyFinger == 1){
		keyDown(melodyToNote(currentMelodyNote))	//x
	} else{
		keyDown(melodyToNote(--currentMelodyNote))	//x-1
	}
	currentMelodyFinger = 1
	console.log(2)
}
function playRightRing(){
	if(currentMelodyFinger == 0){
		currentMelodyNote+=2
		keyDown(melodyToNote(currentMelodyNote))	//x+2
	} else if(currentMelodyFinger == 1){
		keyDown(melodyToNote(++currentMelodyNote))	//x+1
	} else{
		keyDown(melodyToNote(++currentMelodyNote))	//x+1
	}
	currentMelodyFinger = 2
	console.log(3)
}

var GlitchConfig = function() {
	try { this.data = JSON.parse(localStorage.getItem('glitchconfig')); } catch(ex) {};
	if (!this.data) this.data = {};
	this.listeners = [];

	this.data = {
		channels: [
			{
				target: '1',
				midikey1: 36, // C
				midikey2: 37, // C#
				midikey3: 37, // C#
				midicc1: 2,
				midicc2: 23,
				midicc3: 14,
				key1: 'Q',
				key2: 'A',
				key3: 'Z',
			},
			{
				target: '3',
				midikey1: 38, // D
				midikey2: 37, // D#
				midikey3: 37, // D#
				midicc1: 3,
				midicc2: 24,
				midicc3: 15,
				key1: 'W',
				key2: 'S',
				key3: 'X',
			},
			{
				target: '4',
				midikey1: 40, // E
				midikey2: 40, // E
				midikey3: 40, // E
				midicc1: 4,
				midicc2: 25,
				midicc3: 16,
				key1: 'E',
				key2: 'D',
				key3: 'C',
			},
			{
				target: '',
				midikey1: 41, // F
				midikey2: 42, // F#
				midikey3: 42, // F#
				midicc1: 5,
				midicc2: 26,
				midicc3: 17,
				key1: 'R',
				key2: 'F',
				key3: 'V',
			},
			{
				target: '',
				midikey1: 43, // F
				midikey2: 44, // F#
				midikey3: 44, // F#
				midicc1: 6,
				midicc2: 27,
				midicc3: 18,
				key1: 'T',
				key2: 'G',
				key3: 'B',
			}
		]
	}
}

GlitchConfig.prototype.addListener = function(callback) {
	this.listeners.push(callback);
}

GlitchConfig.prototype.fireUpdate = function() {
	var _this = this;
	this.listeners.forEach(function(x) {
		x(_this);
	});
}

GlitchConfig.prototype.save = function() {
	localStorage.setItem('glitchconfig', JSON.stringify(this.data));
}

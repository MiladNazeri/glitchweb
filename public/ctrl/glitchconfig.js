
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
				midicc1: 10,
				midicc2: 11,
				midicc3: 12,
				key1: 'Q',
				key2: 'A',
				key3: 'Z',
			},
			{
				target: '3',
				midikey1: 38, // D
				midikey2: 37, // D#
				midikey3: 37, // D#
				midicc1: 20,
				midicc2: 21,
				midicc3: 22,
				key1: 'W',
				key2: 'S',
				key3: 'X',
			},
			{
				target: '4',
				midikey1: 40, // E
				midikey2: 40, // E
				midikey3: 40, // E
				midicc1: 30,
				midicc2: 31,
				midicc3: 32,
				key1: 'E',
				key2: 'D',
				key3: 'C',
			},
			{
				target: '',
				midikey1: 41, // F
				midikey2: 42, // F#
				midikey3: 42, // F#
				midicc1: 40,
				midicc2: 41,
				midicc3: 42,
				key1: 'R',
				key2: 'F',
				key2: 'V',
			},
			{
				target: '',
				midikey1: 43, // F
				midikey2: 44, // F#
				midikey3: 44, // F#
				midicc1: 50,
				midicc2: 51,
				midicc3: 52,
				key1: 'T',
				key2: 'G',
				key2: 'B',
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

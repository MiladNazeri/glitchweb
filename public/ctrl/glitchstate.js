
var GlitchState = function() {
	try { this.data = JSON.parse(localStorage.getItem('glitchstate')); } catch(ex) {};
	if (!this.data) this.data = {};
	this.listeners = [];
	this.data = {
		'devices': [
		],
		'1': {
			a: 33,
			b: 127,
			c: 5,
		},
		'2': {
			a: 123,
			b: 44,
			c: 55,
		},
		'3': {
			a: 33,
			b: 124,
			c: 55,
		},
		'4': {
			a: 33,
			b: 44,
			c: 125,
		}
	}
}

GlitchState.prototype.addListener = function(callback) {
	this.listeners.push(callback);
}

GlitchState.prototype.fireUpdate = function() {
	var _this = this;
	this.listeners.forEach(function(x) {
		x(_this);
	});
}

GlitchState.prototype.save = function() {
	localStorage.setItem('glitchstate', JSON.stringify(this.data));
}

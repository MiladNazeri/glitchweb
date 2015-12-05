var my_id = '';

window.addEventListener('load', function() {

	var socket = io();

	this.id = localStorage.getItem('glitchviewer_id') || '';

	if (location.hash && location.hash != '') {
		this.id = location.hash.toString().substring(1);
	}

	console.log('Previous id: ' + this.id);

	var _this = this;
	this.socket = io();
	this.state = {};

	setTimeout(function() {
		console.log('GlitchSocket: Connected.');
		_this.socket.emit('hello', { id: _this.id });
	}, 1000);

	this.socket.on('welcome', function(data) {
		console.log('GlitchSocket: Got welcome', data);
		if (data.id) {
			console.log('Assigned id ' + data.id);
			localStorage.setItem('glitchviewer_id', data.id);
			_this.id = data.id;
			_this.state = data.state;
			var mystate = _this.state[_this.id] || {};
			document.getElementById('debug').textContent =
				JSON.stringify(mystate) +
				'\n\n' +
				JSON.stringify(_this.state, null, 2);
		}
	});

	this.socket.on('state', function(data) {
		console.log('GlitchSocket: Got state', data);
		_this.state = data.state;
		var mystate = _this.state[_this.id] || {};
		document.getElementById('debug').textContent =
			JSON.stringify(mystate) +
			'\n\n' +
			JSON.stringify(_this.state, null, 2);
	});

});
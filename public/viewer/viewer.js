var my_id = '';

window.addEventListener('load', function() {

	var _this = this;
	this.socket = io();
	this.state = {};
	this.time = 0;
	this.mystate = {};

	var canvas = document.getElementById('full');
	var ctx = canvas.getContext('2d');
	var debug = true;

	var socket = io();

	noise.seed(Math.random());

	function renderFrame() {
		ctx.fillStyle = '#0f0';

		var tt2 = 46 + 40 * Math.cos(_this.mystate.c / 10.0 * _this.time / 2100.0);
		var tt3 = 46 + 40 * Math.cos(_this.mystate.c / 9.0 * _this.time / 1700.0);

		var hdiv = 1 << Math.max(0, Math.floor( 30 * noise.simplex3(30, tt2, _this.time / 958.0)));
		var vdiv = 1 << Math.max(0, Math.floor( 30 * noise.simplex3(tt3, _this.mystate.c, _this.time / 9999)));
// console.log(hdiv, vdiv);
		for(var j=0; j<64; j+=vdiv) {
			for(var i=0; i<64; i+=hdiv) {

			    var value = noise.simplex3(i, j + tt2, Math.round(_this.time * _this.mystate.a / 100.0));
			    // console.log(value);

			    if (value > (1.0 - (_this.mystate.a / 64.0)))
			    	if (debug)
						ctx.fillStyle = '#333';
					else
						ctx.fillStyle = '#fff';
				else
					ctx.fillStyle = '#000';

				ctx.fillRect(i, j, hdiv, vdiv);
			}
		}

		requestAnimationFrame(renderFrame);
	}

	renderFrame();

	this.id = localStorage.getItem('glitchviewer_id') || '';

	if (location.hash && location.hash != '') {
		this.id = location.hash.toString().substring(1);
	}

	console.log('Previous id: ' + this.id);

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
			_this.time = data.state.t;
			_this.mystate = _this.state[_this.id] || {};
			if (debug) {
				document.getElementById('debug').textContent =
					JSON.stringify(_this.mystate) +
					'\n\n' +
					JSON.stringify(_this.state, null, 2);
			}
		}
	});

	this.socket.on('state', function(data) {
		// console.log('GlitchSocket: Got state', JSON.stringify(data));
		_this.state = data.state;
		_this.time = data.state.t;
		_this.mystate = _this.state[_this.id] || {};
		if (debug) {
			document.getElementById('debug').textContent =
				JSON.stringify(_this.mystate) +
				'\n\n' +
				JSON.stringify(_this.state, null, 2);
		}
	});

});
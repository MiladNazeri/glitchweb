var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid');

var password = process.env.GLITCHPASSWORD || 'password';

app.use('/static', express.static(__dirname + '/public'));

var admins = [];
var connections = {};
var laststate = {};
var active_ids = [];

io.on('connection', function(socket) {
  console.log('a user connected');

  var valid = false;
  var admin = false;
  var id = '';

  socket.on('hello', function(data) {
    if (data.admin) {
      if (data.password != password) {
        socket.close();
      } else {
        if (data.id) id = data.id;
        if (id == '') id = uuid.v4().substring(0,8);
        socket.emit('welcome', { id: id, admin: true, state: laststate });
        valid = true;
        admin = true;
        admins.push(socket);
        io.emit('connections', { clients: active_ids });
      }
    } else {
      if (data.id) id = data.id;
      if (id == '') id = uuid.v4().substring(0,8);
      socket.emit('welcome', { id: id, state: laststate });
      valid = true;
      connections[id] = socket;
      var p = active_ids.indexOf(id);
      if (p != -1) {
        active_ids.splice(p, 1);
      }
      active_ids.push(id);
      io.emit('connections', { clients: active_ids });
    }
  });

  socket.on('state', function(data) {
    console.log('got server state', data);
    if (data.state) {
      var change = false;

      Object.keys(data.state).forEach(function(k) {
        var s = data.state[k];
        if (s != laststate[k]) {
          console.log('state \"' + k + '\" changed to \"' + s + '\"');
          laststate[k] = s;
          change = true;
        }
      });

      laststate = data.state;
      if (change) {
        // console.log('current state:', laststate);
        // io.emit('state', { state: laststate });
      }
    }
  });

  socket.on('delta', function(data) {
    console.log('got server state', data);
    if (typeof(data.state_value) !== 'undefined' && typeof(data.state_id) !== 'undefined') {
      var change = false;

      if (typeof(laststate[data.state_id]) == 'undefined') {
        laststate[data.state_id] = {};
        change = true;
      }

      Object.keys(data.state_value).forEach(function(k) {
        var s = data.state_value[k];
        if (s != laststate[k]) {
          console.log('state \"' + k + '\" changed to \"' + s + '\"');
          laststate[data.state_id][k] = s;
          change = true;
        }
      });

      if (change) {
        // console.log('current state:', laststate);
        // io.emit('state', { state: laststate });
      }
    }
  });

  socket.on('disconnect', function() {
      var p = active_ids.indexOf(id);
      if (p != -1) {
        active_ids.splice(p, 1);
      }
    io.emit('connections', { clients: active_ids });
  });
});

var t0 = (new Date()).getTime();

setInterval(function(x) {
  var t1 = (new Date()).getTime();
  var ms = t1 - t0;

  laststate.t = ms;

  console.log('current state:', laststate);
  io.emit('state', { state: laststate });
}, 100);

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
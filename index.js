var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening to requests on port 4000');
});

//Static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
    console.log('made socket connection',socket.id);

    io.emit('connected', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', function(){
        console.log('Disconnected');
        socket.broadcast.emit('leave', socket.username);
        io.emit('connected', Object.keys(io.sockets.connected).length);
    });

    //Handle chat event
    socket.on('joined', function(data){
        socket.username = data;
        socket.broadcast.emit('joined', data);
    });

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        io.sockets.emit('typing', data);
    });
});
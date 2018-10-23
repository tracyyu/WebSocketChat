//Make Connection

var socket = io.connect('http://localhost:4000');

//Query DOM
var message = document.getElementById('message'),
    header = document.getElementById('header'),
    handle = document.getElementById('handle'),
    add = document.getElementById('add'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    onlineCt = document.getElementById('online_ct');

//Timeout
var timeout;

function timeoutFunction(){
    socket.emit('typing', false);
}

//Emit events
add.addEventListener('click', function(){
    socket.emit('joined', handle.value);
    header.innerHTML = '<h1>'+ handle.value +'</h1>';
    message.disabled = false;
    btn.disabled = false;
});

btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
});

message.addEventListener('keyup', function(){
    socket.emit('typing', handle.value);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction,2000);
});

//Listen for events
socket.on('connected', function(data){
    onlineCt.innerHTML = data;
});

socket.on('joined', function(data){
    if(data){
        output.innerHTML += '<p><em>' + data + ' has joined.</em></p>';
    }else{
        output.innerHTML= '';
    }
});

socket.on('leave', function(data){
    if(data){
        output.innerHTML += '<p><em>' + data + ' has left.</em></p>';
    }else{
        output.innerHTML= '';
    }
});

socket.on('chat', function(data){
    feedback.innerHTML="";
    output.innerHTML += '<p><strong>@' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    if(data){
        feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    }else{
        feedback.innerHTML= '';
    }
});
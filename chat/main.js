var http = require('http'),
    fs = require('fs');
 
var app = http.createServer(function (request, response) {
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(8889,'192.168.9.36');
 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
	console.log('before');
	console.log(socket.id);
	
	console.log('afteer');
	
    socket.on('message_to_server', function(data) {
        io.sockets.emit("message_to_client",{ message: data["message"] });
		//this.emit("message_to_client",{ message: data["message"] });
    });
});
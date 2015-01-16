var http = require("http"),
	url = require("url"),
    requestHandlers = require("./requestHandlers");

function start(route,handle) {
var app = http.createServer(function(request,response) {
    var pathname = url.parse(request.url).pathname,
		postData = "";
	    
	

	request.setEncoding("utf8");
	request.on("data", function(postDataChunck) {
	    console.log('post data received');
		postData += postDataChunck;
	});
	request.on("end", function() {
		route(handle,pathname,response,postData,request);
	});
}).listen(8881);

console.log('Server has started');

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
   
   // console.log('logged user' + socket.manager.handshaken[socket.id].query.loggeduser);

    requestHandlers.addSocketInfoToDatabase(socket.handshake.query.loggeduser,socket.id);

    socket.on('message_to_server', function (data) {
        io.sockets.emit("message_to_client", { message: data["message"] });
        //this.emit("message_to_client",{ message: data["message"] });
    });
});
}

exports.start = start;
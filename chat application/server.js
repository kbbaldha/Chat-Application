var http = require("http"),
	url = require("url"),
    requestHandlers = require("./requestHandlers"),
	fs = require("fs");

function start(route,handle) {
    var app = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname,
		postData = "";

        if (request.url.indexOf('.js') != -1) {
            fs.readFile('./' + pathname, function (err, data) {
                if (err) console.log(err);
                else {
                    console.log('/misc/myscript.js: fs.readFile is successful');
                    response.setHeader("Content-Length", data.length);
                    response.setHeader("Content-Type", 'text/javascript');
                    response.statusCode = 200;
                    response.end(data);
                }
            });
        }
        else if (request.url.indexOf('.css') != -1) {
            fs.readFile('./' + pathname, function (err, data) {
                if (err) console.log(err);
                else {
                    console.log('/misc/mystyle.css: fs.readFile is successful');
                    response.setHeader("Content-Length", data.length);
                    response.setHeader("Content-Type", 'text/css');
                    response.statusCode = 200;
                    response.end(data);
                }
            });
        }

        else {
            request.setEncoding("utf8");
            request.on("data", function (postDataChunck) {
                console.log('post data received');
                postData += postDataChunck;
            });
            request.on("end", function () {
                route(handle, pathname, response, postData, request);
            });
        }
    }).listen(8881);

console.log('Server has started');

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {

    // console.log('logged user' + socket.manager.handshaken[socket.id].query.loggeduser);

    requestHandlers.addSocketInfoToDatabase(socket.handshake.query.loggeduser, socket.id,io);

    socket.on('message_to_server', function (data) {
        requestHandlers.sendMessage(data,io);
        //io.sockets.emit("message_to_client", { message: data["message"] });
        //this.emit("message_to_client",{ message: data["message"] });
    });
});
}

exports.start = start;
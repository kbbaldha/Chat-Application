var server = require("./server"),
	router = require("./router"),
	requestHandlers = require("./requestHandlers"),
    url = require("url");

var handle = {};
handle["/"] = requestHandlers.login;
handle["/login"] = requestHandlers.login;
handle["/chat"] = requestHandlers.chat;
handle["/getUser"] = requestHandlers.getUser;
handle["/getUsers"] = requestHandlers.getUsers;

server.start(router.route, handle);
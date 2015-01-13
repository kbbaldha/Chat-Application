var http = require("http"),
	url = require("url");

function start(route,handle) {
http.createServer(function(request,response) {
	var pathname = url.parse(request.url).pathname,
		postData = "";
	console.log("pathname is" + pathname);
	console.log('request received');

	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunck) {
		postData += postDataChunck;
	});
	request.addListener("end", function() {
		route(handle,pathname,response,postData);
	});
}).listen(8887);

console.log('Server has started');
}

exports.start = start;
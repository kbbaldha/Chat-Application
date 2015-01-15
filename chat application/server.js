var http = require("http"),
	url = require("url");

function start(route,handle) {
http.createServer(function(request,response) {
	var pathname = url.parse(request.url).pathname,
		postData = "";

	request.setEncoding("utf8");
	request.addListener("data", function (postDataChunck) {
	    console.log('post data received');
		postData += postDataChunck;
	});
	request.addListener("end", function () {
	    console.log('called from end in server');
		route(handle,pathname,response,postData);
	});
}).listen(8881);

console.log('Server has started');
}

exports.start = start;
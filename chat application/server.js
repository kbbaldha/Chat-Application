var http = require("http"),
	url = require("url");

function start(route,handle) {
http.createServer(function(request,response) {
    var pathname = url.parse(request.url).pathname,
		postData = "";
	    
	

	request.setEncoding("utf8");
	request.on("data", function(postDataChunck) {
		postData += postDataChunck;
	});
	request.on("end", function() {
		route(handle,pathname,response,postData,request);
	});
}).listen(8887);

console.log('Server has started');
}

exports.start = start;
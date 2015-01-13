function route(handle,pathname,response,postData) {
	console.log("routing request to::"+pathname)
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response,postData);
	} else {
		console.log('No such file found');
		response.writeHead(404,{"Content-type":"text/plain"});
		response.write("404 File Not Found");
		response.end();
	}
	
}

exports.route = route;
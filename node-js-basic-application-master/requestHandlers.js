var exec = require("child_process").exec,
	querystring = require("querystring"),
	fs = require("fs"),
	path = require("path");


function start(response,postData) {
	console.log('Request handler for start called');
	/*
	var content = "empty";
	exec("ls -lah",function(error,stdout,stderr) {
		response.writeHead(200,{"Content-type":"text/plain"});
		response.write(stdout);
		console.log("stdout is" + stdout);
		response.write("Hello start");
		response.end();
	});
	*/
	/*
	var body = '<html>'+
				'<head>'+
				'<meta http-equiv="Content-Type" content="text/html; '+
				'charset=UTF-8" />'+
				'</head>'+
				'<body>'+
				'<form action="/upload" method="post">'+
				'<textarea name="text" rows="20" cols="60"></textarea>'+
				'<input type="submit" value="Submit text" />'+
				'</form>'+
				'</body>'+
				'</html>';
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(body);
	response.end();
	*/
	var filename = "form.htm",
		ext = path.extname(filename);
		
	var localPath = "./";
	var validExtensions = {
		".html" : "text/html",			
		".htm" : "text/html",			
		".js": "application/javascript", 
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png"
	};
	var isValidExt = validExtensions[ext];
 
	if (isValidExt) {
	localPath += filename;
		path.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, response, validExtensions[ext]);
			} else {
				console.log("File not found: " + localPath);
				response.writeHead(404);
				response.end();
			}
		});
 
	} else {
		console.log("Invalid file extension detected: " + ext)
	}

}

function getFile(localPath,response,ext) {
	fs.readFile(localPath, function (err,contents) {
		if (!err) {
			response.setHeader("Content-Length",contents.length);
			response.setHeader("Content-Type",ext);
			response.statusCode = 200;
			response.end(contents);
		} else {
			response.writeHead(500);
			response.end();
		}
	});
}

function upload(response,postData) {
	console.log('Request handler for upload called');
	response.writeHead(200,{"Content-type":"text/plain"});
	response.write("You had sent:" +querystring.parse(postData).text);
	response.end();
}

exports.start = start;
exports.upload = upload;
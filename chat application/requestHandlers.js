var exec = require("child_process").exec,
	querystring = require("querystring"),
	fs = require("fs"),
	path = require("path"),
   // http = require('http'),
   mysql = require("mysql"),
    connection = mysql.createConnection({
        user: "root",
        password: "",
        database: "chat_db"
    });

function login(response, postData) {
    console.log('Request handler for login called');
    console.log('postdata is' + postData);
	if (postData === null || postData === undefined || postData === "") {
	    var filename = "login.htm",
            ext = path.extname(filename);

	    var localPath = "./";
	    var validExtensions = {
	        ".html": "text/html",
	        ".htm": "text/html",
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
	        path.exists(localPath, function (exists) {
	            if (exists) {
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
	else {
	    console.log(postData);
	    connection.query("SELECT * FROM user_information WHERE user_id = '" + querystring.parse(postData).user_name + "' AND user_pass = '" + querystring.parse(postData).user_pass + "';",
            function (error, rows, fields) {
                
                /*  response.writeHead(200, {
                      "Content-Type": "text/plain",
                      'Access-Control-Allow-Origin' : '*'
                  });*/
                if (rows.length > 0) {
                    console.log('allow to chat');
                    response.statusCode = 302;
                    response.setHeader("Location", "/chat?user=" + rows[0]['user_id']);
                    response.end();

                }
            });
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

function chat(response, postData,request) {
    console.log('chat render');
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });
    /*
    var io = require('socket.io').listen(app);
    console.log('inisde main');
    io.sockets.on('connection', function (socket) {
        //console.log('before');
        //console.log(socket.id);

        //console.log('afteer');

        socket.on('message_to_server', function (data) {
            io.sockets.emit("message_to_client", { message: data["message"] });
            //this.emit("message_to_client",{ message: data["message"] });
        });
    });*/

}


function upload(response,postData) {
	console.log('Request handler for upload called');
	response.writeHead(200,{"Content-type":"text/plain"});
	response.write("You had sent:" +querystring.parse(postData).text);
	response.end();
}

exports.login = login;
exports.chat = chat;
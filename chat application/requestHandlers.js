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
    }),
    userName = "";

function login(response, postData,request) {
    
	if (postData === null || postData === undefined || postData === "") {
	    getFile(response, "login.htm");
	}
	else {
	    console.log(postData);
	    connection.query("SELECT * FROM user_information WHERE user_id = '" + querystring.parse(postData).user_name + "' AND user_pass = '" +                                       querystring.parse(postData).user_pass + "';",
            function (error, rows, fields) {
                if (rows.length > 0) {
                    console.log('allow to chat');
                    userName = rows[0]['user_id'];
                    response.statusCode = 302;
                    response.setHeader("Location", "/chat?user=" + rows[0]['user_id']);
                    response.end();

                }

                else {
                    getFile(response, "invalid_login.html");
                }
            });
	}
	    
}
function getContentType(ext) {
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
    return validExtensions[ext];
}
function getFile(response ,filename) {
    //var filename = "login.htm",
     var ext = path.extname(filename);

    var localPath = "./";
    

    if (getContentType(ext)) {
        localPath += filename;
        path.exists(localPath, function (exists) {
            if (exists) {
                //console.log("Serving file: " + localPath);
                // getFile(localPath, response, validExtensions[ext]);
                fs.readFile(localPath, function (err, contents) {
                    if (!err) {
                        response.setHeader("Content-Length", contents.length);
                        response.setHeader("Content-Type", getContentType(ext));
                        response.statusCode = 200;
                        response.end(contents);
                    } else {
                        response.writeHead(500);
                        response.end();
                    }
                });

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

function chat(response, postData,request) {
    var query = require('url').parse(request.url, true).query;
    console.log(query.user);
    getFile(response, "client.html");
}

function addSocketInfoToDatabase(user,socketid) {
    console.log('----------------user' + user);
    console.log("INSERT INTO user_information (socket_id) values ('" + socketid + "') WHERE user_id = '" + user + "';");
    connection.query("UPDATE user_information SET socket_id = '" + socketid + "' WHERE user_id = '" + user + "';");
}

function upload(response,postData) {
	console.log('Request handler for upload called');
	response.writeHead(200,{"Content-type":"text/plain"});
	response.write("You had sent:" +querystring.parse(postData).text);
	response.end();
}

function getUser(response) {
   
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write(userName);
    response.end();
}
function getUsers(response) {

    response.writeHead(200, { "Content-type": "text/plain" });
    connection.query("SELECT user_id FROM user_information;",
            function (error, rows, fields) {

                response.write(JSON.stringify(rows));
                response.end();
               
            });
    
}

exports.login = login;
exports.chat = chat;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.addSocketInfoToDatabase = addSocketInfoToDatabase;

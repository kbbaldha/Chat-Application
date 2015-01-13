var exec = require("child_process").exec,
	querystring = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	mysql = require("mysql"),
	connection = mysql.createConnection({
		user: "root",
		password: "",
		database: "testdb"
	});
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
	if (postData === null || postData === undefined || postData === "") {
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
	} else {
		console.log('render page');
		upload(response,postData);
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
	
	addToDatabase(postData);
	response.writeHead(200,{"Content-type":"text/html"});
	
	
	response.write("You had sent:" +displayResult(postData));
	response.end();
}
function addToDatabase(postData){
	
	console.log("db add:" + querystring.parse(postData).firstname );
	 connection.query("INSERT INTO user_info (fname,lname,grieviences) values ('" + querystring.parse(postData).firstname + "','" + querystring.parse(postData).lastname+ "','" + querystring.parse(postData).text+"');");
	  //connection.query("INSERT INTO table1 (fname) values (" + querystring.parse(postData).firstname+");"
	  console.log('row inserted');
      
	  /*connection.query('SELECT * FROM table1;', function (error, rows, fields) {

        response.writeHead(200, {
            "Content-Type": "text/plain",
            'Access-Control-Allow-Origin' : '*'
        });
        response.write(JSON.stringify(rows));
		//response.write('keyur');
        response.end();

      });*/
}
function displayResult(postData) {
	var firstNameHtml = '<div class="firstname">FirstName:' + querystring.parse(postData).firstname + '</div>';
	var lastNameHtml = '<div class="lastname">LastName:' + querystring.parse(postData).lastname + '</div>';
	var grievencesHtml = '<div class="grieviences">Your Grieviences:' + querystring.parse(postData).text + '</div>';
	
	var bodyHtml = firstNameHtml + lastNameHtml + grievencesHtml;
	return bodyHtml;
}

function displaySavedData(response,postData){

	var connection = mysql.createConnection({
		user: "root",
		password: "",
		database: "testdb"
	});
	console.log('saved data');
	connection.query('SELECT * FROM user_info;', function (error, rows, fields) {

        response.writeHead(200, {
            "Content-Type": "text/html",
            'Access-Control-Allow-Origin' : '*'
        });
		var i = 0,
		    responseStr = "<table><tr> <th> First Name</th> <th>Last Name </th> <th> Grieviences</th> </tr>";
		
		for(;i<rows.length;i++){
			responseStr += "<tr>" + 
						"<td>" +rows[i]['fname'] + "</td>" + 
						"<td>" +rows[i]['lname'] + "</td>" + 
						"<td>" +rows[i]['grieviences'] + "</td>" + 
						"</tr>";
			
		}
        response.write(responseStr);
		//response.write('keyur');
        response.end();

      });
}

exports.start = start;
exports.upload = upload;
exports.displaySavedData = displaySavedData;
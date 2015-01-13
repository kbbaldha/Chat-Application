var http = require('http'),
   mysql = require("mysql");

var connection = mysql.createConnection({
   user: "root",
   password: "",
  database: "test"
});

http.createServer(function (request, response) {

  //request.on('end', function () {
		
	   connection.query("INSERT INTO table1 (id,fname) values (8,'kbb');");
	   console.log('row inserted');
      connection.query('SELECT * FROM table1;', function (error, rows, fields) {

        response.writeHead(200, {
            "Content-Type": "text/plain",
            'Access-Control-Allow-Origin' : '*'
        });
        response.write(JSON.stringify(rows));
		//response.write('keyur');
        response.end();

      });
   //});

}).listen(8080);
var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser'),
    exec = require("child_process").exec,
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
var cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    sessionStore = new session.MemoryStore();

var COOKIE_SECRET = 'secret';
var COOKIE_NAME = 'sid';
/* GET home page. */

var sess;
router.use(session({
    name: COOKIE_NAME,
    store: sessionStore,
    secret: COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get(['/login','/'], function (req, res, next) {

    var html_dir = './public/';
    res.sendfile(html_dir + 'login.htm');
});

router.post('/login', function (req, res, next) {
   
   

    connection.query("SELECT * FROM user_information WHERE user_id = '" + req.body.user_name + "' AND user_pass = '" + req.body.user_pass + "';",
            function (error, rows, fields) {

                
                if (rows.length > 0) {
                    console.log('allow to chat');
                    sess = req.session;
                    sess.user_name = req.body.user_name;
                    res.redirect('/chat');

                }

                else {
                    var html_dir = './public/';
                    res.sendfile(html_dir + 'invalid_login.html');
                }
            });

        });

router.get('/getUsers', function (req, res, next) {
    connection.query("SELECT user_id,online FROM user_information;",
            function (error, rows, fields) {
                res.send(JSON.stringify(rows));
    });
});
router.get('/chat', function (req, res, next) {
    sess = req.session;


    if (sess.user_name) {
        var html_dir = './public/';
        res.sendfile(html_dir + 'client.html');
    }
    else {
        res.redirect('/login');
    }
   

    //res.sendfile(html_dir + 'login.htm');
});

router.get('/getUser', function (req, res, next) {
     res.send(req.session.user_name); 
});

router.get('/logout', function (req, res, next) {
    console.log('logout');
    req.session.destroy();
    res.send('logout');   
   
});

 function addSocketInfoToDatabase(user, socketid, io) {
    
    connection.query("UPDATE user_information SET socket_id = '" + socketid + "' WHERE user_id = '" + user + "';");
    connection.query("UPDATE user_information SET online = '" + 1 + "' WHERE user_id = '" + user + "';");
    updateOfflineMessages(user, socketid, io);
}
/**
* Updates the offline messages of the user
*/
function updateOfflineMessages(user, socketid, io) {
    connection.query("SELECT * FROM offline_messages WHERE user_id = '" + user + "';", function (error, rows, fields) {
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                if (io.sockets.connected[socketid]) {
                    io.sockets.connected[socketid].emit("message_to_client", { message: rows[i]["message"], clientName: rows[i]["friend_id"] });
                }
            }
        }
    });
    deleteOfflineMessages(user);
}
/**
* Deletes the previously stored offline messages of the passed user
*/
function deleteOfflineMessages(user) {
    connection.query("DELETE FROM offline_messages WHERE user_id = '" + user + "';");
}

function upload(response, postData) {
    console.log('Request handler for upload called');
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("You had sent:" + querystring.parse(postData).text);
    response.end();
}




function sendMessage(data, io) {
    var callback = function (error, rows, fields) {

        
        if (rows.length > 0) {

            var socketid = rows[0]['socket_id'];
            if (io.sockets.connected[socketid]) {
                io.sockets.connected[socketid].emit("message_to_client", { message: data["message"], clientName: data["clientName"] });
            } else {
                // The user if offline store his messages
                console.log("client name is :" + data["clientName"]);
                connection.query("INSERT INTO offline_messages  (user_id,friend_id,message) VALUES ('" + data["friend"] + "','" + data["clientName"] + "','" + data["message"] + "');");

            }

        }

        else {
            console.log('no socket');
        }
    };
    // console.log('------------db query --------------');
    connection.query("SELECT socket_id FROM user_information WHERE user_id = '" + data["friend"] + "';", callback);



}

/**
* Whenever the user is disconnected from the socket this function is called from app.js
* Id is stored inside the passed object as obj.id
*/
function disconnectUser(data,io) {
    connection.query("SELECT user_id FROM user_information WHERE socket_id='" + data.id + "';", function (error, rows, fields) {
        if (rows.length > 0) {
            var user = rows[0]['user_id'];
            console.log(user + "disconnected");
            connection.query("UPDATE user_information SET online = '" + 0 + "' WHERE user_id = '" + user + "';");
            io.sockets.emit("user_offline", { user_id: user });
        } else {
            console.log("unknown user disconnected");
        }
    });
}

function sessionMiddleWare(socket, next) {
    try {
        var data = socket.handshake || socket.request;
        if (!data.headers.cookie) {
            return next(new Error('Missing cookie headers'));
        }
        console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));
        var cookies = cookie.parse(data.headers.cookie);
        console.log('cookies parsed ( %s )', JSON.stringify(cookies));
        if (!cookies[COOKIE_NAME]) {
            return next(new Error('Missing cookie ' + COOKIE_NAME));
        }
        var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
        if (!sid) {
            return next(new Error('Cookie signature is not valid'));
        }
        console.log('session ID ( %s )', sid);
        data.sid = sid;
        sessionStore.get(sid, function (err, session) {
            if (err) return next(err);
            if (!session) return next(new Error('session not found'));
            data.session = session;
            next();
        });
    } catch (err) {
        console.error(err.stack);
        next(new Error('Internal server error'));
    }
}

module.exports = router;
router.addSocketInfoToDatabase = addSocketInfoToDatabase;
router.sendMessage = sendMessage;
router.disconnectUser = disconnectUser;
router.sessionMiddleWare = sessionMiddleWare;
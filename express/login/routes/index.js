var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');

/* GET home page. */
/*
router.get('/login', function(req, res, next) {
    //res.render('index', { title: 'Express' });
 
    var html_dir = './public/';
    res.sendfile(html_dir + 'login.htm');
});

router.post('/login', function (req, res, next) {
    //res.render('index', { title: 'Express' });

    console.log(req.body.user_name);
    var html_dir = './public/';
    //res.sendfile(html_dir + 'login.htm');
});
*/
var sess;
router.use(session({ secret: 'ssshhhhh' }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/login', function (req, res, next) {
    //res.render('index', { title: 'Express' });

    var html_dir = './public/';
    res.sendfile(html_dir + 'login.htm');
});

router.post('/login', function (req, res, next) {
    //res.render('index', { title: 'Express' });

    if (req.body.user_name == 'keyur') {
        sess = req.session;
        sess.user_name = req.body.user_name;
        res.redirect('/chat');

    }
    var html_dir = './public/';
    //res.sendfile(html_dir + 'login.htm');
});
router.get('/chat', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    sess = req.session;

    console.log('chat-----------' + sess.user_name);
    if (sess.user_name) {
        res.end();
    }
    else {
        res.redirect('/login');
    }
    var html_dir = './public/';

    //res.sendfile(html_dir + 'login.htm');
});
module.exports = router;

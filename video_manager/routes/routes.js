// express 
var express = require('express');
var router = express.Router();
var session = require('express-session');

// tools
var path = require('path');


// sub route
router.use('/api/user', require('./user'));
router.use('/api/video', require('./video'));
router.use('/api/videos', require('./videos'));
router.use('/api/tags', require('./tags'));
router.use('/api/tag', require('./tag'));
router.use('/api/videotag', require('./videotag'));

var test_path = path.join(__dirname, '..', 'public', 'pages', 'test.html');
router.get('/test', function(req, res, next){
	res.sendFile(test_path);
})

var index_path = path.join(__dirname, '..', 'public', 'pages', 'index.html');
router.get('/', function(req, res, next){
	res.sendFile(index_path);
})


module.exports = router;

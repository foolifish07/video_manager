// express 
var express = require('express');
var router = express.Router();
var session = require('express-session');

// tools
var path = require('path');

// use session 
router.use(session({
	secret: 'fuck you',
	cookie:{
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: null, 
	},
	resave:true,
	saveUninitialized: true
}));
router.use( function(req, res, next){
	if ( req.session.user ){
		console.log( 'Session: logged' );
		// req.session.user = null;
	}
	else {
		console.log( 'Session: unlogged' );
		// req.session.user = { name: 'hehe' }
	}

	next();
})

// sub route
router.use('/api/user', require('./user'));
router.use('/api/video', require('./video'));
router.use('/api/videos', require('./videos'));
router.use('/api/tags', require('./tags'));
router.use('/api/tag', require('./tag'));
router.use('/api/videotag', require('./videotag'));

var index = path.join(__dirname, '..', 'public', 'pages', 'test.html');
router.get('/', function(req, res, next){
	res.sendFile(index);
})

module.exports = router;

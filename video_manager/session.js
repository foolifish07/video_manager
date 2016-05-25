var Session = require('express-session');

session = Session({
	secret: 'fuck you',
	cookie:{
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: 5*60*60*1000, 
	},
	resave:true,
	saveUninitialized: true
});

module.exports = session;
var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// models
var Tag = require('../mongodb/Tag');
var VideoTag = require('../mongodb/VideoTag');

// session
var session = require('../session');

router.get('/', function(req, res, next){
	var status = {
		success: 'success',
		login_required: 'login_required'
	}

	var user = req.session.user;

	if ( req.param('videoid') ){
		VideoTag.findByVideo(
			req.param('videoid'), 
			function(err, videotags){
				if ( err ) {
					console.log("mongoose : public err")
				}
				else {
					res.json( packed( status.success, videotags) );
				}
			});
	}
	else if ( user ){

		Tag.findByCreator(
			user._id, 
			function(err, tags){
				if ( err ) {
					console.log('mongoose : tag findByCreator err ');
				}
				else {
					res.json( packed(status.success, tags) );
				}
			});
	}
	else res.json( packed(status.login_required,'') );

})


module.exports = router;
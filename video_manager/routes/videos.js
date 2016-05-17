var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// models
var Video = require('../mongodb/Video');
var VideoTag = require('../mongodb/VideoTag');

// session
var session = require('../session');

router.get('/public', function(req, res, next){
	var status = {
		success: 'success',
	}
	Video.findByPublic( 
		function(err, videos){
			if ( err ) {
				console.log("mongoose : public err")
			}
			else {
				res.json( packed( status.success, videos) );
			}
		});
})
router.get('/mine', function(req, res, next){
	var status = {
		success: 'success',
	}
	var user = req.session.user;

	if ( req.param('tagid') ){
		VideoTag.findByTag(
			req.param('tagid'),
			function(err, videos){
				if ( err ){
					console.log("");
				}
				else {
					res.json( packed(status.success, videos) );
				}
			});
	}
	else {
		if ( user ){
			Video.findByCreator(
				user._id, 
				function(err, videos){
					if ( err ) {
						console.log("mongoose : public err")
					}
					else {
						res.json( packed( status.success, videos) );
					}
				})
		}
	}

})

module.exports = router;
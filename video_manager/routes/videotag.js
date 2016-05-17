var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// models
var VideoTag = require('../mongodb/VideoTag');

// session
var session = require('../session');

router.post('/', function(req, res, next){
	var status = {
		success: 'success',
	}

	var user = req.session.user;

	if ( user ){
		var tagid = req.param('tagid');
		var videoid = req.param('videoid');
		if ( tagid && videoid ){
			VideoTag.newOne(
				tagid, videoid,
				function(err, item){
					if ( err ) {
						console.log('mongoose : videotag new error!');
					}
					else{
						res.json( packed(status.success, item) );
					} 
				});
		}
	}
})

router.delete('/', function(req, res, next){
	var status = {
		success: 'success',
	}

	var user = req.session.user;

	if ( user ){
		var id = req.param('id');
		if ( id ){
			VideoTag.removeOneById( 
				id, 
				function(err){
					if ( err ) {
						console.log('mongoose : videotag delete error');
					}
					res.json( packed(status.success, '') );
				})
		}
	}
})

router.get('/', function(req, res, next){
	var status = {
		success: 'success',
	}

	var user = req.session.user;

	if ( user ){
		var videoid = req.param('videoid');

		if (  videoid ){
			VideoTag.findByVideo(
				videoid,
				function(err, list){
					if ( err ) {
						console.log('mongoose : videotag new error!');
					}
					else{
						res.json( packed(status.success, list) );
					} 
				});
		}
	}
})

module.exports = router;
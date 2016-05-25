var router = require('express').Router();

// status 
var status = require('../status').status;
var login_required = require('../status').login_required;

// models
var Video = require('../mongodb/Video');
var VideoTag = require('../mongodb/VideoTag');

// session
var session = require('../session');

router.get('/public', function(req, res, next){

	Video.findByPublic( 
		function(err, videos){
			if ( err ) {
				console.log("mongoose : public err")
			}
			else {
				status.success(res, videos); // return 
			}
		});
})
router.get('/mine', 
	login_required, // return 
	function(req, res, next){

		var user = req.session.user;
		if ( user ){
			Video.findByCreator(
				user._id, 
				function(err, videos){
					if ( err ) {
						console.log("mongoose : public err")
					}
					else {
						status.success(res, videos); // return 
					}
				})
		}

	})

module.exports = router;
var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// models
var Tag = require('../mongodb/Tag');
var VideoTag = require('../mongodb/VideoTag');

var status = require('../status').status;
var login_required = require('../status').login_required;

router.get('/', 
	login_required, // return 
	function(req, res, next){

		var user = req.session.user;
		if ( user ){

			Tag.findByCreator(
				user._id, 
				function(err, tags){
					if ( err ) {
						console.log('mongoose : tag findByCreator err ');
					}
					else {
						status.success(res, tags);
					}
				});
		}

	})


module.exports = router;
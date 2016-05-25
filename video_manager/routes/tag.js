var router = require('express').Router();

var status = require('../status').status;
var login_required = require('../status').login_required;

// models
var Tag = require('../mongodb/Tag');


router.post('/', 
	login_required, // return 
	function(req, res, next){
		var user = req.session.user;

		if ( user ){
			var name = req.param('name');
			if ( name ){
				Tag.newOne(
					name, user._id,
					function(err, tag){
						if ( err ) {
							console.log('mongoose : tag new error!');
						}
						else{
							status.success(res, tag); // return 
						} 
					});
			}
		}
	})

router.delete('/', 
	login_required, // return 
	function(req, res, next){
		var user = req.session.user; 

		if ( user ){
			var tagid = req.param('tagid');
			if ( tagid ){
				Tag.removeOne( 
					tagid, 
					function(err){
						if ( err ) {
							console.log('mongoose : tag delete error');
						}
						status.success(res); // return 
					})
			}
		}
	})

router.patch('/', 
	login_required, // return 
	function(req, res, next){

		var user = req.session.user;
		if ( user ){
			var tagid = req.param('tagid');
			var name = req.param('name');
			
			if ( tagid && name ){
				Tag.updateName(
					tagid, name, 
					function(err, item){
						if ( err ) console.log('mongoose : err');
						else {
							status.success(res, item); // return 
						}
					});
			}
		}
	})

module.exports = router;
var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// models
var Tag = require('../mongodb/Tag');

// session
var session = require('../session');

router.post('/', function(req, res, next){
	var status = {
		success: 'success',
	}
	var user = req.session.user;

	if ( user ){
		var name = req.param('name');
		if ( name ){
			Tag.newOne(
				name, user._id,
				function(err, item){
					if ( err ) {
						console.log('mongoose : tag new error!');
					}
					else{
						res.json( packed(status.success, '') );
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
		var tagid = req.param('tagid');
		if ( tagid ){
			Tag.removeOne( 
				tagid, 
				function(err){
					if ( err ) {
						console.log('mongoose : tag delete error');
					}
					res.json( packed(status.success, '') );
				})
		}
	}
})

router.patch('/', function(req, res, next){
	var status = {
		success: 'success',
	}

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
						res.json( packed(status.success, '') );
					}
				});
		}
	}
})

module.exports = router;
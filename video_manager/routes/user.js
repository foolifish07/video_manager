var router = require('express').Router();

// tools 
function packed(status, data){
	return { status: status, data: data } 
}

// models 
var User = require('../mongodb/User');

// status in all 
var server_res = {
	register: {
		success: function(data){
			return packed('success', '');
		},
		exist: function(data){
			return packed('email_exist', '');
		},
	},
	login: {
		success: function(data){
			return packed('success', '');
		},
		nouser: function(data){
			return packed('nouser', '');
		},
		passwordwrong: function(data){
			return packed('wrong', '');
		},
	},
	logout: {
		success: function(data){
			return packed('success', '');
		}
	},

	myinfo: {
		login_required: function(data){
			return packed('login_required', '');
		},
		get: {
			success: function(user){
				var data = {
					name: user.name,
					email: user.email,
					group: user.group,
					register_time: user.register_time,
				}
				return packed('success', data);
			}
		},
		patch: {
			success: function(data){
				return packed('success', data);
			},
			passwordwrong: function(data){
				return packed('wrong', data);
			},
		}
	}
}

var print = {
	base: function(content){
		console.log('mongoose: user' + content + ' error!');
	},

	register: {
		findone: function(){
			print.base('register.findone');
		},
		newone: function(){
			print.base('register.newone');
		},
	},
	login: {
		findone: function(){
			print.base('login.findone');
		}
	},

	myinfo: {
		patch: {
			updateother: function(){
				print.base('myinfo.patch.updateother');
			},
		},
	}
}

// register
router.post('/register', function(req, res, next) {

	var email = req.param('email');
	var password = req.param('password');

	if ( email && password ){

		User.findOneByEmail(
			email, 
			function(err, exist_user){
				if ( err ){
					print.register.findone();
				}
				else {
					if ( exist_user ){
						res.json( server_res.register.exist() );
					}
					else {
						User.newOne(email, password, function(err, user){
							if ( err ){
								print.register.newone();
							}
							else{
								req.session.user = user;

								res.json( server_res.register.success() );
							}
						});

					}
				}
			});
	}
});

// login
router.post('/login', function(req, res, next){

	var email = req.param('email'); 
	var password = req.param('password');	

	User.findOneByEmail(
		email,  
		function(err, user){
			if ( err ){
				print.login();
			}
			else {
				if ( user ){
					if ( user.password===password ){
						req.session.user = user;

						res.json( server_res.login.success() );
					}
					else res.json( server_res.login.passwordwrong() );
				}
				else res.json( server_res.login.nouser() );
			}
		});
});

// log out 
router.post('/logout', function(req, res, next){
	
	req.session.user = null;

	res.json( server_res.logout.success() );
});

router.get('/logged', function(req, res, next){
	var status = {
		logged: 'logged',
		not_logged: 'not_logged',
	}
	if ( req.session.user ){
		res.json( packed(status.logged, '') );
	}
	else 
		res.json( packed(status.not_logged, '') );
})

// info setting
router.route('/myinfo')
	.all(function(req, res, next){

		if ( req.session.user )
			next();
		else 
			res.json( server_res.myinfo.login_required() );
	})
	.get(function(req, res, next){
		// get user info
		if  ( req.session && req.session.user )
			res.json( server_res.myinfo.get.success(req.session.user) );
	})
	//.post(function(req, res, next){
	.patch(function(req, res, next){

		var oldpassword = req.param('oldpassword');
		var user = req.session.user;

		if ( user.password===oldpassword ){
			
			if ( req.param('name') )
				user.name = req.param('name');
			if ( req.param('group') )
				user.group = req.param('group');
			if ( req.param('newpassword') )
				user.password = req.param('newpassword');

			User.updateOthers(user.email, user, function(err, item){
				if ( err ){
					print.myinfo.patch.updateother();
				}
				else res.json( server_res.myinfo.patch.success(item) );
			})
		}
		else res.json( server_res.myinfo.patch.passwordwrong() );
	})

// for test findall
router.get('/findall', function(req, res, next){

	User.find(function(err, list){
		if ( err ){
			console.log('mongoose user findall error!' );
			res.json( [] );
		}
		else {
			res.json( list );
		}
	})	

})

module.exports = router;

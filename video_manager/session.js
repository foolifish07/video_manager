
var session = {
	login: function(req, user){
		console.log(user.email + ' log in');
		req.session.user = user;
	},
	logout: function(req){
		req.session.user =  null;
	},
	is_logged_in: function(req){
		return req.session.user;
	},

	is_creator: function(req, creator){
		return req.session.user && creator && 
			req.session.user._id.toString() == creator._id.toString();
	},
	is_super: function(req){
		return req.session.user && req.session.user.group=='super'
	}
}


module.exports = session;
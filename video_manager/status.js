
function packed(status, data){
	return { status: status, data: data } 
}

var status = {
	success: function (res, data){
		if ( !data ) data = ''; 
		res.json( packed('success', data) );
	},
	login_required: function (res, data){
		if ( !data ) data = '';
		res.json( packed('login_required', data) );
	},
	no_permission: function (res, data){
		if ( !data ) data = ''; 
		res.json( packed('no_permission', data) );
	},
	not_found: function(res, data){
		if ( !data ) data = '';
		res.json( packed('not_found', data) );
	}
}

var login_required = function(req, res, next){
	if ( req.session.user )
		next()
	else 
		status.login_required(res, '');
}

module.exports = {
	status: status,
	login_required: login_required,
};


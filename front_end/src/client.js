
var base = function(url, method, data, status_function){
	$.ajax({
	    url: '/api' + url,
		type: method,
	    cache: false,
	    async: true, 
	    data: data,
	    dataType: 'json',
	    success: function(data){
	    	console.log(data);

	    	var status = data.status;
	    	var data = data.data;
	    	var list = Object.keys(status_function);
	    	for(var i in list){
	    		if ( status==list[i] ){
	    			if ( status_function[ status ] )
	    				status_function[ status ](data);
	    		}
	    	}
	    },
	})
};


// user
var user = {

	register: function(success, exist, data){
		var url = '/user/register';
		var method = 'post';
		var data = data;
		var status_function = {
			success: success,
			exist: exist,
		}
		base(url, method, data, status_function);
	},
	login: function(success, nouser, wrong, data){
		var url = '/user/login';
		var method = 'post';
		var data = data;
		var status_function = {
			success: success,
			nouser: nouser,
			wrong: wrong, 
		}
		base(url, method, data, status_function);
	},
	logout: function(success){
		var url = '/user/logout';
		var method = 'post';
		var data = {};
		var status_function = {
			success: success,
		}
		base(url, method, data, status_function);
	},
	logged: function(logged, not_logged){
		var url = '/user/logged';
		var method = 'get';
		var data = {};
		var status_function = {
			logged: logged,
			not_logged: not_logged,
		}
		base(url, method, data, status_function);
	},

	get_myinfo: function(success, login_required){
		var url = '/user/myinfo';
		var method = 'get';
		var data = { };
		var status_function = {
			success: success,
			login_required: login_required,
		}
		base(url, method, data, status_function);
	},
	patch_myinfo: function(success, login_required, wrong, data){
		var url = '/user/myinfo';
		var method = 'patch';
		var data = data;
		var status_function = {
			success: success,
			login_required: login_required,
			wrong: wrong,
		}
		base(url, method, data, status_function);
	},
}


// video 
var video = {
	upload: function(success, login_required, data){
		var url = '/video/upload';
		var method = 'post';
		var data = data;
		var status_function = {
			success: success,
			login_required: login_required,
		}
		base(url, method, data, status_function);
	},
	download: function(hash, success, login_required){
		var url = '/video/download/' + hash;
		var method = 'get';
		var data = {};
		var status_function = {
			success: success,
			login_required: login_required,
		}
		base(url, method, data, status_function);
	},

	get_video: function(hash, success, not_found, no_permission){
		var url = '/video/' + hash;
		var method = 'get';
		var data = {};
		var status_function = {
			success: success,
			not_found: not_found,
			no_permission: no_permission,
		}
		base(url, method, data, status_function);
	},
	delete_video: function(hash, success, not_found, no_permission){
		var url = '/video/' + hash;
		var method = 'delete';
		var data = {};
		var status_function = {
			success: success,
			not_found: not_found,
			no_permission: no_permission,
		}
		base(url, method, data, status_function);
	},
	patch_video: function(hash, success, not_found, no_permission, data){
		var url = '/video/' + hash;
		var method = 'patch';
		var data = data;
		var status_function = {
			success: success,
			not_found: not_found,
			no_permission: no_permission,
		}
		base(url, method, data, status_function);
	}
}


// videos 
var videos = {
	public: function(success){
		var url = '/videos/public';
		var method = 'get';
		var data = {};
		var status_function = {
			success: success,
		}

		base(url, method, data, status_function);
	},
	mine: function(success, login_required){
		var url = '/videos/mine';
		var method = 'get';
		var data = {};
		var status_function = {
			success: success,
			login_required: login_required,
		}

		base(url, method, data, status_function);
	}
}


// tag
var tag = {
	new: function(success, login_required, data){
		var url = '/tag';
		var method = 'post';
		var data = data;
		var status_function = {
			success: success,
			login_required: login_required,
		}

		base(url, method, data, status_function);
	},
	delete: function(success, login_required, data){
		var url = '/tag';
		var method = 'delete';
		var data = data;
		var status_function = {
			success: success,
			login_required: login_required,
		}

		base(url, method, data, status_function);
	},
	rename: function(success, login_required, data){
		var url = '/tag';
		var method = 'patch';
		var data = data;
		var status_function = {
			success: success,
			login_required: login_required,
		}

		base(url, method, data, status_function);
	}
}


// tags 
var tags = {
	get_mytags: function(success, login_required){
		var url = '/tags';
		var method = 'get';
		var data = { };
		var status_function = {
			success: success,
			login_required: login_required,
		}

		base(url, method, data, status_function);
	}
}

module.exports = {
	user: user,
	video: video,
	tag: tag,
	videos: videos,
	tags: tags,
}
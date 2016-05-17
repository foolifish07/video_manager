var router = require('express').Router();

// Tools 
var path = require('path');
function packed(status, data){
	return { status: status, data: data } 
}

// for upload && encryption 
var crypto = require('crypto'); // MD 5
var multer = require('multer'); // upload middleware
var letvcloud = require('../letvcloud');

// models
var Video = require('../mongodb/Video');

// session
var session = require('../session');

// for test
router.get('/findall', function(req, res, next){
	Video.find(function(err, list){
		if ( err ) {
			console.log( 'mongoose : video findall fail!')
			res.json([]);
		}
		else{
			return res.json(list);
		} 
	})
})

// upload 
var upload_cnt = 0;
var upload = multer({ 
	//dest: 'public/',
	storage: multer.diskStorage({
		destination: function(req, file, cb){
			cb(null, 'public/files');
		},
		filename: function(req, file, cb){
			upload_cnt++;

			var data = file.originalname + Date.now() + upload_cnt;
			var file_storage_name = crypto.createHash('md5')
				.update(data).digest("hex");

			cb(null, file_storage_name);

			console.log( 'upload ' + upload_cnt + ': ' + file_storage_name );
			req.originalname = file.originalname;
			req.storage_name = file_storage_name;
		},
	}),
	onFileUploadComplete: function(file){
		
	}
}).any();
router.post('/upload', 
	function(req, res, next){
		// define return status
		res.return_status = {  
			success: 'success',
			log_required: 'log_required',
		}
		next();
	},
	function(req, res, next){
		// permission require
		if ( session.is_logged_in(req) ){
			next();
		}
		else 
			res.json( packed(res.return_status.log_required, '') );
	},
	function(req, res){
		upload(req, res, function(err){
			console.log('UPload COmplete!');
			letvcloud.upload(
				req.storage_name,
				path.join(__dirname, 'public', 'files', req.storage_name), 
				function(err, videoid){
					if( err ) {
						console.log( 'NOt find file');
					}
					console.log( videoid );
					letvcloud.get_image(videoid ,null ,function(err, img_url){
					if ( err ) console.log('upload img error!');
						console.log(img_url);
						Video.newOne( 
				 			req.originalname, 
							req.session.user,
							req.storage_name,
							img_url,  
							function(err, item){
								if ( err ){
									console.log('New video error!');
								}
							});
					})
				})

			res.json( packed(res.return_status.success, req.storage_name) );		
		});
	});


router.route('/:name')
	.all(function(req, res, next){
		// define return status
		res.return_status = {
			success: 'success',
			no_video: 'no_video',
			no_permission: 'no_permission',
		}
		next()
	})
	.all(function(req, res, next){
		// get the video
		Video.findOneByHash( 
			req.params.name,
			function(err, video){
				if ( err ){
					console.log( 'video find ' + req.params + ' fail');
					res.json( packed(res.return_status.no_video, '') );
				}
				else {
					if ( video ){	
						res.video = video;
						next();
					}
					else 
						res.json( packed(res.return_status.no_video, '') );
				}
			});
	})
	.get( //
		function(req, res, next){
			// permission 
			var user = req.session.user;

			if ( session.is_super(req) || session.is_creator(req, res.video.creator) ){
				res.can_manage = true;
			}

			if ( !res.video.is_public ){
				if ( session.is_super(req) || session.is_creator(req, res.video.creator) ){
					next();
				}
				else {
					res.json( packed(res.return_status.no_permission, '') );
				}
			}
			else next();
		},
		function(req, res, next){
			//res.video.video_url = path.join('files', req.params.name);
			if ( res.can_manage ){
				res.json( packed('can_manage', res.video) );
			}
			else {
				res.json( packed(res.return_status.success, res.video) );
			}
		})
	.delete( 
		function(req, res, next){
			// permission require
			var user = req.session.user;

			if ( !session.is_logged_in(req) ) 
				res.json( packed(res.return_status.no_permission, '') );
			else if ( user.group!='super' && session.is_creator(req, res.video.creator) ){
				res.json( packed(res.return_status.no_permission, '') );
			}
			else next();
		},
		function(req, res){
			// delete the video in database

			Video.removeOne( res.video.storage_name, function(err){
				if ( err ){
					console.log('delete video fail!');
				}
				else res.json( packed(res.return_status.success, '') );
			})
		})
	.patch(
		function(req, res, next){
			// permission require
			var user = req.session.user;

			if ( !session.is_logged_in(req) ) 
				res.json( packed(res.return_status.no_permission, '') );
			else if ( user.group!='super' && user._id != res.video.creator._id ){
				res.json( packed(res.return_status.no_permission, '') );
			}
			else next();
		},
		function(req, res, next){
			var is_public, download_times, watched_times;
			var data = {};

			if ( req.param('newname') )
				data.name = req.param('newname');
			if ( req.param('is_public') )
				data.is_public = req.param('is_public');
				//data.is_public = req.param('is_public')=='true';
			if ( req.param('download_times') )
				data.download_times = req.param('download_times');
			if ( req.param('watched_times') )
				data.watched_times = req.param('watched_times');

			Video.updateOne( 
				req.params.name,
				data,
				function(err, video){

					if ( err ) {
						console.log('mongoose : update one err!');
					}
					else 
						res.json( packed(res.return_status.success, '') );
				});

		});

module.exports = router;
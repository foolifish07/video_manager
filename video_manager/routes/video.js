var router = require('express').Router();

// Tools 
var path = require('path');

// status 
var status = require('../status').status;
var login_required = require('../status').login_required;

// for upload && encryption 
var crypto = require('crypto'); // MD 5
var multer = require('multer'); // upload middleware
var letvcloud = require('../letvcloud');

// models
var Video = require('../mongodb/Video');


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
			if ( !req.videos ) req.videos = [];
			req.videos.push({
				originalname: file.originalname,
				storage_name: file_storage_name,
			});

		},
	}),
}).any();
router.post('/upload', 
	login_required, // return 
	function(req, res){
		upload(req, res, function(err){
			if ( !req.videos ) req.videos = [];
			console.log(req.videos.length + ' files UPload COmplete! ' ) ;

			for(var i in req.videos){(function(){
				var video = req.videos[i];

				letvcloud.upload(
					video.storage_name,
					path.join(__dirname, '..', 'public', 'files', video.storage_name), 
					function(err, videoid){
						if( err ) {
							console.log( 'NOt find file');
						}
						console.log( video.originalname );

						Video.newOne( 
							video.storage_name,
					 		video.originalname, 
							req.session.user._id,
							videoid,  
							function(err, item){
								if ( err ){
									console.log('New video error!');
								}
							});
						/*
						letvcloud.get_image(videoid ,null ,function(err, img_url){
							if ( err ) console.log('upload img error!');
							console.log('img_url: ' + img_url);

						})
						*/
					})
			}())}


			status.success(res, '');		// return 

		});
	});

// download 
router.get('/download/:name',
	function(req, res){
		Video.updateDownload(req.params.name);

		//res.download( path.join('/files', req.params.name) );
		res.download(path.join(__dirname, '..', 'public', 'files', req.params.name));
	});

// single 
router.route('/:name')
	.all(function(req, res, next){
		// find the video
		Video.findOneByHash( 
			req.params.name,
			function(err, video){
				if ( err ){
					console.log( 'video find ' + req.params + ' fail');
				}
				else {
					if ( video ){	
						res.video = video;

						if ( !video.img_url || video.img_url=='' ){
							letvcloud.get_image(
								video.videoid ,null ,
								function(err, img_url){
									if ( err ) console.log('upload img error!');
									if ( img_url ){
										console.log('img_url: ' + img_url);
										Video.updateOne( 
											req.params.name,
											{ img_url: img_url },
											function(err, video){
												if ( err ) {
													console.log('mongoose : update one err!');
												}
											});
									}
								})
						}

						next();
					}
					else 
						status.not_found(res); // return 
				}
			});
	})
	.get( 
		function(req, res, next){
			// permission 
			var user = req.session.user;
			
			if ( user ) {
				var is_creator = user._id == res.video.creator._id;
				if ( user.group=='super' || is_creator) {
					res.can_manage = true;
				}
			}

			if ( res.video.is_public )
				next();
			else if ( res.can_manage )
				next();
			else status.no_permission(res); // return 
		},
		function(req, res, next){
			Video.updateOne( 
				req.params.name,
				{ watched_times: res.video.watched_times+1 },
				function(err, video){
					if ( err ) {
						console.log('mongoose : update one err!');
					}
				});

			status.success(res, res.video); // return 
		})
	.delete( 
		function(req, res, next){
			// permission require
			var user = req.session.user;

			if ( user ) {
				var is_creator = user._id == res.video.creator._id;
				if ( user.group=='super' || is_creator ) {
					next();
				}
			}
			else status.no_permission(res); // return 
		},
		function(req, res){

			Video.removeOne( res.video.storage_name, function(err){
				if ( err ){
					console.log('delete video fail!');
				}
				else status.success(res); // return 
			})
		})
	.patch(
		function(req, res, next){
			// permission require
			var user = req.session.user;

			if ( user ) {
				var is_creator = user._id == res.video.creator._id;
				if ( user.group=='super' || is_creator ) {
					next();
				}
			}
			else status.no_permission(res); // return 
		},
		function(req, res, next){
			var is_public, download_times, watched_times;
			var data = {};

			if ( req.param('newname') )
				data.name = req.param('newname');
			if ( req.param('is_public') )
				data.is_public = req.param('is_public');
			if ( req.param('tags') ){
				var tags = req.param('tags');
				tags = JSON.parse(tags);
				if ( tags instanceof Array ){
					data.tags = tags
				}
			}

			Video.updateOne( 
				req.params.name,
				data,
				function(err, video){

					if ( err ) {
						console.log('mongoose : update one err!');
					}
					else 
						status.success(res, video); // return 
				});

		});


module.exports = router;
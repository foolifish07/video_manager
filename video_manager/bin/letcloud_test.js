var letvcloud = require('letvcloud');
letvcloud({
    user_unique: 'vhrrkr9rtg',
    secret_key: '1a5fd883896afa658d1651025b348ba6',
});

var upload = function(){

	letvcloud.video.upload.web('my video','./public/files/mov_bbb.mp4',function(err,data){
	    console.log(data);
	});
}

var get_video_list = function(){
	letvcloud.video.list(function (err, data) {
	    console.log(data);
	});
}

var get_one = function(){
	letvcloud.video.get({video_id: '29039298'}, function (err, data) {
	    console.log(data);
	});
}

var get_image = function(){
	letvcloud.image.get({video_id: '29039298', size: '100_100'}, function (err, data) {
	    console.log(data);
	});
}

//upload();
//get_video_list();
get_image();
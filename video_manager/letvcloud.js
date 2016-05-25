var request = require('request');
var fs = require('fs');

var letvcloud = require('letvcloud');
letvcloud({
    user_unique: 'vhrrkr9rtg',
    secret_key: '1a5fd883896afa658d1651025b348ba6',
});

var get_video_list = function(){
	letvcloud.video.list(function (err, data) {
	    console.log(data);
	});
}

var get_image = function(videoid, size, callback){
    videoid = videoid ? videoid : 29037364;
	size = size ? size : '200_150';

	// data.data.img1;
	letvcloud.image.get({video_id: videoid, size: size}, function(err, data){
        return callback(err, data.data.img1);
    });
}

var upload = function (name, path, callback) {
    var formData = {
        my_field: 'video_file',
        my_file: fs.createReadStream(path)
    };
    letvcloud.video.upload.init({video_name: name}, function (err, data) {
        if (err)
            return callback(err);
        if (!data.data.upload_url)
            return callback(JSON.parse(data));

        request.post({
            url: data.data.upload_url,
            formData: formData
        }, function optionalCallback(err, httpResponse, body) {
            if (err)
                return callback(err);
            //callback(null, JSON.parse(body));
        });
        return callback(err, data.data.video_id);
    });
};
/*
upload_test('hehe', './public/files/mov_bbb.mp4', function(err, data){
	console.log(data);
});
*/

//get_image(29303630, null, function(){})

module.exports = {
	upload: upload,
    get_image: get_image,
	get_video_list : get_video_list
}
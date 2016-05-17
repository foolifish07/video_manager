var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// models 
var Video = require('./Video');
var Tag = require('./Tag');

// schema
var schema = new mongoose.Schema({
	tag: { type: ObjectId, ref: 'Tag' },
	video: { type: ObjectId, ref: 'Video' },
});

// new 
schema.statics.newOne = function(tagid, videoid, callback){
	var data = {
		tag: tagid,
		video: videoid,
	}
	return this.create(data, callback) 
}

// delete
schema.statics.removeOneById = function(id, callback) {
	return this.remove({ _id: id}, callback );
}

// find
schema.statics.findByTag = function(tagid, callback) {
  	return this
  		.find({ tag: tagid })
		.populate({
			path: 'video',
			populate: { path: 'creator' }
		 })
		.exec( callback );
}
schema.statics.findByVideo = function(videoid, callback){
  	return this
  		.find({ video: videoid})
  		.populate({
			path: 'tag',
			populate: { path: 'creator' }
		 })
  		.exec( callback );
}


var Model = mongoose.model('VideoTag', schema);
module.exports = Model
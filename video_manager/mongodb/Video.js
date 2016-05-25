var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// models
//var Comment = require('./Comment');

var schema = new mongoose.Schema({
  storage_name: String,

  name: String,
  is_public: { type: Boolean, default: false },
  tags: [{ type: ObjectId, ref: 'Tag', default: [] }],
  comments: [{ type: ObjectId, ref: 'Comment', default: [] }],
  
  creator: { type: ObjectId, ref: 'User' },
  upload_time: { type: Date, default: Date.now },
  videoid: { type: Number, default: 0 }, 
  img_url: { type: String, default: '' },
  video_url: { type: String, default:'' },
  watched_times: { type: Number, default: 0 },
  download_times: { type: Number, default: 0 }, 
});

// new 
schema.statics.newOne = function(storage_name, name, creatorid, videoid, callback){
	var data = {
		storage_name: storage_name,
    name: name,
    creator: creatorid,
    videoid: videoid,
    video_url: '/files/' + storage_name,
	};
	return this.create(data, callback);
}

// find 
schema.statics.findOneByHash = function(hash, callback) {
    return this
        .findOne({ storage_name: hash })
        .populate( 'creator' )
        .populate({
            path: 'tags',
         })
        .exec( callback );
}
schema.statics.findByCreator = function(creatorid, callback){
    return this
        .find({creator: creatorid })
        .populate( 'creator' )
        .populate({
            path: 'tags',
         })
        .exec( callback );
}
schema.statics.findByPublic = function( callback ){
    return this
        .find({ is_public: true })
        .populate( 'creator' )
        .populate({
            path: 'tags',
         })
        .exec( callback )
}

// delete
schema.statics.removeOne = function(hash, callback) {
	return this.remove({ storage_name: hash }, callback );
}
      

// update 
schema.statics.updateOne = function(hash, item, callback){
    return this.findOneAndUpdate( 
        { storage_name: hash }, 
        item, 
        { new: true },
        callback );
}
schema.statics.updatePublic = function(hash, newv, callback){
    return this.findOneAndUpdate( 
        { storage_name: hash }, 
        { is_public: newv }, 
        { new: true },
        callback );
}
schema.statics.updateWatched = function(hash, newv, callback){
    return this.findOneAndUpdate(
        { storage_name: hash }, 
        { watched_times: newv },
        { new: true },
        callback );
}
schema.statics.updateDownload = function(hash){
    this.findOneAndUpdate(
        { storage_name: hash }, 
        { },
        { new: false },
        function(err, video){
          if ( err ) console.log(err);
          else {
            video.download_times++;
            video.save();
          }    
        });
}

var Model = mongoose.model('Video', schema);
module.exports = Model
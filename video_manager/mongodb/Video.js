var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// models
var VideoTag = require('./VideoTag');

var schema = new mongoose.Schema({
  name: String,
  creator: { type: ObjectId, ref: 'User' },
  storage_name: String,
  is_public: { type: Boolean, default: false },
  upload_time: { type: Date, default: Date.now },

  format: { type: String, default: '' },
  duration: { type: Number, default: 0 },

  videotag: [{ type: ObjectId, ref: 'VideoTag', default: [] }],
  img_url: { String, default: ''},
  video_url: { String, default:'' },

  watched_times: { type: Number, default: 0 },
  download_times: { type: Number, default: 0 }, 
});

// new 
schema.statics.newOne = function(name, creator, storage_name, img_url, callback){
	var data = {
		name: name,
		creator: creator._id,
		storage_name: storage_name,
    img_url: img_url,
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
            path: 'videotag',
            populate: { path: 'tag' }
         })
        .exec( callback );
}
schema.statics.findByCreator = function(creatorid, callback){
    return this
        .find({creator: creatorid })
        .populate( 'creator' )
        .populate({
            path: 'videotag',
            populate: { path: 'tag' }
         })
        .exec( callback );
}
schema.statics.findByPublic = function( callback ){
    return this
        .find({ is_public: true })
        .populate( 'creator' )
        .populate({
            path: 'videotag',
            populate: { path: 'tag' }
         })
        .exec( callback )
}

// delete
schema.statics.removeOne = function(hash, callback) {
	return this.remove({ storage_name: hash }, callback );
}
      

// update 
schema.statics.updateOne = function(hash, item, callback){
    return this.update( 
        { storage_name: hash }, 
        item, 
        callback );
}
schema.statics.updatePublic = function(hash, newv ,callback){
    return this.update( 
        { storage_name: hash }, 
        { is_public: newv }, 
        {},
        callback );
}
schema.statics.updateWatched = function(hash, newv, callback){
    return this.update(
        { storage_name: hash }, 
        { watched_times: newv },
        {},
        callback );
}
schema.statics.updateDownload = function(hash, newv, callback){
    return this.findOneAndUpdate(
        { storage_name: hash }, 
        { download_times: newv },
        {},
        callback );
}

var Model = mongoose.model('Video', schema);
module.exports = Model
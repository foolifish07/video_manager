var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var schema = new mongoose.Schema({
  name: String,
  creator: { type: ObjectId, ref: 'User' },
});

// new 
schema.statics.newOne = function(name, creator, callback){
	var data = {
		name: name,
		creator: creator,
	}
	return this.create(data, callback) 
}

// find
schema.statics.findOneById = function(id, callback) {
  return this
  		.findOne({ _id: id })
  		.populate('creator')
  		.exec(callback);
}
schema.statics.findByCreator = function(creatorid, callback){
  return this
  		.find({creator: creatorid})
  		.populate('creator')
  		.exec(callback);
}

// remove 
schema.statics.removeOne = function(tagid, callback) {
	return this.remove({_id: tagid}, callback );
}

// update
schema.statics.updateName = function(id, name, callback){
	return this.findOneAndUpdate(
		{ _id: id }, 
		{ name: name },
		callback );
}

var Model = mongoose.model('Tag', schema);

module.exports = Model
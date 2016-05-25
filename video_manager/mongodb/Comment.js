var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
	name: { type: String, default: '' },
  	content: { type: String, default: '' },
  	creator: { type: ObjectId, ref: 'User' },
});

// new 
schema.statics.newOne = function(name, content, creatorid, callback){
	var data = {
		name: name,
		content: content,
		creator: creatorid,
	}
	return this.create(data, callback) 
}

var Model = mongoose.model('Comment', schema);

module.exports = Model
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  group: { type: String, default: 'normal' } , // 'super', 'normal' 
  register_time: { type: Date, default: Date.now },
});

schema.statics.newOne = function(email, password, callback){
	var data = {
		email: email,
		name: email,
		password: password,
	};
	return this.create( data, callback ); 
}
schema.statics.findOneByEmail = function(email, callback){
	return this.findOne({ email: email }, callback );
}

schema.statics.updatePassword = function(email, password, callback){
	return this.findOneAndUpdate(
		{ email: email }, 
		{ password: password}, 
		callback );
}
schema.statics.updateOthers = function(email, newUser, callback){
	return this.findOneAndUpdate(
		{ email: email }, 
		newUser, 
		callback );
}

var Model = mongoose.model('User', schema);

module.exports = Model
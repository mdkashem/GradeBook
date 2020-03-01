//Class variables
var Semester = require('./semester');
var Student = require('./student');
var Assignment = require('./assignment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Course schema
var userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateModified: {
		type: Date
	},
	semesters: [{
		type: ObjectId,
		ref: 'Semester'
	}],
	students: [{
		type: ObjectId,
		ref: 'Student'
	}],
	assignments: [{
		type: ObjectId,
		ref: 'Assignment'
	}],
	comments: [{
		type: String
	}]
});

//Change the DateModified on update
userSchema.pre('save', function (next) {
	var used = this;
	used.dateModified = Date.now();
	next();
});

//Export the model
var User = mongoose.model('User', userSchema);
module.exports = User;
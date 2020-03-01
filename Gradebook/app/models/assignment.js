//Class variables
var Student = require('./student');
var Course = require('./course');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Course schema
var assignmentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateModified: {
		type: Date,
		required: true
	},
	maxPoints: {
		type: Number,
		required: true,
		default: 100
	},
	description: {
		type: String
	},
	course: {
		type: ObjectId,
		ref: 'Course'
	},
	students: [{
		type: ObjectId,
		ref: 'Student'
	}],
	comments: [{
		type: String
	}]
});

//Middleware

//Change the DateModified on update
assignmentSchema.pre('save', function (next) {
	var assigned = this;
	assigned.dateModified = Date.now();

	next();
});

//Export the model
var Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
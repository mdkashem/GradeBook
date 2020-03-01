//Class variables
var Student = require('./student');
var Assignment = require('./assignment');
var Course = require('./course');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Course schema
var semesterSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	courseNum: {
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
	students: [{
		type: ObjectId,
		ref: 'Student'
	}],
	assignments: [{
		type: ObjectId,
		ref: 'Assignment'
	}],
	courses: [{
		type: ObjectId,
		ref: 'Course'
	}],
	comments: [{
		type: String
	}]
});

//Change the DateModified on update
semesterSchema.pre('save', function (next) {
	var semestered = this;
	semestered.dateModified = Date.now();
	next();
});

//Export the model
var Semester = mongoose.model('Semester', semesterSchema);
module.exports = Semester;
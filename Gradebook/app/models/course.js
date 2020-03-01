//Class variables
var Semester = require('./semester');
var Student = require('./student');
var Assignment = require('./assignment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Course schema
var courseSchema = new Schema({
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
courseSchema.pre('save', function (next) {
	var coursed = this;
	coursed.dateModified = Date.now();
	next();
});

//Delete assignments associated with course
courseSchema.pre('remove', function (next) {
	var delCourse = this;
	Assignment.remove({_id: {$in: delCourse.assignments}}).exec();
	next();
});

//Export the model
var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
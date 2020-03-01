//Class variables
var Semester = require('./semester');
var Assignment = require('./assignment');
var Course = require('./course');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

//Student schema
var studentSchema = new Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String
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
	courses: [{
		type: ObjectId,
		ref: 'Course'
	}],
	assignments: [{
		type: ObjectId,
		ref: 'Assignment'
	}],
	comments: [{
		type: String
	}]
});

//Methods
studentSchema.methods.getFullName = function() {
	return this.firstName + " " + this.lastName;
};

//Change the DateModified on update
studentSchema.pre('save', function (next) {
	var studied = this;
	studied.dateModified = Date.now();
	next();
});

//Export the model
var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
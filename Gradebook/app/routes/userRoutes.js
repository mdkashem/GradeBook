var Course = require('../models/course');
var User = require('../models/user');

module.exports = function(apiRouter) {
	apiRouter.route('/courses')

		//Get a collection of courses
		.get(function(req, res) {
			Course.find(function (err, courses) {
				if (err)
					res.send(err);
				else{
					res.json(courses);
				}
			});
		})

		//Create a new course
		.post(function(req, res) {
			var newCourse = new Course();

			newCourse.name = req.body.name;
			newCourse.courseNum = req.body.courseNum;
			newCourse.dateCreated = Date.now();
			newCourse.dateModified = Date.now();
			newCourse.semesters = [];
			newCourse.students = [];
			newCourse.assignments = [];
			newCourse.comments = [];

			//Save to DB
			newCourse.save(function(err) {
				if (err)
					res.send(err);
				else
					res.json({ message: "Course successfully created" });
			});
		});

	//Operations for existing courses
	apiRouter.route('/courses/:course_id')

		//Delete an existing course
		.delete(function (req, res) {
			Course.findByIdAndRemove(req.params.course_id, function (err, delCourse) {
				console.log(delCourse);
				if (err)
					res.send(err);
				delCourse.remove();
			}).then(function() {
				Course.find(function (err, courses) {
					res.json({ message: 'Course deleted' });
				});
			});
		});

	//Calls for populating fields
	apiRouter.route('/courses/students/:course_id')
		.get(function (req, res) {
			Course.findOne({_id: req.params.course_id})
			.populate('students')
		})

}
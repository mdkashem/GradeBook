var Course = require('../models/course');
var Semester = require('../models/semester');
var User = require('../models/user');

module.exports = function(apiRouter) {
	apiRouter.route('/semesters')

		//Get a collection of courses
		.get(function(req, res) {
			Semester.find(function (err, semesters) {
				if (err)
					res.send(err);
				else{
					res.json(semesters);
				}
			});
		})

		//Create a new course
		.post(function(req, res) {
			var newSemester = new Semester();

			newSemester.name = req.body.name;
			newSemester.courseNum = req.body.courseNum;
			newSemester.dateCreated = Date.now();
			newSemester.dateModified = Date.now();
			newSemester.semesters = [];
			newSemester.students = [];
			newSemester.assignments = [];
			newSemester.comments = [];

			//Save to DB
			newSemester.save(function(err) {
				if (err)
					res.send(err);
				else
					res.json({ message: "Semester successfully created" });
			});
		});

	//Operations for existing courses
	apiRouter.route('/semesters/:semester_id')

		//Delete an existing course
		.delete(function (req, res) {
			Course.findByIdAndRemove(req.params.course_id, function (err, delSemester) {
				console.log(delSemester);
				if (err)
					res.send(err);
				delSemester.remove();
			}).then(function() {
				Semester.find(function (err, semesters) {
					res.json({ message: 'Semester deleted' });
				});
			});
		});

	//Calls for populating fields
}
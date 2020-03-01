var Assignment = require('../models/assignment');
var Course = require('../models/course');
var User = require('../models/user');

module.exports = function(apiRouter) {
	apiRouter.route('/assignments')

		//Get a collection of assignments
		.get(function (req, res) {
			Assignment.find()
			.populate('course').
			exec(function (err, assignments) {
				if (err)
					res.send(err);
				else{
					res.json(assignments);
				}
			});
		})

		//Create a new assignment
		.post(function(req, res) {
			var newAssignment = new Assignment();

			newAssignment.name = req.body.name;
			newAssignment.dateCreated = Date.now();
			newAssignment.dateModified = Date.now();
			newAssignment.description = req.body.description;
			newAssignment.maxPoints = req.body.maxPoints;
			newAssignment.comments.push(req.body.comments || []);
			newAssignment.course = req.body.course;

			//Save to DB
			newAssignment.save(function (err) {
				if (err)
					res.send(err);
				else{
					res.json({ assignment: newAssignment });
				}
			});
		});

	//Operations on existing assignments
	apiRouter.route('/assignments/:assignment_id')

		//Delete an existing assignment
		.delete(function (req, res) {
			Assignment.findByIdAndRemove(req.params.assignment_id, function (err, delAssignment) {
				if (err)
					res.send(err);
				delAssignment.remove();
			}).then(function() {
				Assignment.find(function (err, assignments) {
					res.json({ message: 'Assignment deleted' });
				});
			});
		});
}
module.exports = function(app, express) {
	//Use express router
	var apiRouter = express.Router();

	//Course routes
	require('./courseRoutes')(apiRouter);

	//Assignment routes
	require('./assignmentRoutes')(apiRouter);

	//Student routes
	require('./studentRoutes')(apiRouter);

	//Kick it out
	return apiRouter;
};
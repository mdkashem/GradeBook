var gradebookApp = angular.module('gradebook', ['ui.router']);

gradebookApp.controller('HomeController', ['$scope', '$http', '$state', function ($scope, $http, $state) { 
	$scope.viewType = "Semester";
	var graphData = [];
	var assignGraphData = [];

	$http.get("/api/courses").success (function (data){
		$scope.courseData = data;
		console.log("Courses retrieved");
		$scope.courseCount = data.length;

		for (var i=0; i<data.length; i++) {
			graphData.push({"label": data[i].name, "value": data[i].students.length || .01});
		}
		donut.setData(graphData);
	})
	.error (function(){
		console.log("Courses not retrieved");
	});

	//Get the assignments
	$http.get('/api/assignments').success (function (data) {
		$scope.assignData = data;
		console.log("Assignments retrieved");
		$scope.assignCount = data.length;

		for (var i=0; i<data.length; i++) {
			assignGraphData.push({"label": data[i].name, "value": data[i].maxPoints});
		}
		assignDonut.setData(assignGraphData);
	})

	var assignDonut = Morris.Donut({
		element: 'assignmentChart',
		data: [{"label": "", "value": ""}],
		colors: [
			'#ff865c',
			'#ffd777',
			'#43b1a9',
			'#68dff0',
			'#797979'
		],
		resize: true
	});
	
	var donut = Morris.Donut({
		element: 'studentChart',
		data: [{"label": "", "value": ""}],
		colors: [
			'#ff865c',
			'#ffd777',
			'#43b1a9',
			'#68dff0',
			'#797979'
		],
		resize: true
	});
}]);

//Course controllers
gradebookApp.controller('CourseController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Courses";
	$http.get("/api/courses").success (function (data){
		$scope.courseData = data;
		console.log("Courses retrieved");
	})
	.error (function(){
		console.log("Courses not retrieved");
	});

	$scope.remove = function (courseId) {
		$http.delete("/api/courses/" + courseId);
		$state.go($state.current, {}, {reload: true});
	};
}]);

gradebookApp.controller('CourseCreateCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewName = "Create Course";
	$scope.courseInfo = {};
	$scope.courseInfo.name = "";
	$scope.courseInfo.courseNum = "";
	$scope.courseInfo.comments = "";

	//Scope methods
	$scope.cancel = function () { $state.go('courseState'); };

	$scope.postData = function () {
		$scope.nameRequired = "";
		$scope.numRequired = "";

		if (!$scope.courseInfo.name) {
			$scope.nameRequired = "Course Name Required";
		}

		if (!$scope.courseInfo.courseNum) {
			$scope.numRequired = "Course Number Required";
		}

		if ($scope.courseInfo.name && $scope.courseInfo.courseNum) {
			console.log($scope.courseInfo);
			$http.post('/api/courses', $scope.courseInfo).success(function (data) {
				console.log("Course successfully posted");
				$state.go('courseState');
			})
			.error(function (data) {
				$scope.failed = "Course creation failed";
			});
		}
	};
}]);

gradebookApp.controller('CourseDetailCtrl', ['$scope', '$http', '$state', '$stateParams', function ($scope, $http, $state) {
	$scope.viewType = "Course Details";
	$http.get("/api/courses/" + $state.params.course_id).success (function (data) {
		$scope.course = data.course;
		console.log(data);
	})
	.error (function () {
		console.log("Course not retrieved");
	});
}]);

//Student controllers
gradebookApp.controller('StudentCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Students";
	$http.get("/api/students").success (function (data) {
		$scope.studentData = data;
		console.log("Students retrieved");
	})
	.error (function () {
		console.log("Students not retrieved");
	});

	$scope.remove = function (studentId) {
		$http.delete("/api/students/" + studentId);
		$state.go($state.current, {}, {reload: true});
	};
}]);

gradebookApp.controller('StudentCreateCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewName = "Create Student";
	$scope.studentInfo = {};
	$scope.studentInfo.firstName = "";
	$scope.studentInfo.lastName = "";
	$scope.studentInfo.phoneNumber = "";
	$scope.studentInfo.email = "";
	$scope.studentInfo.comments = "";

	//Scope methods
	$scope.cancel = function () { $state.go('studentState'); };

	$scope.postData = function () {
		$scope.nameRequired = "";
		$scope.emailRequired = "";

		if (!$scope.studentInfo.firstName || !$scope.studentInfo.lastName) {
			$scope.nameRequired = "Student First and Last Name Required";
		}

		if (!$scope.studentInfo.email) {
			$scope.emailRequired = "Email Required";
		}

		if ($scope.studentInfo.firstName && $scope.studentInfo.lastName && $scope.studentInfo.email) {
			console.log($scope.studentInfo);
			$http.post('/api/students', $scope.studentInfo).success(function (data) {
				console.log("Student successfully posted");
				$state.go('studentState');
			})
			.error(function (data) {
				$scope.failed = "Student creation failed";
			});
		}
	};
}]);

//Assignment controllers
gradebookApp.controller('AssignmentCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
	$scope.viewType = "Assignments";
	$http.get("/api/assignments").success (function (data) {
		$scope.assignmentData = data;
		console.log("Assignments retrieved");
	})
	.error (function () {
		console.log("Assignments not retrieved");
	});

	$scope.remove = function (assignmentId) {
		$http.delete("/api/assignments/" + assignmentId);
		$state.go($state.current, {}, {reload: true});
	};
}]);

gradebookApp.controller('AssignmentCreateCtrl', ['$scope', '$http', '$state', 'courseFactory', function ($scope, $http, $state, courseFactory) {
	$scope.viewName = "Create Assignment";
	$scope.assignmentInfo = {};
	$scope.assignmentInfo.name = "";
	$scope.assignmentInfo.description = "";
	$scope.assignmentInfo.maxPoints = "";
	$scope.assignmentInfo.comments = "";
	$scope.assignmentInfo.course = "";

	//Get course names for dropdown
	$http.get('/api/courses').success (function (data) {
		$scope.courses = data;
		console.log("Courses retrieved for dropdown");
	})
	.error (function () {
		console.log("Courses not retrieved");
	})

	//Scope methods
	$scope.cancel = function () { $state.go('assignmentState'); };

	$scope.postData = function () {
		$scope.nameRequired = "";

		if (!$scope.assignmentInfo.name) {
			$scope.nameRequired = "Assignment Name Required";
		}

		if ($scope.assignmentInfo.name) {
			console.log($scope.assignmentInfo);
			$http.post('/api/assignments', $scope.assignmentInfo).success(function (data) {
				console.log("Assignment successfully posted");
				courseFactory.pushAssignment(data.course, data._id).success (function (data) {
					console.log("Pushed: " + data);
				});
				$state.go('assignmentState');
			})
			.error(function (data) {
				$scope.failed = "Assignment creation failed";
			});
		}
	};
}]);

//UI Routes
gradebookApp.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('homeState', {
			url: "",
			templateUrl: "../../app/views/home.html",
			controller: 'HomeController'
		})

		.state('courseState', {
			url: "/courses",
			templateUrl: "../../app/views/courses/index.html",
			controller: 'CourseController'
		})

		.state('courseCreate', {
			url: "/courses/create",
			templateUrl: "../../app/views/courses/create.html",
			controller: 'CourseCreateCtrl'
		})

		.state('studentState', {
			url: "/students",
			templateUrl: "../../app/views/students/index.html",
			controller: "StudentCtrl"
		})

		.state('studentCreate', {
			url: "/students/create",
			templateUrl: "../../app/views/students/create.html",
			controller: "StudentCreateCtrl"
		})

		.state('assignmentState', {
			url: "/assignments",
			templateUrl: "../../app/views/assignments/index.html",
			controller: "AssignmentCtrl"
		})

		.state('assignmentCreate', {
			url: "/assignments/create",
			templateUrl: "../../app/views/assignments/create.html",
			controller: "AssignmentCreateCtrl"
		})

		.state('coursesDetail', {
			url: "/courses/:course_id",
			templateUrl: "../../app/views/courses/detail.html",
			controller: "CourseDetailCtrl"
		});
});

//Factories and services
gradebookApp.factory('courseFactory', function ($http) {
	var courseFactory = {};

	courseFactory.pushAssignment = function (course_id, assignment) {
		return $http.put('/api/courses/' + course_id + '/assignments', assignment);
	};

	return courseFactory;
});
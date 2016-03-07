/*jshint smarttabs:true */

// Main App controlling the bulk of the site
angular.module("RatherApp", [
	'landing.directives',
	'account.directives',
	'navigation.directives',
	'rather.directives',
	'rather.models',
	'account.models',
	'templates-app',
	'templates-common',
	'ui.router',
	'BaseClass',
	'wouldyourather.config',
	'ngLodash',
	'ngAnimate',
	'ui.bootstrap'
])

// .config(["$locationProvider", function($locationProvider) {
//   $locationProvider.html5Mode(true);
// }])

// Using ui.router stateProvider to define single page application states
.config(['$stateProvider', 'BCConfigProvider', 'API_DOMAIN', function($stateProvider, BCConfigProvider, API_DOMAIN) {
	$stateProvider
	.state('landing',{
		url: '/home',
		templateUrl: 'landing/partials/landing.tpl.html'
	})
	.state('play',{
		url:'/play?rather1&rather2',
		templateUrl: 'rathers/partials/rathers.comparison.tpl.html',
		resolve: {
			'comparison':function(Rather, $stateParams){
				return Rather.$comparison({
					rather1: $stateParams.rather1,
					rather2: $stateParams.rather2
				});
			}
		},
		controller: function($scope, $uibModal, Rather, comparison, $location){
			var newRather;
			$scope.stats = function (rather) {
		    var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'ratherstats.html',
						controller: function($scope, $filter, $uibModalInstance) {
								var title = newRather[rather].rather_text;
								$scope.header_text = title.charAt(0).toUpperCase() + title.substr(1);
								$scope.user = newRather[rather].user.username;
								$scope.date = $filter('date')(newRather[rather].date_submitted, "MM/dd/yyyy");
								$scope.wins = newRather[rather].wins;
								$scope.losses = newRather[rather].losses;
								$scope.score = newRather[rather].ratio;
								$scope.sucks = newRather[rather].this_sucks;

								$scope.close = function () {
									$uibModalInstance.close();
								};
						},
						windowClass: 'rather-modal'
				});
			};

			function search(Rather) {
				$scope.comparison = Rather.rathers;
				newRather = Rather.rathers;
				$location.search("rather1", Rather.rathers[0].id);
				$location.search("rather2", Rather.rathers[1].id);

				btn1 = $("#btnSucks1");
				btn2 = $("#btnSucks2");

				if (Rather.user_sucks.rather1 > 0) {
					btn1.addClass("btn-sucks-pressed");
				}
				else {
					btn1.removeClass("btn-sucks-pressed");
				}
				if (Rather.user_sucks.rather2 > 0) {
					btn2.addClass("btn-sucks-pressed");
				}
				else {
					btn2.removeClass("btn-sucks-pressed");
				}
			}

			search(comparison);

			$scope.vote = function(winner) {
				comparison = $scope.comparison;
				if (winner === 0) {
					Rather.$vote(comparison[0], comparison[0].id, true).then(function(comparison){
					});
					Rather.$vote(comparison[1], comparison[1].id, false).then(function(comparison){
					});
					$("#btnRather1").unbind("mouseenter mouseleave");
				}
				else if (winner === 1) {
					Rather.$vote(comparison[0], comparison[0].id, false).then(function(comparison){
					});
					Rather.$vote(comparison[1], comparison[1].id, true).then(function(comparison){
					});
					$("#btnRather2").unbind("mouseenter mouseleave");
				}
				Rather.$comparison().then(search);
			};

			$scope.sucks = function(rather) {
				var btn = $("#btnSucks"+(rather+1));
				comparison = $scope.comparison;
				if (btn.hasClass("btn-sucks-pressed")) {
					btn.removeClass("btn-sucks-pressed");
				}
				else {
					btn.addClass("btn-sucks-pressed");
				}
				Rather.$sucks(comparison[rather], comparison[rather].id).then(function(comparison){
				});
			};
		}
	})
	.state('top',{
		url:'/top',
		templateUrl:'rathers/partials/rathers.top.tpl.html',
		resolve: {
			'ranked':function(Rather){
				return Rather.$ranked();
			}
		},
		controller: function($scope, $uibModal, Rather, ranked, lodash){
			$scope.ranked = ranked;
			$("#defaultActive").focus();
			$scope.predicate = '-ratio';
			$scope.order = function(predicate) {
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
			};

			$scope.rather_info = function (rather) {
		    var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'ratherinfo.html',
						controller: function($scope, $filter, $uibModalInstance) {
								var obj = lodash.find(ranked, {"id": rather});
								var title = obj.rather_text;
								$scope.header_text = title.charAt(0).toUpperCase() + title.substr(1);
								$scope.user = obj.user.username;
								$scope.date = $filter('date')(obj.date_submitted, "MM/dd/yyyy");
								$scope.wins = obj.wins;
								$scope.losses = obj.losses;
								$scope.score = obj.ratio;
								$scope.sucks = obj.this_sucks;

								$scope.close = function () {
									$uibModalInstance.close();
								};
						},
						windowClass: 'rather-info-modal'
				});
			};
		}
	})
	.state('submit',{
		url:'/submit',
		templateUrl:'rathers/partials/rathers.submit.tpl.html',
		resolve: {
			'comparison':function(Rather){
				return Rather.$comparison();
			},
			'current_user':function(Account){
				return Account.$current();
			}
		},
		controller: function ($scope, $state, Rather, Account, current_user, comparison) {
			if (!Account.logged_in) {
				$state.go("otherwise");
			}
			$scope.comparison = comparison.rathers;
			debugger;
			$scope.create = function(){
				var newRather = {
					rather_text: ($scope.rather) ? $scope.rather.rather_text : "",
					user: current_user.id
				};
				var error = $('#blankSubmitError');
				if ($scope.response()) {
					Rather.$create(newRather).then(function(rather){
						$scope.clear();
						$scope.refresh();
					});
				}
			};
			$scope.response = function() {
				var error = $("#blankSubmitError");
				var feedback = $scope.feedback();
				var randomNum = Math.floor(Math.random() * feedback.length);
				if ($scope.rather === undefined || $scope.rather.rather_text === null || $scope.rather.rather_text === "") {
					error.removeClass('errorNo');
					error.addClass('errorYes');
					error.text("* You gotta enter some text, dummy");
					setTimeout(function() { error.removeClass('errorYes');error.addClass('errorNo');
						setTimeout(function() { error.text("."); }, 1100);
					}, 1100);
					return false;
				}
				else {
					error.text(feedback[randomNum]);
					error.addClass('errorYes');
					setTimeout(function() { error.removeClass('errorYes');error.addClass('errorNo');
						setTimeout(function() { error.text("."); }, 1100);
					}, 1100);
					return true;
				}
			};
			$scope.feedback = function() {
				var feedbackArray = [
				"...seriously?",
				"Ohhhh, good one",
				"Nice",
				"That's kind of messed up, but ok...",
				"Dude.",
				"Are you happy?",
				"Wow...",
				"Too far",
				"Sure, that makes sense.",
				"Ok, that one was actually pretty good",
				"Just... super great.",
				"I'll allow it",
				"Approved",
				"ayyyyy lmao",
				"( ͡° ͜ʖ ͡°)",
				"ಠ_ಠ",
				"lol"
				];
				return feedbackArray;
			};
			$scope.clear = function() {
				$scope.rather.rather_text = null;
			};
			$scope.refresh = function() {
				Rather.$comparison().then(function(comparison) {
					$scope.comparison = comparison.rathers;
				});
			};
		}
	})
	.state('signup',{
		url: '/signup',
		templateUrl: 'account/partials/account.signup.tpl.html',
		controller: function($scope, Account, $state){
			var error = $("#blankSubmitError");
			var username = $("#txtUsername");
			var email = $("#txtEmail");
			var pw1 = $("#txtPassword1");
			var pw2 = $("#txtPassword2");
			var msg = "Please fill out required fields";
			$scope.save_user = function() {
				if ($scope.validates()) {
					Account.$save_user($scope.account).then(function(data){
						Account.$login($scope.account.username, $scope.account.password).then(function(object){
							$state.go("welcome");
						});
					});
					$scope.$on('SAVE_USER_ERROR', function(event, data) {
					var isError = 0;
					var error = $("#blankSubmitError");
					var errorObj = Account.save_error;

					if (errorObj.email !== undefined) {
						isError++;
						email.addClass('alert-danger');
						error.text(errorObj.email[0]);
					}
					else {
						email.removeClass('alert-danger');
					}
					if (errorObj.username !== undefined) {
						isError++;
						username.addClass('alert-danger');
						if (errorObj.username[0] === "This field must be unique." || errorObj.username[0] === "A user with that username already exists.") {
							error.text("This username is already registered");
						}
						else {
							error.text("Username is invalid");
						}
					}
					else {
						username.removeClass('alert-danger');
					}
					if (isError > 0) {
						error.removeClass('errorNo');
						error.addClass('errorYes');
					}
					else {
						error.removeClass('errorYes');
						error.addClass('errorNo');
					}
				});
				}
			};
			$scope.validates = function() {
				var isError = 0;
				if ($scope.account === undefined || $scope.account.username === null || $scope.account.username === undefined) {
					username.addClass('alert-danger');
					error.text(msg);
					isError++;
				}
				else {
					username.removeClass('alert-danger');
				}
				if ($scope.account === undefined || $scope.account.email === null || $scope.account.email === undefined) {
					email.addClass('alert-danger');
					error.text(msg);
					isError++;
				}
				else {
					email.removeClass('alert-danger');
				}
				if ($scope.account === undefined || $scope.account.password === null || $scope.account.password === undefined) {
					pw1.addClass('alert-danger');
					error.text(msg);
					isError++;
				}
				else {
					if ($scope.account.password.length < 6) {
						error.text("Password must be at least 6 characters long");
						isError++;
					}
					else {
						pw1.removeClass('alert-danger');
					}
				}
				if ($scope.account === undefined || $scope.account.password2 === null || $scope.account.password2 === undefined) {
					pw2.addClass('alert-danger');
					error.text(msg);
					isError++;
				}
				else {
					if ($scope.passwordsMatch()) {
						isError++;
					}
					else {
						pw2.removeClass('alert-danger');
					}
				}
				if (isError > 0) {
					error.removeClass('errorNo');
					error.addClass('errorYes');
				}
				else {
					error.removeClass('errorYes');
					error.addClass('errorNo');
					return true;
				}
				return false;
			};
			$scope.passwordsMatch = function() {
				var isError = false;
				if ($scope.account !== undefined) {
					if ($scope.account.password !== undefined) {
						if ($scope.account.password === $scope.account.password2 || $scope.account.password2 === undefined) {
							pw2.removeClass('alert-danger');
							isError = false;
						}
						else {
							error.text("Passwords do not match");
							pw2.addClass('alert-danger');
							isError = true;
						}
					}
					if (isError) {
						error.removeClass('errorNo');
						error.addClass('errorYes');
					}
					else {
						error.removeClass('errorYes');
						error.addClass('errorNo');
					}
				}
				return isError;
			};
		},
		data: []
	})
	.state('login',{
		url: '/login',
		templateUrl: 'account/partials/account.login.tpl.html',
		controller: function($scope, Account, $state){
			$scope.$on('USER_LOGGED_IN', function(event, data) {
				if (Account.logged_in === true) {
					$state.go("welcome");
				}
			});
			$scope.login = function(){
				Account.$login($scope.account.username, $scope.account.password).then(function(object){
					$state.go("welcome");
				});

				$scope.$on('LOGIN_USER_ERROR', function(event, data) {
					var username = $("#txtUsername");
					var password = $("#txtPassword");
					var isError = 0;
					var error = $("#blankSubmitError");
					var errorObj = Account.login_error;
					if (errorObj.username !== undefined) {
						isError++;
						username.addClass('alert-danger');
						if (errorObj.username[0] === "This field is required.") {
							error.text("Username required");
						}
					}
					else {
						username.removeClass('alert-danger');
					}
					if (errorObj.password !== undefined) {
						isError++;
						password.addClass('alert-danger');
						if (errorObj.password[0] === "This field is required.") {
							error.text("Password required");
						}
					}
					else {
						password.removeClass('alert-danger');
					}
					if (errorObj.non_field_errors !== undefined) {
						isError++;
						if (errorObj.non_field_errors[0] === "Unable to log in with provided credentials.") {
							error.text("Incorrect username or password");
						}
					}
					if (isError > 0) {
						error.removeClass('errorNo');
						error.addClass('errorYes');
					}
					else {
						error.removeClass('errorYes');
						error.addClass('errorNo');
					}
				});
			};
			$scope.keyDown = function() {
				alert('hey');
			};
			$scope.recoverPassword = function () {
				$state.go("recoverpw");
			};
		}
	})
	.state('welcome',{
		url: '/welcome?u',
		templateUrl: 'account/partials/account.welcome.tpl.html',
		resolve: {
			'current':function(Account, $stateParams){
				return Account.current_user;
			}
		},
		controller: function($scope, Account, current, $state){
			$scope.current = current;
			$scope.$on('USER_LOGGED_IN', function(event, data) {
				$scope.current = Account.current_user;
			});
			$scope.play = function(){
				$state.go("play");
			};
		}
	})
	.state('user',{
		url: '/user',
		templateUrl: 'account/partials/account.user.tpl.html',
		resolve: {
			'user_rathers':function(Rather){
				return Rather.$user_data();
			}
		},
		controller: function($scope, $uibModal, Account, Rather, $state, user_rathers, lodash){
			$scope.user_rathers = user_rathers;

			$scope.logout = function(){
				Account.$logout();
				$state.go("play");
			};

			$scope.rather_info = function (rather) {
		    var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'ratherinfo.html',
						controller: function($scope, $filter, $uibModalInstance) {
								var obj = lodash.find(user_rathers, {"id": rather});
								var title = obj.rather_text;
								$scope.header_text = title.charAt(0).toUpperCase() + title.substr(1);
								$scope.date = $filter('date')(obj.date_submitted, "MM/dd/yyyy");
								$scope.wins = obj.wins;
								$scope.losses = obj.losses;
								$scope.score = obj.ratio;
								$scope.sucks = obj.this_sucks;
								$scope.active = (obj.active) ? "Yep" : "Nope";

								$scope.close = function () {
									$uibModalInstance.close();
								};
						},
						windowClass: 'rather-info-modal'
				});
			};
		}
	})
	.state('resetpassword',{
		url: '/resetpw',
		templateUrl: 'account/partials/account.resetpw.tpl.html',
		controller: function() {

		}
	})
	.state('recoverpw',{
		url: '/recoverpw',
		templateUrl: 'account/partials/account.recoverpw.tpl.html',
		controller: function($scope, Account, $state) {
			$scope.send_email = function(){
				Account.$send_email();
			};
		}
	})
	.state('about',{
		url: '/about',
		templateUrl: 'landing/partials/about.tpl.html',
		controller: function() {

		}
	})
	.state('otherwise', {
		url: '*path',
		templateUrl: 'landing/partials/landing.tpl.html'
	});
	BCConfigProvider.setApiBase(API_DOMAIN);
}])
;

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
			$scope.stats = function (rather) {
		    var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: 'ratherstats.html',
						controller: function($scope, $filter, $uibModalInstance, Rather) {
								debugger;
								var title = comparison[rather].rather_text;
								$scope.header_text = title.charAt(0).toUpperCase() + title.substr(1);
								$scope.user = comparison[rather].user;
								$scope.date = $filter('date')(comparison[rather].date_submitted, "MM/dd/yyyy");
								$scope.wins = comparison[rather].wins;
								$scope.losses = comparison[rather].losses;
								$scope.score = comparison[rather].ratio;
								$scope.sucks = comparison[rather].this_sucks;

								$scope.close = function () {
									$uibModalInstance.close();
								};
						},
						windowClass: 'rather-modal'
				});
			};

			function search(Rather) {
				$scope.comparison = Rather;
				$location.search("r1", Rather[0].id);
				$location.search("r2", Rather[1].id);
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
				comparison = $scope.comparison;
				if (rather === 0) {
					Rather.$sucks(comparison[0], comparison[0].id).then(function(comparison){
					});
				}
				else if (rather === 1) {
					Rather.$sucks(comparison[1], comparison[1].id).then(function(comparison){
					});
				}
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
		controller: function($scope, Rather, ranked){
			$scope.ranked = ranked;
			$("#defaultActive").focus();
			$scope.predicate = '-ratio';
			$scope.order = function(predicate) {
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
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
			$scope.comparison = comparison;
			$scope.create = function(){
				var newRather = {
					rather_text: $scope.rather.rather_text,
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
					return false;
				}
				else {
					error.text(feedback[randomNum]);
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
					$scope.comparison = comparison;
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
		controller: function($scope, Account, Rather, $state, user_rathers){
			$scope.user_rathers = user_rathers;

			$scope.logout = function(){
				Account.$logout();
				$state.go("play");
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
	.state('otherwise', {
		url: '*path',
		templateUrl: 'landing/partials/landing.tpl.html'
	});
	BCConfigProvider.setApiBase(API_DOMAIN);
}])
;

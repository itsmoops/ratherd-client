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
	'wouldyourather.config'
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
		controller: function($scope, Rather, comparison, $location){
			function search(Rather) {
				$scope.comparison = Rather;
				$location.search("r1", Rather[0].id);
				$location.search("r2", Rather[1].id);
			}

			search(comparison);

			$scope.vote = function(winner) {
				comparison = $scope.comparison;

				if (winner === "0") {
					Rather.$vote(comparison[0], comparison[0].id, true).then(function(comparison){
					});
					Rather.$vote(comparison[1], comparison[1].id, false).then(function(comparison){
					});
				}
				else if (winner === '1') {
					Rather.$vote(comparison[0], comparison[0].id, false).then(function(comparison){
					});
					Rather.$vote(comparison[1], comparison[1].id, true).then(function(comparison){
					});
				}
				Rather.$comparison().then(search);
			};

			$scope.popup = function() {
				alert('hey');
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
			document.querySelector("#defaultActive").focus();
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
			}
		},
		controller: function ($scope, Rather, comparison) {
			$scope.comparison = comparison;
			$scope.create = function(){
				var error = document.querySelector('#blankSubmitError');
				if ($scope.response()) {
					Rather.$create($scope.rather).then(function(rather){
						$scope.clear();
						$scope.refresh();
					});
				}
			};
			$scope.response = function() {
				var error = document.getElementById("blankSubmitError");
				var feedback = $scope.feedback();
				var randomNum = Math.floor(Math.random() * feedback.length);
				if ($scope.rather === undefined || $scope.rather.rather_text === null || $scope.rather.rather_text === "") {
					error.innerText = "* You gotta enter some text, dummy";
					error.style.color = "#FF8875";
					return false;
				}
				else {
					error.innerText = feedback[randomNum];
					error.style.color = "#FF8875";
					setTimeout(function() { error.style.color = "#222222";
						setTimeout(function() { error.innerText = "."; }, 1100);
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
			var error = document.querySelector("#blankSubmitError");
			var username = document.querySelector("#txtUsername");
			var email = document.querySelector("#txtEmail");
			var pw1 = document.querySelector("#txtPassword1");
			var pw2 = document.querySelector("#txtPassword2");
			var msg = "Please fill out required fields";
			$scope.save_user = function() {
				if ($scope.validates()) {
					Account.$save_user($scope.account).then(function(data){
						Account.$login($scope.account.username, $scope.account.password).then(function(object){ 
							$state.go("welcome", { u: object.user.id });
						});
					});
					$scope.$on('SAVE_USER_ERROR', function(event, data) { 
					var isError = 0;
					var error = document.querySelector("#blankSubmitError");
					var errorObj = Account.save_error;
					
					if (errorObj.email !== undefined) {
						isError++;
						email.classList.add('alert-danger');
						error.innerText = errorObj.email[0];
					}
					else {
						email.classList.remove('alert-danger');
					}
					if (errorObj.username !== undefined) {
						isError++;
						username.classList.add('alert-danger');
						if (errorObj.username[0] === "This field must be unique." || errorObj.username[0] === "A user with that username already exists.") {
							error.innerText = "This username is already registered";
						}
						else {
							error.innerText = "Username is invalid";
						}
					}
					else {
						username.classList.remove('alert-danger');
					}
					if (isError > 0) {
						error.classList.remove('errorNo');
						error.classList.add('errorYes');
					}
					else {
						error.classList.remove('errorYes');
						error.classList.add('errorNo');
					}
				});
				}
			};
			$scope.validates = function() {
				var isError = 0;
				if ($scope.account === undefined || $scope.account.username === null || $scope.account.username === undefined) {
					username.classList.add('alert-danger');
					error.innerText = msg;
					isError++;
				}
				else {
					username.classList.remove('alert-danger');
				}
				if ($scope.account === undefined || $scope.account.email === null || $scope.account.email === undefined) {
					email.classList.add('alert-danger');
					error.innerText = msg;
					isError++;
				}
				else {
					email.classList.remove('alert-danger');
				}
				if ($scope.account === undefined || $scope.account.password === null || $scope.account.password === undefined) {
					pw1.classList.add('alert-danger');
					error.innerText = msg;
					isError++;
				}
				else {
					pw1.classList.remove('alert-danger');
				}
				if ($scope.account === undefined || $scope.account.password2 === null || $scope.account.password2 === undefined) {
					pw2.classList.add('alert-danger');
					error.innerText = msg;
					isError++;
				}
				else {
					pw2.classList.remove('alert-danger');
				}
				if (isError > 0) {
					error.classList.remove('errorNo');
					error.classList.add('errorYes');
				}
				else {
					error.classList.remove('errorYes');
					error.classList.add('errorNo');
					return true;
				}
				return false;
			};
			$scope.changing = function() {
				var isError = false;
				if ($scope.account !== undefined) {
					if ($scope.account.password !== undefined) {
						if ($scope.account.password === $scope.account.password2 || $scope.account.password2 === undefined) {
							pw2.classList.remove('alert-danger');
							isError = false;
						}
						else {
							error.innerText = "Passwords do not match";
							pw2.classList.add('alert-danger');
							isError = true;
						}
					}
					if (isError) {
						error.classList.remove('errorNo');
						error.classList.add('errorYes');
					}
					else {
						error.classList.remove('errorYes');
						error.classList.add('errorNo');
					}
				}
			};
		},
		data: []
	})
	.state('login',{
		url: '/login',
		templateUrl: 'account/partials/account.login.tpl.html',
		controller: function($scope, Account, $state){
			$scope.login = function(){
				Account.$login($scope.account.username, $scope.account.password).then(function(object){
					$scope.user = object.user;
					$scope.loggedIn = true;
					$state.go("welcome", {});
				});

				$scope.$on('LOGIN_USER_ERROR', function(event, data) {
					var username = document.querySelector("#txtUsername");
					var password = document.querySelector("#txtPassword"); 
					var isError = 0;
					var error = document.querySelector("#blankSubmitError");
					var errorObj = Account.login_error;
					if (errorObj.username !== undefined) {
						isError++;
						username.classList.add('alert-danger');
						if (errorObj.username[0] === "This field is required.") {
							error.innerText = "Username required";
						}
					}
					else {
						username.classList.remove('alert-danger');
					}
					if (errorObj.password !== undefined) {
						isError++;
						password.classList.add('alert-danger');
						if (errorObj.password[0] === "This field is required.") {
							error.innerText = "Password required";
						}
					}
					else {
						password.classList.remove('alert-danger');
					}
					if (errorObj.non_field_errors !== undefined) {
						isError++;
						if (errorObj.non_field_errors[0] === "Unable to log in with provided credentials.") {
							error.innerText = "Incorrect username or password";
						}
					}
					if (isError > 0) {
						error.classList.remove('errorNo');
						error.classList.add('errorYes');
					}
					else {
						error.classList.remove('errorYes');
						error.classList.add('errorNo');
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
				return Account.$current({
					u: $stateParams.u
				});
			}
		},
		controller: function($scope, Account, current, $location, $state){
			$scope.current = current;
			search(current);

			function search(current) {
				$scope.current = current;
				$location.search("u", current[0].id);
			}
			$scope.play = function(){
				$state.go("play");
			};
		}
	})
	.state('user',{
		url: '/user',
		templateUrl: 'account/partials/account.user.tpl.html',
		controller: function($scope, Account, $state){
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
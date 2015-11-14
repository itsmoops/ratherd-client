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
	'ui.router'
])

// .config(["$locationProvider", function($locationProvider) {
//   $locationProvider.html5Mode(true);
// }])

// Using ui.router stateProvider to define single page application states
.config(['$stateProvider', function($stateProvider) {
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
				$location.search("rather1", Rather[0].id);
				$location.search("rather2", Rather[1].id);
				console.log("git merge");
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
			document.getElementById("defaultActive").focus();
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
				var error = document.getElementById('blankSubmitError');
				$scope.response();
				Rather.$create($scope.rather).then(function(rather){
					$scope.clear();
					$scope.refresh();
				});
			};
			$scope.response = function() {
				var error = document.getElementById("blankSubmitError");
				var feedback = $scope.feedback();
				var randomNum = Math.floor(Math.random() * feedback.length);
				if ($scope.rather === undefined || $scope.rather.rather_text === null) {
					error.innerText = "* You gotta enter some text, dummy";
					error.style.color = "#FF8875";
				}
				else {
					error.innerText = feedback[randomNum];
					error.style.color = "#FF8875";
					setTimeout(function() { error.style.color = "#222222";
						setTimeout(function() { error.innerText = "."; }, 1100);
					}, 1100);
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
				"Approved"
				// "ayyyyy lmao",
				// "( ͡° ͜ʖ ͡°)", 
				// "ಠ_ಠ",
				// "lol"
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
			$scope.save_user = function(){
				var error = document.getElementById('blankSubmitError');
				Account.$save_user($scope.account).then(function(account){
					$scope.account = account;
					$state.go("welcome", { u: $scope.account.id });
				});
			};
		}
	})
	.state('login',{
		url: '/login',
		templateUrl: 'account/partials/account.login.tpl.html',
		controller: function($scope, Account, $state){
			$scope.login = function(){
				Account.$login($scope.account.username, $scope.account.password).then(function(object){
					$scope.user = object.user;
					$scope.loggedIn = true;
					$state.go("welcome", { u: object.user.id });
				});
			};

			$scope.keyDown = function() {
				alert('hey');
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

			$scope.lostPassword = function () {
				$state.go("lostpassword");
			};
		}
	})
	.state('lostpassword',{
		url: '/lostpassword',
		templateUrl: 'account/partials/account.lostpassword.tpl.html',
		controller: function() {

		}
	})
	.state('otherwise', {
		url: '*path',
		templateUrl: 'landing/partials/landing.tpl.html'
	})
	;
}])
;
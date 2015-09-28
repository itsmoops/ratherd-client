/*jshint smarttabs:true */
angular.module("RatherApp", [
	'landing.directives',
	'navigation.directives',
	'rather.directives',
	'rather.models',
	'templates-app',
	'templates-common',
	'ui.router'
])

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
				console.log(Rather, 'hey');
				$scope.comparison = Rather;
				$location.search("rather1", Rather[0].id);
				$location.search("rather2", Rather[1].id);
			}

			search(comparison);

			$scope.vote = function(winner) {
				comparison = $scope.comparison;
				console.log(comparison[0].id, comparison[1].id);

				if (winner === "0") {
					Rather.$vote(comparison[0], comparison[0].id, true).then(function(comparison){
						console.log(comparison);
					});
					Rather.$vote(comparison[1], comparison[1].id, false).then(function(comparison){
						console.log(comparison);
					});
				}
				else if (winner === '1') {
					Rather.$vote(comparison[0], comparison[0].id, false).then(function(comparison){
						console.log(comparison);
					});
					Rather.$vote(comparison[1], comparison[1].id, true).then(function(comparison){
						console.log(comparison);
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
			console.log(ranked);
			document.getElementById("defaultActive").focus();

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
					console.log(rather);
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
	.state('otherwise', {
		url: '*path',
		templateUrl: 'landing/partials/landing.tpl.html'
	})
	;
}])
;
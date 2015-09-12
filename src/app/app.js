/*jshint smarttabs:true */
angular.module("RatherApp", [
	'landing.directives',
	'navigation.directives',
	'rather.directives',
	'rather.models',
	'templates-app',
	'templates-common',
	'ngAnimate',
	'ui.router'
])

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
	.state('landing',{
		url: '/home',
		templateUrl: 'landing/partials/landing.tpl.html'
	})
	.state('play',{
		url:'/play',
		templateUrl: 'rathers/partials/rathers.comparison.tpl.html',
		resolve: {
			'comparison':function(Rather){
				return Rather.$comparison();
			}
		},
		controller: function($scope, Rather, comparison){
			$scope.comparison = comparison;
			$scope.vote = function(winner) {
				comparison = $scope.comparison;
				console.log(comparison[0].id, comparison[1].id);
				if (winner === '0') {
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
				// Comment this out and watch the console to ensure voting system is working
				Rather.$comparison().then(function(comparison){
					$scope.comparison = comparison;
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
		controller: function($scope, Rather, ranked){
			document.getElementById('defaultActive').focus();
			$scope.ranked = ranked;

			$scope.predicate = '-ratio';
			$scope.reverse = true;
			$scope.order = function(predicate) {
				$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
				$scope.predicate = predicate;
			};
		}
	})
	.state('submit',{
		url:'/submit',
		templateUrl:'rathers/partials/rathers.submit.tpl.html',
		controller: function ($scope, Rather) {
			$scope.create = function(){
				console.log($scope.rather);
				var error = document.getElementById('blankSubmitError');
				var successArray = $scope.feedback();
				var randomNum = Math.floor(Math.random() * successArray.length);

				if ($scope.rather === undefined || $scope.rather.rather_text === null) {
					error.innerText = '* You gotta enter some text, dummy';
					error.style.color = '#FF8875';
				}
				else {
					error.innerText = successArray[randomNum];
					error.style.color = '#FF8875';
					
					setTimeout(function(){ 
						error.style.color = '#222222';
						setTimeout(function(){ error.innerText = '.'; }, 1100);
					 }, 1100);
					
				}
				Rather.$create($scope.rather).then(function(rather){
					console.log(rather);
					$scope.clear();
				});
			};
			$scope.clear = function() {
				$scope.rather.rather_text = null;
			};

			$scope.feedback = function() {
				var successArray = [
				"...seriously?", 
				"Ohhhh, good one", 
				"Nice", 
				"That's kinda messed up, but ok...", 
				"lol",
				"ayyyyy lmao",
				"Dude."
				];
				return successArray;
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
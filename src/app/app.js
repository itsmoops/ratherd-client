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
		templateUrl:'rathers/partials/rathers.top.tpl.html'
	})
	.state('submit',{
		url:'/submit',
		templateUrl:'rathers/partials/rathers.submit.tpl.html',
		controller: function ($scope, Rather) {
			$scope.create = function(){
				console.log($scope.rather);
				var error = document.getElementById('blankSubmitError');
				if ($scope.rather === undefined || $scope.rather.rather_text === null) {
					error.innerText = '* You gotta enter some text, dummy';
					error.style.color = '#FF8875';
				}
				else {
					error.innerText = '.';
					error.style.color = '#222222';
				}
				Rather.$create($scope.rather).then(function(rather){
					console.log(rather);
					$scope.clear();
				});
			};
			$scope.clear = function() {
				$scope.rather.rather_text = null;
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
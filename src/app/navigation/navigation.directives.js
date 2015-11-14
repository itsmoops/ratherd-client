/*jshint smarttabs:true */
angular.module('navigation.directives',[
	'RatherApp',
	'ui.bootstrap',
	'account.models'
])

.directive('navigationBar', function(Account){
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'navigation/partials/navigation.tpl.html'
	};
})

.controller('navigation', function($scope, Account, $rootScope){
		$scope.isCollapsed = true;
		$scope.loggedInFalse = true;
		$scope.loggedInTrue = false;

		$scope.$on('updateUser', function(event, data) { 
			$scope.user = Account.current_user.username;
			$scope.updateNav();
			console.log(Account.current_user.email);
		});

		$scope.updateNav = function() {
			// $scope.loggedIn = true;
			if ($scope.loggedInFalse === true && $scope.loggedInTrue === false) {
				$scope.loggedInFalse = false;
				$scope.loggedInTrue = true;
			}
			else {
				$scope.loggedInFalse = true;
				$scope.loggedInTrue = false;
			}
		};
	}
)
;
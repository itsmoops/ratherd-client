/*jshint smarttabs:true */
angular.module('navigation.directives',[
	'ipCookie',
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

.controller('navigation', function($scope, Account, $rootScope, $http, ipCookie){
		$scope.isCollapsed = true;
		$scope.loggedInFalse = true;
		$scope.loggedInTrue = false;



		$scope.$on('USER_LOGGED_IN', function(event, data) { 
			$scope.user = Account.current_user.username;
			$scope.updateNav();
		});
		$scope.$on('USER_LOGGED_OUT', function(event, data) { 
			$scope.user = null;
			$scope.updateNav();
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
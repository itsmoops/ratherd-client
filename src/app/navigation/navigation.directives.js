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

.controller('navigation', function($scope, Account, $state, $rootScope, $http, ipCookie){
		$scope.isCollapsed = true;
		$scope.loggedInFalse = true;
		$scope.loggedInTrue = false;
		checkSize();

		$( window ).resize(function() {
			checkSize();
		});

		$scope.logout = function(){
			Account.$logout();
			$state.go("landing");
		};

		function checkSize() {
			if (window.innerWidth < 768) {
				$scope.info = "About";
			}
			else {
				$scope.info = "";
			}
		}

		$scope.$on('USER_LOGGED_IN', function(event, data) {
			$scope.user = Account.current_user.username;
			$scope.updateNav();
		});
		$scope.$on('USER_LOGGED_OUT', function(event, data) {
			$scope.user = null;
			$scope.updateNav();
		});

		$scope.updateNav = function() {
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

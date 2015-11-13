angular.module('account.directives',[

])

.directive('accountSignup', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'landing/partials/account.signup.tpl.html'
	};
})

.directive('accountLogin', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'landing/partials/account.login.tpl.html'
	};
})

.directive('accountWelcome', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'landing/partials/account.welcome.tpl.html'
	};
})

;
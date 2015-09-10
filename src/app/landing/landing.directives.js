angular.module('landing.directives',[

])

.directive('landingPage', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'landing/partials/landing.tpl.html'
	};
})

;
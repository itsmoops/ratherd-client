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

.directive('aboutPage', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'landing/partials/about.tpl.html'
	};
})

;

angular.module('rather.directives',[

])

.directive('ratherInfo', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'rathers/partials/rathers.comparison.tpl.html'
	};
})

.directive('ratherSubmit', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'rathers/partials/rathers.submit.tpl.html'
	};
})

.directive('ratherTop', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'rathers/partials/rathers.top.tpl.html'
	};
})

;
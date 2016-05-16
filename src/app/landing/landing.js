angular.module("rather.landing", [
])
.config(['$stateProvider', function($stateProvider) {
	$stateProvider
	.state('landing',{
		url: '/home',
		templateUrl: 'landing/partials/landing.tpl.html'
	});
}])
;

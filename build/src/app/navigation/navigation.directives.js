angular.module('navigation.directives',[
	'ui.bootstrap'
])

.directive('navigationBar', function() {
	return {
		restrict: 'E',
		scope: {
			info: '='
		},
		templateUrl: 'navigation/partials/navigation.tpl.html'
	};
})
;
function NavBarCtrl($scope) {
	$scope.isCollapsed = true;
}

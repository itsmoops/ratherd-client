angular.module('account.directives',[

])

.directive('validatePassword', function() {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.charCode === 13) {
				console.log(event.charCode);
				return true;
			}
		});
	};
})

;
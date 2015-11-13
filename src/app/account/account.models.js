/*jshint smarttabs:true */
angular.module('account.models',[
	'ipCookie',
	'navigation.directives'
])
.factory('Account', function($http, $q, ipCookie, $location, $rootScope){
	function Account () {
		
	}
	var _constructor = Account;
	var _prototype = Account.prototype;
	_constructor.apiBase = 'http://127.0.0.1:8080';
	_constructor.api = '/users/';
	_constructor.current_user = null;
	_constructor.is_user = false;

	_constructor.$current = function(parameters) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'current/';
		$http({method: 'GET', url:url, params: parameters }).success(function(data, status, headers, config){
			defer.resolve(data);
		})
		.error(function(data, status, headers, config){
			defer.reject(data);
		});
		return defer.promise;
	};

	_constructor.$save_user = function(obj) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api;
		$http({method: 'POST', url:url, data:obj})
		.success(function (data, status, headers, config) {
			defer.resolve(data);
		})
		.error(function (data, status, headers, config) {
			defer.reject(data);
		});
		return defer.promise;
    };

    _constructor.$login = function(username, password){
		var defer = $q.defer();
		var url = _constructor.apiBase + '/api-token-auth/';
		$http({
			method:'POST',
			url: url,
			data: {username:username, password:password}
		})
		.success(function (data, status, headers, config){
			_constructor.current_user = data.user.username;
			$rootScope.$broadcast('updateUser');
			// showItem.getUserInfo(data.user, true);
			defer.resolve(data);
		})
		.error(function (data, status, headers, config){
			defer.reject(data);
			console.log(username, password);
		});
		return defer.promise;
	};

	_constructor.$logout = function(){
		// var defer = $q.defer();
		_constructor.removeToken();
		_constructor.current_user = null;
		$rootScope.$broadcast('updateUser');
		// $scope.$apply();
		// return defer.promise;
	};

	_constructor.setToken = function(token){
		$http.defaults.headers.common['Authorization'] = 'Token ' + token;
		ipCookie('usertoken', token, {expires: 365});
	};

	_constructor.removeToken = function(){
		$http.defaults.headers.common['Authorization'] = '';
		ipCookie.remove('usertoken', {expires: -1});
	};

	_constructor.getCurrent = function(){
		var hookback = _constructor.getHookBack();
		var defer = $q.defer();
		Profile.$list_route('GET', 'current', {}, {'hookback':hookback}).then(function(user){
			if (user.id){
				user = Profile.newInstance(user);
				_constructor.current = user;
				$broadcast('USER_LOGGED_IN', user);
				defer.resolve(user);
			} else {
				defer.resolve(false);
			}
		}, function(data){
			defer.resolve(user);
		});
		return defer.promise;
	};

	return Account;
})
;
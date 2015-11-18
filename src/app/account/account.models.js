/*jshint smarttabs:true */
angular.module('account.models',[
	'ipCookie',
	'navigation.directives',
	'BaseClass'
])
.run(function($state, $rootScope, Account, ipCookie){
	if (ipCookie('usertoken')) {
		Account.setToken(ipCookie('usertoken'));
		Account.requestCurrent();
	}	
})
.factory('Account', function($http, $q, ipCookie, $location, $rootScope, BaseClass){
	function Account () {
		
	}
	var _constructor = Account;
	var _prototype = Account.prototype;
	_constructor.inherits(BaseClass.Base);
	_constructor.api = '/users/';
	_constructor.current_user = null;
	_constructor.is_user = false;
	_constructor.save_error = null;
	_constructor.login_error = null;
	_constructor.current = null;

	_constructor.$current = function(parameters) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'current/';
		$http({method: 'GET', url:url, params: parameters }).success(function(data, status, headers, config){
			console.log(data);
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
			_constructor.save_error = data;
			$rootScope.$broadcast('SAVE_USER_ERROR');
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
			_constructor.current_user = data.user;
			_constructor.setToken(data.token);
			$rootScope.$broadcast('USER_LOGGED_IN');
			defer.resolve(data);
		})
		.error(function (data, status, headers, config){
			defer.reject(data);
			_constructor.login_error = data;
			$rootScope.$broadcast('LOGIN_USER_ERROR');
		});
		return defer.promise;
	};

	_constructor.$logout = function(){
		_constructor.removeToken();
		_constructor.current_user = null;
		$rootScope.$broadcast('USER_LOGGED_OUT');
	};

	_constructor.setToken = function(token){
		$http.defaults.headers.common['Authorization'] = 'Token ' + token;
		ipCookie('usertoken', token, {expires: 365});
	};

	_constructor.requestCurrent = function(){
		if (_constructor.currentIsSet()){
			return $q.when(_constructor.current);
		} else {
			return _constructor.getCurrent();
		}
	};

	_constructor.currentIsSet = function(){
		return !!_constructor.current;  
	};

	_constructor.removeToken = function(){
		$http.defaults.headers.common['Authorization'] = '';
		ipCookie.remove('usertoken', {expires: -1});
	};

	_constructor.getCurrent = function(){
		var hookback = _constructor.getHookBack();
		var defer = $q.defer();
		Account.$current('GET', 'current', {}, {'hookback':hookback}).then(function(user){
			if (user[0].id){
				_constructor.current_user = user[0];
				console.log(user[0].id);
				$rootScope.$broadcast('USER_LOGGED_IN', user[0]);
				defer.resolve(user);
			} else {
				_constructor.current_user = null;
				defer.resolve(false);
			}
		}, function(data){
			defer.resolve(user);
		});
		return defer.promise;
	};

	_constructor.getHookBack = function(){
		var hb = $location.search()['hb'];
		$location.search('hb', null);
		return hb;
	};

	_constructor.$send_email = function(){
		alert('models');
	};

	return Account;
})
;
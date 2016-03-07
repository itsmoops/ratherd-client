/*jshint smarttabs:true */
angular.module('rather.models',[

])
.factory('Rather', function($http, $q){
	function Rather () {

	}
	var _constructor = Rather;
	var _prototype = Rather.prototype;
	_constructor.inherits(BaseClass.Base);
	_constructor.api = '/rathers/';

	_constructor.$comparison = function(parameters) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'comparison/';
		$http({method: 'GET', url:url, params: parameters }).success(function(data, status, headers, config){
			console.log(data);
			defer.resolve(data);
		})
		.error(function(data, status, headers, config){
			defer.reject(data);
		});
		return defer.promise;
	};

	_constructor.$vote = function(obj, primaryKey, win) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + primaryKey + '/vote/';
		$http({method: 'POST', url:url, data:obj, params:{'win':win}})
		.success(function (data, status, headers, config) {
			defer.resolve(data);
		})
		.error(function (data, status, headers, config) {
			defer.reject(data);
		});
		return defer.promise;
	};

	_constructor.$sucks = function(obj, primaryKey, userId) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + primaryKey + '/sucks/';
		$http({method: 'POST', url:url, data:obj })
		.success(function (data, status, headers, config) {
			defer.resolve(data);
		})
		.error(function (data, status, headers, config) {
			defer.reject(data);
		});
		return defer.promise;
	};

	_constructor.$ranked = function(obj) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'ranked/';
		$http({method: 'GET', url:url }).success(function(data, status, headers, config){
			defer.resolve(data);
		})
		.error(function(data, status, headers, config){
			defer.reject(data);
		});
		return defer.promise;
	};

	_constructor.$user_data = function(obj) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'user_rathers/';
		$http({method: 'GET', url:url }).success(function(data, status, headers, config){
			defer.resolve(data);
		})
		.error(function(data, status, headers, config){
			defer.reject(data);
		});
		return defer.promise;
	};


	_constructor.$create = function(obj) {
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
		return Rather;
	})
;

/*jshint smarttabs:true */
angular.module('rather.models',[

])
.factory('Rather', function($http, $q){
	function Rather () {
		
	}
	var _constructor = Rather;
	var _prototype = Rather.prototype;
	_constructor.apiBase = 'http://127.0.0.1:8080';
	_constructor.api = '/rathers/';

	_constructor.$comparison = function() {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api + 'comparison/';
		$http({method: 'GET', url:url }).success(function(data, status, headers, config){
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

	_constructor.$ranked = function(obj) {
		var defer = $q.defer();
		var url = _constructor.apiBase + _constructor.api;
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
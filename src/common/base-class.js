/*jshint smarttabs:true */
/*jshint -W055 */
Function.prototype.inherits = function(baseclass){
    var _constructor;
    _constructor = this;
    return _constructor = baseclass.apply(_constructor);
};
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function(value) {}
    });
}

function privateVariable(object, name, value){
    var val;
    Object.defineProperty(object, name, {
        enumerable: false,
        configurable: false,
        get: function(){ return val;},
        set: function(newVal){ val=newVal;}
    });

    if (value !== undefined) { object[name] = value; }
}

angular.module('BaseClass', ['ui.router'])
.factory('BaseClass', function(BCBase, BCLibrary){
    BaseClass = {};
    BaseClass.Base = BCBase;
    BaseClass.Library = BCLibrary;
    return BaseClass;
})
.provider('BCConfig', function(){
    var config = {};
    this.setApiBase = function(api_base){
        config.apiBase = api_base;
    };
    this.$get = function(){
        return config;
    };
})
.factory('BCBase', function(BCConfig, BCCache, BCLibrary, $http, $q, $state, $rootScope){
    function Base(attributes){
        BCLibrary.add(this);
        var _constructor = this;
        var _prototype = _constructor.prototype;
        
        var CON_NAME = _constructor.name.toUpperCase();
        
        _constructor.CON_NAME = CON_NAME;
        _prototype.CON_NAME = CON_NAME;

        privateVariable(_constructor, 'primaryKey', 'id');

        _constructor.apiBase = BCConfig.apiBase;
        _constructor.verboseName = _constructor.name;
        _constructor.verboseNamePlural = _constructor.verboseName + 's';

        function cache(instance){
            _constructor.cached.cache(instance, _constructor.primaryKey);
        }

        function updateCached(attributes){
            var cached = _constructor.cached[attributes[_constructor.primaryKey]];
            angular.extend(cached, attributes);
            return cached;
        }

        _constructor.newInstance = function(attributes){
            var instance = new _constructor(attributes);
            if (_constructor.cached[instance[_constructor.primaryKey]]) {
                return updateCached(instance);
            } else {
                cache(instance);
                return instance;
            }
            
        };

        _constructor.newBatch = function(data, lookForKey){
            // check if lookForKey boolean is set, otherwise give a default
            lookForKey = angular.isDefined(lookForKey) ? lookForKey : true;
            
            // get array from data, check if batchkey is set and should be used
            var array = angular.isDefined(_constructor.batchKey) & lookForKey ? data[_constructor.batchKey] : data;
            // create a new instance of the model for each item in array
            for (var i in array){
                array[i] = _constructor.newInstance(array[i]);
            }
            return array;
        };

        _constructor.find = function(primaryKey){
            if (_constructor.cached[primaryKey]) {
                return $q.when(_constructor.cached[primaryKey]);
            }
            return _constructor.$get(primaryKey);
        };

        _constructor.where = function(params){
            if (_constructor.cached.where(params).length > 0) {
                return $q.when(_constructor.cached.where(params));
            }
            return _constructor.$list(params);
        };

        _constructor.$list = function(params){
            params = params || {};
            var url = _constructor.apiBase + _constructor.api;
            var defer = $q.defer();
            $http({method: 'GET', url:url, params:params})
            .success(function (data, status, headers, config) {
                _constructor.newBatch(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.$create = function(obj){
            var url = _constructor.apiBase + _constructor.api;
            var defer = $q.defer();
            $http({method: 'POST', url:url, data:obj})
            .success(function (data, status, headers, config) {
                data = _constructor.newInstance(data);
                _constructor.postCreate(data);
                $rootScope.$broadcast(CON_NAME+'_CREATED', data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.postCreate = function(new_obj){
            // hook in
        };
        _constructor.$get = function(primaryKey){
            var url = _constructor.apiBase + _constructor.api + primaryKey + '/';
            var defer = $q.defer();
            $http({method: 'GET', url:url})
            .success(function (data, status, headers, config) {
                data = _constructor.newInstance(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        };

        _prototype.$refresh = function(){
            var self = this;
            var defer = $q.defer();
            _constructor.$get(this[_constructor.primaryKey]).then(function(response){
                defer.resolve(response);
            }, function(data){
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.$update = function(obj){
            var url = _constructor.apiBase + _constructor.api + obj[_constructor.primaryKey] + '/';
            var defer = $q.defer();
            $http({method: 'PUT', url:url, data:obj})
            .success(function (data, status, headers, config) {
                data = _constructor.newInstance(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.preSave = function(){
            // presave hook for child to override
        };
        _prototype.postSave = function(){
            // presave hook for child to override
        };
        
        _prototype.$save = function(){
            this.preSave();
            var self = this;
            var defer = $q.defer();
            if (this[_constructor.primaryKey]){
                // if it has an id try to update
                _constructor.$update(self).then(function(updatedObj){
                    angular.extend(self, updatedObj);
                    self.postSave();
                    defer.resolve(self);
                }, function(data){
                    defer.reject(data);
                });
            } else {
                // if there is no id, try to save it
                _constructor.$create(self).then(function(newObj){
                    angular.extend(self, newObj);
                    self.postSave();
                    defer.resolve(self);
                }, function(data){
                    defer.reject(data);
                });
            }
            
            return defer.promise;
        };
        _constructor.$destroy = function(obj){
            var url = _constructor.apiBase + _constructor.api + obj[_constructor.primaryKey] + '/';
            var defer = $q.defer();
            $http({method: 'DELETE', url:url, data:obj})
            .success(function (data, status, headers, config) {
                $rootScope.$broadcast(CON_NAME+'_DESTROYED', obj);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.preDestroy = function(){
            return $q.when(this);
        };
        _constructor.postDestroy = function(object){
            // predestroy hook for child to override
        };
        _constructor.$http = function(method, url, data, params){
            data = data || {};
            params = params || {};
            var defer = $q.defer();
            $http({
                method: method,
                url: _constructor.apiBase + url,
                data: data,
                params: params
            })
            .success(function (data, status, headers, config){
                defer.resolve(data);
            })
            .error(function (data, status, headers, config){
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.$destroy = function(){
            var defer = $q.defer();
            this.preDestroy().then(function(obj){
                var redirect = obj.destroyRedirectSref;
                _constructor.$destroy(obj).then(function(data){
                    _constructor.postDestroy(obj);
                    // $stateSup.srefGo(redirect);
                    obj.hide = true;
                    defer.resolve(data);
                }, function(data){
                    defer.reject(data);
                });
            });
            return defer.promise;
        };
        _constructor.$patch = function(primaryKey, data){
            var url = _constructor.apiBase + _constructor.api + primaryKey + '/';
            var defer = $q.defer();
            $http({method: 'PATCH', url:url, data:data})
            .success(function (data, status, headers, config) {
                data = _constructor.newInstance(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.$patch = function(data){
            var self = this;
            var defer = $q.defer();
            _constructor.$patch(this[_constructor.primaryKey], data).then(function(updatedObj){
                defer.resolve(updatedObj);
            }, function(data){
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.$link = function(suburl, obj_id, data, params){
            data = data || {};
            params = params || {};
            var url = _constructor.apiBase + _constructor.api + obj_id + '/' + suburl+'/';
            var defer = $q.defer();
            $http({method: 'GET', url:url, data:data, params:params})
            .success(function (data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                // $alert(data.error, 'warning');
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.$link = function(suburl, data, params){
            return _constructor.$link(suburl, this[_constructor.primaryKey], data, params);
        };
        _constructor.$subAction = function(suburl, obj_id, data, params){
            data = data || {};
            params = params || {};
            var url = _constructor.apiBase + _constructor.api + obj_id + '/' + suburl+'/';
            var defer = $q.defer();
            $http({method: 'POST', url:url, data:data, params:params})
            .success(function (data, status, headers, config) {
                data = _constructor.newInstance(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                // $alert(data.error, 'warning');
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.$action = function(suburl, obj, params){
            return _constructor.$subAction(suburl, obj[_constructor.primaryKey], obj, params).then(function(data){
                data = _constructor.newInstance(data);
                return data;
            });
        };
        _prototype.$action = function(suburl, params){
            return _constructor.$action(suburl, this, params );
        };
        _prototype.$subAction = function(suburl, data, params){
            return _constructor.$subAction(suburl, this.id, data, params );
        };
        _constructor.$batchAction = function(suburl, obj){
            var url = _constructor.apiBase + _constructor.api + obj[_constructor.primaryKey] + '/' + suburl+'/';
            var defer = $q.defer();
            $http({method: 'POST', url:url, data:obj})
            .success(function (data, status, headers, config) {
                _constructor.newBatch(data);
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                // $alert(data.error, 'warning');
                defer.reject(data);
            });
            return defer.promise;
        };
        _constructor.$list_route = function(method, suburl, data, params){
            data = data || {};
            params = params || {};
            var url = _constructor.apiBase + _constructor.api + suburl+'/';
            var defer = $q.defer();
            $http({'method': method, 'url':url, 'data':data, 'params': params})
            .success(function (data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                // $alert(data.error, 'warning');
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.$detail_route = function(method, suburl, data, params){
            data = data || {};
            params = params || {};
            var url = _constructor.apiBase + _constructor.api + this.id +'/'+ suburl+'/';
            var defer = $q.defer();
            $http({'method': method, 'url':url, 'data':data, 'params': params})
            .success(function (data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function (data, status, headers, config) {
                // $alert(data.error, 'warning');
                defer.reject(data);
            });
            return defer.promise;
        };
        _prototype.srefGo = function(){
            // $stateSup.srefGo(this.sref);
        };
        _constructor.cached = new BCCache(); 
    }
    return Base;
})

.factory('BCCache', function(){
    function Cache(){
        privateVariable(this, 'cache', function(instance, primaryKey){
            if (instance && instance[primaryKey] !== undefined){
                if (this[instance[primaryKey]] !== undefined) {
                    this[instance[primaryKey]] = instance;
                } else {
                    this[instance[primaryKey]] = instance;
                }
            }
        });
        privateVariable(this, 'isEmpty', function(){
            return !!(!Object.keys(this).length);
        });
        privateVariable(this, 'where', function(params){
            return _.where(this, params, this);
        });
    }
    return Cache;
})

.factory('BCLibrary', function($injector){
    function Library(){
    }
    var constructors = {};
    var lookup = {};
    Library.add = function(constructor){
        constructors[constructor.name] = constructor;
    };
    Library.checkout = function(constructor_name){
        if (constructors[constructor_name] !== undefined){
            return constructors[constructor_name];
        } else {
            var checkout = constructors[constructor_name] =  $injector.get(constructor_name);
            return checkout;
        }
    };
    Library.lookup = function(constructor_name, key){
        var checkout = constructor_name + key;
        if (lookup[checkout] !== undefined ){
            return lookup[checkout];
        } else {
            lookup[checkout] = Library.checkout(constructor_name)[key];
            return lookup[checkout];
        }
    };
    Library.constructors = function(){
        return constructors;
    };

    return Library;
})
.filter('verboseName', function(BCLibrary){
    return function(constructor_name){
        return BCLibrary.lookup(constructor_name, 'verboseName');
    };
})

.filter('verboseNamePlural', function(BCLibrary){
    return function(constructor_name, count){

        if (count == 1) {
            return BCLibrary.lookup(constructor_name, 'verboseName'); 
        }

        return BCLibrary.lookup(constructor_name, 'verboseNamePlural');

    };
})
.filter('iconClass', function(BCLibrary){
    return function(constructor_name){
        return BCLibrary.lookup(constructor_name, 'iconClass');
    };
})
.directive('objectEditTools', function(){
    return {
        restrict: 'EA',
        templateUrl:"base/partials/object-edit-tools.tpl.html",
        scope:{
            object: '=',
            save: '&', // save function should return a promise.
            cancel: '&', // save function should return a promise.
            alwaysOpen:'=',
            destroy:'&'
        },
        controller: 'objectEditToolsCtrl',
        link:function (scope, element, attrs, ctrl){
            ctrl.init();
        }
    };
})
.directive('objectEdit', function(){
    return {
        restrict: 'A',
        controller: 'objectEditToolsCtrl',
        link:function (scope, element, attrs, ctrl){

            scope.object = scope.$eval(attrs.objectEdit);
            scope.save = function(){
                return scope.$eval(attrs.save);
            };
            scope.cancel = function(){
                return scope.$eval(attrs.cancel);
            };
            scope.destroy = function(){
                return scope.$eval(attrs.destroy);
            };

            ctrl.init();
        }
    };
})
.controller('objectEditToolsCtrl', function($scope, $element, $attrs){
    function createBackup(){
        $scope.object.setBackup = false;
        $scope.backup = _.clone($scope.object);
    }
    $scope.$on("RESET_BACKUP", function(evt, obj){
        if (obj.id == $scope.object.id){
            createBackup();
            
        }
    });
    var preSaveFns = [];
    this.init = function(){
        $scope.canDestroy = 'destroy' in $attrs; 
        createBackup();
    };

    this.addPreSaveFn = function(fn){
        preSaveFns.push(fn);
    };
    var postSaveFns = [];
    this.addPostSaveFn = function(fn){
        postSaveFns.push(fn);
    };
    $scope.commit = function(){
        angular.forEach(preSaveFns, function(preSavefn){
            preSavefn($scope.object, $scope.backup);
        });
        return $scope.save().then(function(data){
            // $alert('Saved', 'success');
            angular.forEach(postSaveFns, function(postSaveFn){
                postSaveFn($scope.object, $scope.backup);
            });
            createBackup();
        });
    };

    $scope.revert = function(){
        if(!$scope.needsSaving()){
            $scope.cancel();
            return;
        }
        if(confirm('Click OK to disreguard your changes')){
            angular.copy($scope.backup, $scope.object);
            $scope.cancel();
        }
    };

    $scope.destroyObj = function(){
        if(confirm('Are you sure you want to delete this?')){
            return $scope.destroy().then(function(data){
                // $alert('Delete successful', 'success');
            });
        }
    };

    $scope.needsSaving = function(){
        return (angular.equals($scope.object, $scope.backup))? false : true;
    };

    $scope.done = function(){
        $scope.editToggle = false;
    };
})
;
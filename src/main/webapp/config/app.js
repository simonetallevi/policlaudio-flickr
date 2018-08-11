
angular.module('Config', ['ngMaterial'])

    .constant('SERVICE', {
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        applicationJson: 'application/json',
        config: {
            url: "update"
        }
    })

    .service('Utils', function ($location, $http, $mdDialog, SERVICE) {
        return {
            reqConfig : function(method, url, action){
                var config = {
                    method: method,
                    url: url,
                    headers: {'Content-Type': SERVICE.contentType}
                };
                if(method === "GET") {
                    config["params"] = {action: action};
                    return config;
                }else{
                    config["data"] = {action: action};
                    return config;
                }
            }
        }
    })

    .service('Message', function($mdDialog){

        return {
            notify : function(title, content){
                var alert = $mdDialog.confirm()
                    .title(title)
                    .content(content)
                    .ok('Ok');
                $mdDialog.show(alert).then(function () {});
            }
        }
    })

    .controller("MainCtrl", function($q, $rootScope, $log, $timeout){
        var self = this;

        self.file = {};
        self.selectedConfig = "CONFIG";
        self.actions = ["CONFIG"];
    })

    .service('ConfigServlet', function($rootScope, $http, SERVICE, Utils){
        return {
            get: function (action) {
                var req = Utils.reqConfig('GET', SERVICE.config.url, action);
                req.params["country"] = $rootScope.selectedCountry;
                req.params["lang"] = $rootScope.selectedLang;
                return $http(req);
            },
            set: function(action, config){
                var req = Utils.reqConfig('POST', SERVICE.config.url, action);
                req.data["config"] = config;
                req.data["country"] = $rootScope.selectedCountry;
                req.data["lang"] = $rootScope.selectedLang;
                return $http(req);
            }
        }
    })

    .directive("config", function() {

        var editor = null;

        var options = {
            mode: 'code',
            modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
            onError: function (err) {
                alert(err.toString());
            },
            onModeChange: function (newMode, oldMode) {
                console.log('Mode switched from', oldMode, 'to', newMode);
            }
        };

        return {
            restrict: "E",
            scope: {
                settings: '=',
                appId: '='
            },
            template : "<div ng-init='init()'>" +
            "   <div ng-if='ready' style='position: absolute;z-index: 10;bottom: 0;right: 0;'>" +
            "       <md-button class='md-raised md-primary' ng-click='loadConfig()'>Reload</md-button>" +
            "       <md-button class='md-raised md-primary' ng-click='storeConfig()'>Store</md-button>" +
            "   </div>" +
            "</div>",
            link: function(scope, elem, attrs) {
                editor = new JSONEditor(elem[0].firstChild, options);
            },
            controller : function($scope, ConfigServlet, Message, $log){
                $scope.ready = false;
                $scope.loadConfig = function(){
                    ConfigServlet.get("GET_"+$scope.settings)
                        .success(function(data){
                            $scope.ready = true;
                            if(data.id && !$scope.appId){
                                $scope.appId = data.id;
                            }
                            editor.set(data);
                        })
                        .error(function(data){
                            $scope.ready = false;
                            editor.set();
                            $log.error(data);
                            Message.notify("Error loading config");
                        });
                };

                $scope.replaceAppId = function(json){
                    var appId = $scope.appId;
                    if(appId && appId.length){
                        var text = JSON.stringify(json);
                        return JSON.parse(text.split("[APP-ID]").join(appId));
                    }
                    return json;
                };

                $scope.storeConfig = function(){
                    var json = editor.get();
                    json = $scope.replaceAppId(json);
                    $log.info(json);
                    ConfigServlet.set("SET_"+$scope.settings, json)
                        .success(function(data){
                            $scope.ready = true;
                            editor.set(data);
                        })
                        .error(function(data){
                            $scope.ready = false;
                            editor.set();
                            $log.error(data);
                            Message.notify("Error storing config");
                        });
                };

                $scope.$watch('settings', function(){
                    $scope.ready = false;
                    $scope.loadConfig();
                });
            }
        }
    });
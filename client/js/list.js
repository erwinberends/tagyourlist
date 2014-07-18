var listapp = angular.module('volunteerapp', ['ngRoute']);

listapp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

listapp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, onSuccess){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            onSuccess(data);
        })
        .error(function(){
        });
    }
}]);

listapp.controller('ListController', ['$scope', 'fileUpload', '$http', function($scope, fileUpload, $http){
    $http.get('/list')
        .success(function(data){
            $scope.lists = data;
        });


    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var uploadUrl = '/list/upload';
        fileUpload.uploadFileToUrl(file, uploadUrl, function(data){
            $scope.list = data;
        });
    };

    $scope.saveList = function(){
        $http.post('/list/save', $scope.list)
        .success(alert('Saved'));
    };

    $scope.selectList = function(listId){
        $http.get('/list/' + listId)
            .success(function(data){
                $scope.list = data;
            });
    }
}]);
var medCheck = angular.module('medCheck', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/sample')
        .success(function(data) {
            $scope.doctor = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}

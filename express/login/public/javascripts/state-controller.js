app.controller("stateController", function ($scope, $rootScope, $http) {
    $scope.states = ["Online", "Away", "Do not disturb"];
    $scope.selectedState = $scope.states[0];
    $scope.onStateDropDownClicked = function onStateDropDownClicked(data) {
        $scope.selectedState = data;
       // $scope.$apply();
    }
});
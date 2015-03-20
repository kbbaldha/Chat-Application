app.controller("stateController", function ($scope, $rootScope, $http) {
    $scope.states = ["Online", "Away", "Do not disturb"];
    $scope.selectedState = $scope.states[0];
    $scope.onStateDropDownClicked = function onStateDropDownClicked(data) {
        $scope.selectedState = data;
        socketio.emit("state_changed", { state: data, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
    }
});
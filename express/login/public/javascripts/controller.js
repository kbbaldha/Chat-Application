app.controller("friendListCtrl", function ($scope,$http) {
    var site = ChatApplication.SERVER_ADDRESS;
    var page = "/getUsers";
    $http.get(site + page)
    .success(function (response) {
        $scope.friends = response;
    });
    $scope.getUserId = function () {
        console.log();
        getChatWindowHTML(this.x.user_fname, this.x.user_id)
    };
});
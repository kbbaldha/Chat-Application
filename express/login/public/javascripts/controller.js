app.controller("friendListCtrl", function ($scope,$http) {
    var site = ChatApplication.SERVER_ADDRESS;
    var page = "/getUsers";
    $scope.currentFriendName = '';
    $scope.currentFriendId = '';
    $scope.msgInputBoxValue = '';
   
    $scope.currentFriendObj;
    $http.get(site + page)
    .success(function (response) {
        $scope.friends = response;
        var i = 0,
            friends = $scope.friends,
            noOfFriends = friends.length;
        for (; i < noOfFriends; i++) {
            friends[i].messages = [];
        }
    });
    $scope.getUserId = function () {
        console.log();
        var friendObj;        
        friendObj = getFriendObject(this.x.user_id);        
        $scope.currentFriendObj = friendObj;
      
    };

    $scope.sendMessage = function () {
        $scope.currentFriendObj.messages.push({ "1": $scope.msgInputBoxValue });
        $scope.msgInputBoxValue = '';
    };
    function getFriendObject(id) {
        var i = 0,
            friends = $scope.friends,
            noOfFriends = friends.length;
        for (; i < noOfFriends; i++) {
            if (friends[i].user_id == id) {
                return friends[i];
            }
        }
    }
});
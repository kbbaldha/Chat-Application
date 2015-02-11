app.controller("notificationAndSearch", function ($scope, $http) {

    $scope.$on('socketObjCreated', function (event) {
        bindSocketEvents();
    });


    var site = ChatApplication.SERVER_ADDRESS;
    var page = "/getUsers";

    $scope.searchFriendInput = '';
    $scope.friendsFound;
    $scope.enterOnQueryInput = function (keyEvent) {
        if (keyEvent.which === 13 || keyEvent.keyCode === 13) {
            $scope.searchFriend();
        }
    }
    getNotifications();
    $scope.sendFriendRequest = function (friend) {
        console.log("send friend request to:" + friend.user_fname);
        $.post(ChatApplication.SERVER_ADDRESS + "/sendFriendRequest", { clientId: app.clientInfo.user_id, friendId: friend.user_id }, function (result) {
            if (result == 'friendReqSent') {
                // $('.friend-found').find('.' + friendId).parent().html('Friend Request Sent').fadeOut(1000, function () { $(this).remove(); });
                deleteFoundFriendById(friend.user_id);
            }
        });
    }
    $scope.searchFriend = function () {
        var searchName = $('#search_input').val();

        $.post(ChatApplication.SERVER_ADDRESS + "/searchFriend", { searchName: $scope.searchFriendInput }, function (result) {
            console.log(result);
            result = JSON.parse(result);
            $scope.friendsFound = result;
            $scope.$apply();

        });
    }
    $scope.sendFriendRequest = function (friend) {

        $.post(ChatApplication.SERVER_ADDRESS + "/sendFriendRequest", { clientId: app.clientInfo.user_id, friendId: friend.user_id }, function (result) {
            if (result == 'friendReqSent') {
                // $('.friend-found').find('.' + friendId).parent().html('Friend Request Sent').fadeOut(1000, function () { $(this).remove(); });
            }
        });
    }
    $scope.cancelClicked = function () {
        console.log('hii');
        $.ajax({
            dataType: 'script',
            type: 'GET',
            url: 'http://www.google-analytics.com/analytics.js',
            success: function (data, res) {
                console.log('success found');
            },
            fail: function (data, res) {
                console.log('fail');
            },
            error: function (data, res) {
                console.log('error');
            },
            done: function (data, res) {
                console.log('done');
            }

        });
    }

    function bindSocketEvents() {
        console.log('bind socket');
        socketio.on("friend_request", function (data) {
            friendRequestReceived(data);
        });
        socketio.on("friend_request_accepted", function (data) {
            friendRequestAccepted(data);
        });
    }
    function friendRequestReceived(data) {
        console.log('req rec');
    }
    function friendRequestAccepted(data) {
        console.log('accepted');
    }
    function getNotifications() {
        $.post(ChatApplication.SERVER_ADDRESS + "/getNotification", {}, function (result) {
            var data = JSON.parse(result),
            noOfRequests = data.length,
            i = 0,
            currentData;
            for (; i < noOfRequests; i++) {
                currentData = data[i];
                /* if (currentData.type == 0) {
                friendRequestReceived({ friend_name: currentData.user_fname, friend_id: currentData.user_id });
                }
                else {
                generateFriendRequestAcceptedNotification(currentData.user_fname);
                }*/
            }

        });
    }

    function deleteFoundFriendById(id) {
        var foundFriends = $scope.friendsFound,
            length = foundFriends;

    }
});
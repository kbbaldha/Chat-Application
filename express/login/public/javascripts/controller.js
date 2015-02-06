app.controller("friendListCtrl", function ($scope, $http) {
    var site = ChatApplication.SERVER_ADDRESS;
    var page = "/getUsers";
    app.totalMessages = 0;
    $scope.currentFriendName = '';
    $scope.currentFriendId = '';
    $scope.msgInputBoxValue = '';
    
    $scope.currentFriendObj;

    $http.get(site + page)
    .success(function (response) {
        $scope.friends = response;
        var i = 0,
            friends = $scope.friends,
            noOfFriends = friends.length,
            currentFriend,
            conversationIdArray;
        for (; i < noOfFriends; i++) {
            currentFriend = friends[i];
            currentFriend.messages = [];
            currentFriend.noOfUnreadMessages = 0;
            currentFriend.totalMessages = 0;
            conversationIdArray = currentFriend.conversation_id.split("#");
            if (conversationIdArray[0] == currentFriend.user_id) {
                currentFriend.type = "1";
                currentFriend.clientType = "2";
            }
            else {
                currentFriend.type = "2";
                currentFriend.clientType = "1";
            }
        }
    });
    getUserName();
    $scope.getUserId = function ($event) {
        $scope.query = '';
        var friendObj;
        friendObj = getFriendObject(this.x.user_id);
        friendObj.noOfUnreadMessages = 0;
        $scope.currentFriendObj = friendObj;
        $('.selected').removeClass('selected');
        $($event.currentTarget).addClass('selected');
    };

    $scope.sendMessage = function () {
        if ($scope.currentFriendObj.type == "1") {
            $scope.currentFriendObj.messages.push({ "2": $scope.msgInputBoxValue });
        }
        else {
            $scope.currentFriendObj.messages.push({ "1": $scope.msgInputBoxValue });
        }
        socketio.emit("message_to_server", { message: $scope.msgInputBoxValue, friend: $scope.currentFriendObj.user_id, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
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

    function getUserName() {

        $http.get(ChatApplication.SERVER_ADDRESS + "/getUser")
        .success(function (response) {
            app.clientInfo = response[0];
            // clientId = clientInfo[0].user_id;
            //clientName = clientInfo[0].user_fname;
            connectToServer();
            bindSocketEvents();
            setUser(app.clientInfo.user_fname);
            //getUsersOfApp();
            //getNotifications();
        });
    }

    function bindSocketEvents() {
        socketio.on("message_to_client", function (data) {
            console.log(data['clientName'] + "::::" + data["message"]);
            var friend = getFriendObject(data.clientId);
            if (!(data.clientId == $scope.currentFriendObj.user_id)) {
                friend.noOfUnreadMessages = friend.noOfUnreadMessages + 1;
                app.totalMessages += 1;
                friend.totalMessages = app.totalMessages;
            }
            
            if (friend.type == "1") {
                friend.messages.push({ "1": data.message });
            }
            else {
                friend.messages.push({ "2": data.message });
            }
            $scope.$apply();
        });
    }
});
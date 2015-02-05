app.controller("friendListCtrl", function ($scope, $http) {
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
    getUserName();
    $scope.getUserId = function () {
        console.log();
        var friendObj;
        friendObj = getFriendObject(this.x.user_id);
        $scope.currentFriendObj = friendObj;

    };

    $scope.sendMessage = function () {
        $scope.currentFriendObj.messages.push({ "1": $scope.msgInputBoxValue });
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
            //setUser(clientName);
            //getUsersOfApp();
            //getNotifications();
        });
    }

    function bindSocketEvents() {
        socketio.on("message_to_client", function (data) {
            console.log(data['clientName'] + "::::" + data["message"]);
            /*if ($('#friend_chat_' + data['clientId']).length == 0) {
            $('.chatlog').append(getChatWindowHTML(data['clientName'], data['clientId']));
            }
            //$('#friend_chat_' + data['clientId']).find('.friend_chat_log').append('<div class="friend_chat_msg">' + data["message"] + '</div>');
            displayFriendMessage(data['clientId'], data["message"]);*/
        });
    }
});
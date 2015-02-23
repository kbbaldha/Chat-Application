app.controller("friendListCtrl", function ($scope, $rootScope, $http) {
    var site = ChatApplication.SERVER_ADDRESS;
    var page = "/getUsers";
    $scope.$on('friendAdded', function (event, data) {
        getNewFriend(data);
    });
    app.totalMessages = 0;
    $scope.currentFriendName = '';
    $scope.currentFriendId = '';
    $scope.msgInputBoxValue = '';

    $scope.currentFriendObj;
    $scope.selected;

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
            currentFriend.startTyping = false;
            currentFriend.totalMessages = 0;
            currentFriend.currentFile = null;
            currentFriend.loadMore = {
                                        hideLoadMore:false,
                                        html: "load more"
                                        };
            currentFriend.active = false;
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
    function initiateFriendObject(friendObj) {
        friendObj.messages = [];
        friendObj.noOfUnreadMessages = 0;
        friendObj.startTyping = false;
        friendObj.totalMessages = 0;
        friendObj.currentFile = null;
        friendObj.loadMore = {
                                        hideLoadMore:false,
                                        html: "load more"
                                        };
        friendObj.active = false;
        conversationIdArray = friendObj.conversation_id.split("#");
        if (conversationIdArray[0] == friendObj.user_id) {
            friendObj.type = "1";
            friendObj.clientType = "2";
        }
        else {
            friendObj.type = "2";
            friendObj.clientType = "1";
        }
    }
    getUserName();
    $scope.getUserId = function ($event, friendObj) {
        $scope.query = '';
        //var friendObj;
        //friendObj = getFriendObject(this.x.user_id);
        if (friendObj.messages.length == 0) {
            displayLastDayConversation(this.x.user_id, friendObj);
        }
        friendObj.noOfUnreadMessages = 0;
        if ($scope.currentFriendObj) {
            $scope.currentFriendObj.active = false;
        }
        $scope.currentFriendObj = friendObj;
        $scope.currentFriendObj.active = true;
        //$scope.selected = $index;
    };
    $scope.enterOnMsgInput = function (keyEvent) {
        if (keyEvent.which === 13 || keyEvent.keyCode === 13 || keyEvent.charCode === 13) {
            $scope.sendMessage();
        }
        else {
            $scope.sendTypingNotification(keyEvent)
        }
    }
    $scope.sendTypingNotification = function (event) {
        if ($scope.typingTimer) {
            clearTimeout($scope.typingTimer);
            $scope.notifiedTyping = true;
        }
        $scope.typingTimer = setTimeout(function () {
            socketio.emit("typing_notification", { message: 'end_typing', friend: $scope.currentFriendObj.user_id, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
            clearTimeout($scope.typingTimer);
            $scope.typingTimer = null;
            $scope.notifiedTyping = false;
        }, 2000);
        if (!$scope.notifiedTyping) {
            socketio.emit("typing_notification", { message: 'start_typing', friend: $scope.currentFriendObj.user_id, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
            setTimeout(function () {
                $scope.notifiedTyping = false;
            }, 1500)
        }
        else {
            return;
        }
    }
    $scope.sendMessage = function () {

        if ($scope.msgInputBoxValue.trim() == "") {
            return;
        }

        if ($scope.currentFriendObj.type == "1") {
            $scope.currentFriendObj.messages.push({ "2": $scope.msgInputBoxValue });
        }
        else {
            $scope.currentFriendObj.messages.push({ "1": $scope.msgInputBoxValue });
        }
        manageScroll();
        socketio.emit("typing_notification", { message: 'end_typing', friend: $scope.currentFriendObj.user_id, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
        clearTimeout($scope.typingTimer);
        $scope.typingTimer = null;
        $scope.notifiedTyping = false;
        socketio.emit("message_to_server", { message: $scope.msgInputBoxValue, friend: $scope.currentFriendObj.user_id, clientName: app.clientInfo.user_fname, clientId: app.clientInfo.user_id });
        $scope.msgInputBoxValue = '';
    };
    $scope.loadMoreMessages = function () {

    }
    function getNewFriend(userObj) {
        $.post(ChatApplication.SERVER_ADDRESS + "/getNewFriend", { friendId: userObj.user_id }, function (result) {
            console.log(result);
            result = JSON.parse(result);
            initiateFriendObject(result[0]);
            $scope.friends.push(result[0]);
            $scope.$apply();
        });
    }
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
            connectToServer();
            bindSocketEvents();
            $rootScope.$broadcast('socketObjCreated', {});
            setUser(app.clientInfo.user_fname);
        });
    }
    function displayLastDayConversation(userId, friendObj) {
        $.post(ChatApplication.SERVER_ADDRESS + "/getLastDayConversation", { friendId: userId }, function (result) {
            displayMoreMessages(friendObj, result);
        });
    }
    $scope.onLoadMoreBtnClicked = function onLoadMoreBtnClicked() {
        var curFriend = $scope.currentFriendObj;
        curFriend.loadMore.html = "loading......"
        $.post(ChatApplication.SERVER_ADDRESS + "/getMore", { friendId: curFriend.user_id, currentFile: curFriend.currentFile }, function (result) {

            displayMoreMessages(curFriend, result);
        });
    }

    function displayMoreMessages(friendObj, result) {
        result = JSON.parse(result);
        friendObj.loadMore.html = "load more";
        
        if (result.last) {
            friendObj.loadMore.hideLoadMore = true;
            $scope.$apply();
            return;
        }
        if (result[0]) {
            friendObj.currentFile = result[0].currentFile;
            result[0].currentFile = result[0].currentFile.replace('.json', '');
            Array.prototype.unshift.apply(friendObj.messages, result);
            $scope.$apply();
        }
    }
    function manageScroll() {
        var chatLog = document.getElementById('friend_chat_log'),
                isScrolledToBottom = chatLog.scrollHeight - chatLog.clientHeight <= chatLog.scrollTop + 30;
        if (isScrolledToBottom) {
            setTimeout(function () {
                chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
            }, 10);

        }
    }
    function bindSocketEvents() {
        socketio.on("message_to_client", function (data) {

            var friend = getFriendObject(data.clientId);
            if (!document.hasFocus()) {
                if (!Notification) {
                    alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.');
                    return;
                }

                if (Notification.permission !== "granted")
                    Notification.requestPermission();

                var notification = new Notification('New Message From ' + friend.user_fname, {
                    icon: '',
                    body: data.message,
                });

                notification.onclick = function () {
                    window.focus();
                };
            }
            if ($scope.currentFriendObj) {
                if (!(data.clientId == $scope.currentFriendObj.user_id)) {
                    friend.noOfUnreadMessages = friend.noOfUnreadMessages + 1;
                    app.totalMessages += 1;
                    friend.totalMessages = app.totalMessages;
                }
            }
            else {
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
            manageScroll();


        });

        socketio.on('typing_notification_to_client', function (data) {
            var friend = getFriendObject(data.clientId);
            console.log(data.message);
            if (data.message === 'start_typing') {
                friend.startTyping = true;
            }
            else {
                friend.startTyping = false;
            }
            $scope.$apply();
        });
        socketio.on("friend_request_accepted", function (data) {
            //$rootScope.$broadcast('friendAdded', { user_id: data.friend_id });
            getNewFriend({ user_id: data.friend_id });
        });
        socketio.on("user_offline", function (data) {
            var friend = getFriendObject(data.user_id);
            if (friend) {
                friend.online = 0;
                $scope.$apply();
            }
        });
        socketio.on("user_online", function (data) {
            var friend = getFriendObject(data.user_id);
            console.log('online : ' + data.user_id);
            if (friend) {
                friend.online = 1;
                $scope.$apply();
            }
        });
    }
});
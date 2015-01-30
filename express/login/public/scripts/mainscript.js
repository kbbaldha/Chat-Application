var socketio,
    clientName,
    clientId;


function bindEvents() {

    $('.add-button').on("click", friendRequestAccepted);
   
}


function sendFriendRequest(event) {
    console.log(' fsendFriendRequest  pted');
    var friendId = $(event.target.parentElement).find('.friend-found-id').html();

    $.post(ChatApplication.SERVER_ADDRESS + "/sendFriendRequest", { clientId: clientId, friendId: friendId }, function (result) {
        console.log('result---------' + result);

    });
    
}

function searchUserByName(event) {
    var searchName = $('#search_input').val();       

    $.post(ChatApplication.SERVER_ADDRESS + "/searchFriend", {  searchName: searchName }, function (result) {
        console.log(result);
        result = JSON.parse(result);
        var length = result.length,
            i = 0,
            htmlStr = '',
            current,
            $container = $('#search-result-container');
        $container.html('');
        for (; i < length; i++) {
            current = result[i];
            htmlStr = '<div class="friend-found"> \
                    <div class="friend-found-name">' + current.user_fname + '</div> \
                    <div class="friend-found-id">' + current.user_id + '</div> \
                    <div class="send-request-button button-class">send friend request</div> \
                </div>';
            $container.append(htmlStr);
        }
       
        $('.send-request-button').off("click", sendFriendRequest).on("click", sendFriendRequest);
    });
}
function friendRequestAccepted(event) {
    console.log(' friend request accepted');
}

function connectToServer() {
   
    socketio = io.connect(ChatApplication.SERVER_ADDRESS, { query: 'loggeduser=' + clientId });
    socketio.on("message_to_client", function (data) {
        if ($('#friend_chat_' + data['clientId']).length == 0) {
            $('.chatlog').append(getChatWindowHTML(data['clientName'],data['clientId']));
        }
        $('#friend_chat_' + data['clientId']).find('.friend_chat_log').append('<div class="friend_chat_msg">' + data["message"] + '</div>');
    });
    socketio.on("user_offline", function (data) {
        $('#user_' + data.user_id + '-status').html('offline');
    });
    socketio.on("user_online", function (data) {
        $('#user_' + data.user_id + '-status').html('online');
    });
    socketio.on("logout_client", function (data) {
        window.location = ChatApplication.SERVER_ADDRESS + "/signedOff";
    });
}
function sendMessage(element) {
    var friendname = element.id,
       inputbox = $('#friend_chat_' + element.id).find('input'),
       msg = inputbox.val();
    inputbox.val("");
    $('#friend_chat_' + element.id).find('.friend_chat_log').append('<div class="me_chat">' + msg + '</div>');
    socketio.emit("message_to_server", { message: msg, friend: friendname, clientName: clientName });
}

function getUserName() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ChatApplication.SERVER_ADDRESS + "/getUser", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var clientInfo = JSON.parse(xmlhttp.responseText)
            clientId = clientInfo[0].user_id;
            clientName = clientInfo[0].user_fname;
            connectToServer();
            setUser(clientName);
            getUsersOfApp();
        }
    }
    xmlhttp.send();
}
function logout() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ChatApplication.SERVER_ADDRESS + "/logout", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText == 'logout') {
                window.location = ChatApplication.SERVER_ADDRESS + "/login";
            }
            console.log('loogged out');
            //setAppUsers();
        }
    }
    xmlhttp.send();
}
function getUsersOfApp() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ChatApplication.SERVER_ADDRESS + "/getUsers", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            setAppUsers(JSON.parse(xmlhttp.responseText));

            //setAppUsers();
        }
    }
    xmlhttp.send();
}
function setAppUsers(users) {
    var noOfUsers = users.length,
        i = 0,
        output = '<div class="user_list_heading">List of users</div>',
        username, status;
    for (; i < noOfUsers; i++) {
        friendId = users[i]['user_id'];
        username = users[i]['user_fname'];
        status = (users[i]['online'] == 0) ? "offline" : "online";
        output += '<div id="user_' + friendId + '-container" class="user-list-name-container" >';
        output += '<div id="user_' + friendId + '" class="user_list_name" >' + username + "</div>";
        output += '<div id="user_' + friendId + '-status" class="user-status" >' + status + '</div></div>';
    }
    document.getElementById('users_of_app').innerHTML = output;

    $('.user_list_name').on('click', userClicked);

}
function userClicked(event) {
    var userId = event.target.getAttribute("id").replace("user_", "");
    if ($('#friend_chat_' + userId).length > 0) {
        return;
    }
    $('.chatlog').append(getChatWindowHTML(event.target.textContent, userId));


}
function setUser(name) {
    document.getElementById('user').innerHTML = 'welcome ' + name;
}

function getChatWindowHTML(username,userid) {
    var html = '<div id="friend_chat_' + userid + '" class="friend_chat">' +
     '<div id="friend_name" class="friend_name">' + username + '</div>' +
    '<input type="text" id="message_input"/>' +
    '<button id = "' + userid + '"onclick="sendMessage(this)">send</button>' +
    '<div id="friend_chat_log" class="friend_chat_log"></div>' +
'</div>'
    return html;
}

bindEvents();
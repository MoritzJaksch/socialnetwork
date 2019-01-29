import axios from './axios';


export function receiveFriendsAndWannabes() {
    return axios.get("/friends/friendlist").then(result => {
        return {
            type: 'RECEIVE_FRIENDS_WANNABES',
            friends: result.data
        };
    });

}
export function unfriend(otherPersonId){
    return axios.post("/friendship/"+ otherPersonId + "/cancel").then(result=>{
        return {
            type: 'UNFRIEND',
            id: otherPersonId
        };
    });

}
export function acceptFriendRequest(otherPersonId){
    return axios.post("/friendship/" + otherPersonId + "/accept").then(result=>{
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: otherPersonId
        };
    });

}
export function onlineUsers(list){
    return {
        type: "GET_ONLINE_USERS",
        onlineUsers: list
    };
}

export function userJoined(user){
    return{
        type: "USER_JOINED",
        joinedUser: user
    };
}

export function userLeft(userId){
    return{
        type: "USER_LEFT",
        id: userId
    };
}

export function messageWasSent(message){
    return{
        type: "MESSAGE_SENT",
        message: message
    };
}

export function gotAllMessages(messages){
    return{
        type: "ALL_MESSAGES",
        messages: messages
    };
}

export function newWallPost(wallpost){
    return{
        type: "WALL_POST",
        post: wallpost
    };
}

export function allWallPosts(wallposts){
    return{
        type: "ALL_POSTS",
        posts: wallposts
    };
}

export function friendRequest(sendingUser){
    return{
        type: "REQUEST_SENT",
        user: sendingUser
    };
}

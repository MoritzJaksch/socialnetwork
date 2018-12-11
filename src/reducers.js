export default function(state = {}, action) {
    if(action.type == 'RECEIVE_FRIENDS_WANNABES'){
        state = Object.assign({}, state, {
            friends: action.friends
        });
    }
    if(action.type == 'UNFRIEND'){
        return {
            ...state,
            friends: state.friends.filter(
                f => {
                    if(f.id != action.id){
                        return f;
                    }

                }

            )
        };

    }
    if(action.type == 'ACCEPT_FRIEND_REQUEST'){
        return {
            ...state,
            friends: state.friends.map(
                f => {
                    if (f.id == action.id) {
                        return {
                            ...f,
                            accepted: true
                        };
                    } else {
                        return f;
                    }
                }
            )
        };
    }
    if(action.type == "GET_ONLINE_USERS"){
        return{
            ...state,
            onlineUsers: action.onlineUsers
        };
    }
    if(action.type == "USER_JOINED"){
        return{
            ...state,
            onlineUsers: [...state.onlineUsers, action.joinedUser]
        };
    }
    if(action.type == "USER_LEFT"){
        return{
            ...state,
            onlineUsers: state.onlineUsers.filter(
                onlineUser => {
                    if(onlineUser.id != action.id){
                        return onlineUser;
                    }

                }

            )
        };
    }
    if(action.type == "MESSAGE_SENT"){
        console.log("action.message ind MESSAGE_SENT: ",action.message);
        return{
            ...state,
            messages: state.messages.concat(action.message)
        };
    }
    if(action.type=="ALL_MESSAGES"){
        console.log("action.message in ALL_MESSAGES: ",action.messages);
        return{
            ...state,
            messages: action.messages
        };
    }
    console.log("state in reducer: ",state);
    return state;
}
// return {
//     ...state,
//     friends: state.friends.map(
//         f => {
//             if (f.id == action.id) {
//                 return {
//                     ...f,
//                     accepted: true
//                 }
//             } else {
//                 return f;
//             }
//         }
//     )
// }

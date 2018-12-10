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
    console.log(state);
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

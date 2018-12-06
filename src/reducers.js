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

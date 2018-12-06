import axios from './axios';

// export async function receiveUsers() {
//     const { data } = await axios.get('/users');
//     return {
//         type: 'RECEIVE_USERS',
//         users: data.users
//     };
// }
//
// export function makeHot(id) {
//     console.log("make hot running");
//     return {
//         type: 'MAKE_HOT',
//         hotId: id
//     };
// }
// export function makeNot(id) {
//     console.log("make not running");
//     return {
//         type: 'MAKE_NOT',
//         hotId: id
//     };
// }

export function receiveFriendsAndWannabes() {
    return axios.get("/friends/friendlist").then(result => {
        console.log("results in actions-friends-and-wannabes: ", result.data.rows);
        return {
            type: 'RECEIVE_FRIENDS_WANNABES',
            friends: result.data
        };
    });

}
export function unfriend(otherPersonId){
    return axios.post("/friendship/"+ otherPersonId + "/cancel").then(result=>{
        console.log("results in unfriend: ", result);
        return {
            type: 'UNFRIEND',
            id: otherPersonId
        };
    });

}
export function acceptFriendRequest(otherPersonId){
    return axios.post("/friendship/" + otherPersonId + "/accept").then(result=>{
        console.log("results in acceptFriendRequest: ", result);
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: otherPersonId
        };
    });

}
import * as io from 'socket.io-client';
import {onlineUsers, userJoined, userLeft } from './actions';


let socket;

export function initSocket(store){
    if (!socket){
        socket = io.connect();

        socket.on('onlineUsers', (listOfOnlineUsers) => {
            console.log("listOfOnlineUsers: ", listOfOnlineUsers);
            store.dispatch(onlineUsers(listOfOnlineUsers));
        });
        socket.on('userJoined', (userWhoJoined) => {
            store.dispatch(userJoined(userWhoJoined));
        });
        socket.on('userLeft', (userWhoLeft)=>{
            store.dispatch(userLeft(userWhoLeft));
        });
    }

    return socket;
}

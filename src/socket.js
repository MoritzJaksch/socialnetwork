import * as io from 'socket.io-client';
import {onlineUsers, userJoined, userLeft, messageWasSent, gotAllMessages } from './actions';


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
        socket.on('newMessageSent', (messageSent)=>{
            store.dispatch(messageWasSent(messageSent));
        });
        socket.on('gotAllMessages', (allMessages)=>{
            store.dispatch(gotAllMessages(allMessages));
        });
        
    }

    return socket;
}

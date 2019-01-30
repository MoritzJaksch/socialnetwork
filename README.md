# Social Network

This project was created using react. It is a minimalistic approach to a simple social network to learn react/redux and socket.io. It has a chatroom and a messageboard for each user to allow "wall posts".

## Built With

- [react](https://reactjs.org/docs/react-api.html) - the front-end framework used
- [redux](https://redux.js.org/api/api-reference) - for react state management
- [socket.io](https://socket.io/docs/) - to enable real-time events in the app
- [express.js](http://expressjs.com/de/api.html) - the node.js framework used
- [AWS S3](https://docs.aws.amazon.com/s3/index.html#lang/en_us) - storage and hosting for images
- [PostgreSQL](https://www.postgresql.org/docs/9.4/index.html) - for database management

## Project Overview

#### <u>sign-up / login</u>

After entering the page for the first time, you will be able to sign up. If you already have an account you can go forward to the log in page by clicking the link at the bottom.



![header image](https://raw.github.com/moritzjaksch/socialnetwork/master/public/assets/preview1.png) 



#### <u>Social Hub</u>

After signing up, you will be forwarded to the social hub, where you will find most of the functionalities of the page. These include a friendlist, a list of friendrequests, a message board, that allows for personalized wall posts and a chatroom, in which all the users that are currently online can chat with each other. On log in, the ten most current chat messages will be loaded.



![header image](https://raw.github.com/moritzjaksch/socialnetwork/master/public/assets/preview2.png)



#### <u>Profile Picture</u>

You start off with a default profile picture. By clicking on it, you will be able to upload your own profile pic. you can also write a short bio or status update by clicking the edit button. 



You can also see immediately if someone sent you a friend request in the "requested" unit of your Hub.

![header image](https://raw.github.com/moritzjaksch/socialnetwork/master/public/assets/preview3.png)



#### <u>Friends</u>

After accepting a friendrequest, the user will automatically appear in your "friends" unit of your Social Hub. 

They will now be able to write on your message board, and you can answer them right away.



![header image](https://raw.github.com/moritzjaksch/socialnetwork/master/public/assets/preview4.png)



You can also always visit their page and write on their message board if you like! 



![header image](https://raw.github.com/moritzjaksch/socialnetwork/master/public/assets/preview5.png)

## Future Implementations

In the future I want to implement more functionality to the message board. Like uploading pictures and sharing posts. In my opinion this is what makes a chatroom to a social network. I also want to make it possible to customize your Social Hub, so that the features that are most precious to the user can be positioned where they like them.
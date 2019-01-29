import React from "react";
import {connect} from 'react-redux';
import {initSocket} from './socket';
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

class Chat extends React.Component {
    constructor(props){
        super(props);
    }

    sendMessage(e){
        let socket = initSocket();
        if (e.which === 13){

            socket.emit('chatMessage', e.target.value);
            e.preventDefault();
            e.target.value = "";
        }
    }
    componentDidUpdate(){
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render(){
        return(

            <div>
                <h1>chatroom</h1>

                <div className = "chat-message-container" ref={elem => (this.elem = elem)}>
                    {this.props.messages && this.props.messages.map((message, idx) => {
                        return(
                            <div id = "user-chat" key = {idx}>
                                <div className = "profile-pic-on-wall">
                                    <Link to={`/user/${message.sender_id}`}><ProfilePic url = {message.profilepic}/></Link>
                                </div>
                                <div className = "text-on-wall">
                                    <p className = "wall-poster">
                                        {message.first} wrote on {message.created_at}
                                    </p>


                                    <p className = "wall-post">
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <textarea className = "wall-textarea" onKeyDown = {this.sendMessage}/>

            </div>

        );
    }
}

const mapStateToProps = state => {

    return {

        messages: state.messages

    };
};

export default connect(mapStateToProps)(Chat);

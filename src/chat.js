import React from "react";
import {connect} from 'react-redux';
import {initSocket} from './socket';

class Chat extends React.Component {
    constructor(props){
        super(props);
    }

    sendMessage(e){
        let socket = initSocket();
        if (e.which === 13){

            socket.emit('chatMessage', e.target.value);
            e.target.value = "";
        }
    }
    // componentDidUpdate(){
    //     console.log("this elem: ", this.elem);
    //     this.elem.scrollTop = this.elem.scrollHeight;
    // }
    render(){
        return(

            <div>
                <h1>THIS IS A CHATROOM</h1>
                <textarea onKeyDown = {this.sendMessage}/>

                <div className = "chat-message-container">
                    {this.props.messages && this.props.messages.map((message, idx) => {
                        return(
                            <div key = {idx}>
                                <p>
                                    {message.message}
                                </p>
                            </div>
                        );
                    })}
                </div>
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

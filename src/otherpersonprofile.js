import React from "react";
import axios from "./axios";


import { Link } from "react-router-dom";
import ProfileOpp from "./profileopp";
import ProfilePic from "./profilepic";
import Friendbutton from "./friendbutton";
import Wall from "./wall";
import Bio from "./bio";

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

        axios
            .get("/user/" + this.props.match.params.id + "/info")
            .then(result => {
                console.log("results in OPP: ", result.data.rows[0]);
                this.setState(result.data.rows[0]);
            })
            .then(() => {
                console.log("success!!!!!!!", this.state);
            })
            .catch(err => {
                console.log("error in other person profile: ", err);
                this.props.history.push("/");
            });
        // this.props.history.push("/");
    }

    // sendMessage(e){
    //     let socket = initSocket();
    //     if (e.which === 13){
    //         var newMsg= {
    //             to: this.props.match.params.id,
    //             from: this.props.first,
    //             message: e.taget.value
    //         };
    //         socket.emit('privateMessage', newMsg);
    //         e.target.value = "";
    //         e.preventDefault();
    //     }
    //
    // }

    render() {
        return (
            <div className="opp-container">
                <h1>{this.state.first} Profile!</h1>
                <ProfilePic url={this.state.profilepic} />
                <p>{this.state.bio} </p>
                <Friendbutton otherUserId={this.props.match.params.id} />
                <div className = "other-person-wall">
                    <Wall otherUserId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

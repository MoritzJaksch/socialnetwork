import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";
import ProfileOpp from "./profileopp";
import ProfilePic from "./profilepic";
import Friendbutton from "./friendbutton";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("OPP did mount");

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

    render() {
        return (
            <div className="opp-container">
                <h1>OPP running.</h1>
                <ProfilePic url={this.state.profilepic} />
                <Friendbutton otherUserId={this.props.match.params.id} />
            </div>
        );
    }
}

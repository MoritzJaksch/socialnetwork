import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic showUploader={props.showUploader} url={props.url} />
            {props.first} {props.last}
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
{
    /* <BrowserRouter>
    <div>
        <Route
            path="/"
            render={() => {
                return (
                    <Profile
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        image={this.state.image}
                        bio={this.state.bio}
                        setBio={this.setBio}
                        showUploader={this.showUploader}
                    />
                );
            }}
        />
    </div>
</BrowserRouter>; */
}

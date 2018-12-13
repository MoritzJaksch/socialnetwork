import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import Bio from "./bio";
import Wall from "./wall";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic hideUploader = {props.hideUploader} showUploader={props.showUploader} url={props.url} />
            <p>
                {props.first} {props.last}
            </p>
            <Bio bio={props.bio} setBio={props.setBio} />
            <div className = "wall">
                <Wall thisUserId={props.id}/>
            </div>
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

import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";

import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    showUploader() {
        this.setState({ uploaderIsVisible: true }, () =>
            console.log(
                "this.state.profilepic uploader: ",
                this.state.profilepic
            )
        );
    }
    hideUploader(profileUrl) {
        this.setState({
            uploaderIsVisible: false,
            profilepic: profileUrl
        });
    }
    setBio(biography) {
        this.setState({
            bio: biography
        });
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("res in user: ", data);
            this.setState(data.rows[0]);
        });
    }
    render() {
        return (
            <div>
                <div id="header">
                    <Logo />
                    <h1>Welcome, {this.state.first}</h1>
                    <ProfilePic
                        url={this.state.profilepic}
                        name={this.state.first}
                        showUploader={this.showUploader}
                    />
                </div>
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        url={this.state.profilepic}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                        showUploader={this.showUploader}
                                    />
                                );
                            }}
                        />

                        <Route
                            path="/user/:id"
                            component={OtherPersonProfile}
                        />

                        <Route
                            exact path = "/friends"
                            component={Friends}
                        />
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader hideUploader={this.hideUploader} />
                )}
            </div>
        );
    }
}

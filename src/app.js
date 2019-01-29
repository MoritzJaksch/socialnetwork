import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import {connect} from 'react-redux';
import {initSocket} from './socket';


import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineUsers";
import Chat from "./chat";
import Wall from "./wall";
import { Link } from "react-router-dom";



class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.closeUploader = this.closeUploader.bind(this);

        this.setBio = this.setBio.bind(this);
    }
    showUploader() {
        this.setState({ uploaderIsVisible: true });
    }
    closeUploader() {
        this.setState({
            uploaderIsVisible: false
        });}

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
            this.setState(data.rows[0]);
        });
    }


    render() {
        return (
            <div className = "container">
                <div className = "header-container">
                    <div className = "row" id="header">
                        <div className = "logo-header">
                            <Logo />
                        </div>
                        <a  href = "/logout">
                            <div className = "logout">
                                <img src = "/assets/logout.png" />
                            </div>
                        </a>
                        {this.props.user && this.props.user.map(u=>{
                            return(
                                <a key = {u.id} href = {`/user/${u.id}`}>
                                    <div className = "friendrequest">
                                        <img src = "/assets/friendrequest.png" />
                                    </div>
                                </a>

                            );
                        })}

                        <div className = "profile-pic-header">
                            <a href="/"><ProfilePic
                                url={this.state.profilepic}
                                name={this.state.first}
                                showUploader={this.showUploader}
                                closeUploader={this.closeUploader}

                            /></a>
                        </div>
                    </div>
                </div>
                <BrowserRouter>
                    <div className = "row">
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <div className = "profile-home-container">
                                        <Profile
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            url={this.state.profilepic}
                                            bio={this.state.bio}
                                            setBio={this.setBio}
                                            showUploader={this.showUploader}
                                            closeUploader={this.closeUploader}
                                        />
                                        <Friends />
                                        <div className = "chat-container">
                                            <Chat />
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Route
                            path="/user/:id"
                            component={OtherPersonProfile}
                        />

                        <Route
                            path = "/friends"
                            component={Friends}
                        />
                        <Route path = "/online"
                            component={OnlineUsers}
                        />
                        <Route
                            path = "/chatroom"
                            component = {Chat}
                        />
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader hideUploader={this.hideUploader} closeUploader={this.closeUploader}/>
                )}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {

        user: state.user

    };
};

export default connect(mapStateToProps)(App);

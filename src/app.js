import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
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

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("res in user: ", data);
            this.setState(data.rows[0]);
        });
    }
    render() {
        return (
            <div>
                <Logo />
                <h1>Welcome, {this.state.first}</h1>
                <ProfilePic
                    url={this.state.profilepic}
                    name={this.state.first}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader hideUploader={this.hideUploader} />
                )}
            </div>
        );
    }
}

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: true
        };
        this.submitBio = this.submitBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    submitBio() {
        if (this.state.bio == null) {
            this.setState({
                bio: this.props.bio
            });
        } else {
            axios
                .post("/bio", this.state)
                .then(response => {
                    this.setState({
                        bio: response.data.rows[0].bio
                    });
                })
                .then(e => {
                    this.props.setBio(this.state.bio);
                });
        }
        if (this.state.edit) {
            this.setState({
                edit: false
            });
        } else {
            this.setState({
                edit: true
            });
        }
    }
    editBio() {
        if (this.state.edit) {
            this.setState({
                edit: false
            });
        } else {
            this.setState({
                edit: true
            });
        }
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
        );
    }
    render() {
        if (!this.state.edit) {
            return (
                <div id = "bio">
                    <textarea
                        onChange={this.handleChange}
                        name="bio"
                        id="biography"
                        cols="30"
                        rows="10"
                        defaultValue={this.props.bio}
                    />
                    <button onClick={this.submitBio}>submit bio</button>
                </div>
            );
        } else {
            return (
                <div id = "bio">
                    <p>{this.props.bio}</p>
                    <button onClick={this.editBio}>edit</button>
                </div>
            );
        }
    }
}

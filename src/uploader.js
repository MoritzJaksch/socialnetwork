import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.profilePic);

        axios.post("/upload", formData).then(res => {
            console.log("res in upload:", res.data.rows[0]);
            this.setState({ profilepic: res.data.rows[0].profilepic });
        });
        console.log("submitted.");
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.files[0]
            }
        );
    }

    render() {
        return (
            <div id="uploader">
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="profilePic"
                        onChange={this.handleChange}
                        type="file"
                        accept="image/*"
                    />
                    <button onClick={e =>
                        this.props.hideUploader(this.state.profilepic)}>
                        upload
                    </button>
                    <h1 onClick={e =>
                        this.props.closeUploader()}>
                        close
                    </h1>
                </form>
            </div>
        );
    }
}

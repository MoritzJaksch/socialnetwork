import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";


export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this state in handle change: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
            .then(res => {
                if (res.data.success == false) {
                    this.setState({
                        error: "something went wrong, please try again!"
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch(err => {
                console.log("error in post", err);
            });
    }

    render() {
        return (
            <div className="registration-container">
                <h1>login</h1>
                <form className = "registration-form" onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="eMail"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button>login</button>
                </form>
                <Link className =  "link-to-login" to="/">not yet signed up? click here</Link>

            </div>
        );
    }
}

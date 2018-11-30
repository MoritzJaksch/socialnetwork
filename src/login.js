import React from "react";
import axios from "./axios";

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
        console.log("login handlechange working");
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this state in handle change: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("default prevented", this.state);
        axios
            .post("/login", this.state)
            .then(res => {
                console.log("res in post", res);
                if (res.data.success == false) {
                    this.setState({
                        error: "something went wrong, please try again!"
                    });
                } else {
                    console.log("res in post SUCCESS: ", res);

                    location.replace("/");
                }
            })
            .catch(err => {
                console.log("error in post", err);
            });
    }

    render() {
        return (
            <div>
                <h1>hash routing!!!!!!!!!11</h1>
                <form onSubmit={this.handleSubmit}>
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
                    <button>register</button>
                </form>
            </div>
        );
    }
}

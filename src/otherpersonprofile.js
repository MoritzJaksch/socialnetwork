import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        console.log("OPP did mount");

        axios
            .get("/user/info", {
                params: {
                    id: this.props.match.params.id
                }
            })
            .then(result => {
                console.log("results in OPP: ", result);
            });
        // this.props.history.push("/");
    }

    render() {
        return (
            <div className="opp-container">
                <h1>OPP running.</h1>
                <h2>{this.props.match.params.id}</h2>
            </div>
        );
    }
}

import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function ProfileOpp(props) {
    return (
        <div id="profile-opp">
            <img src={props.profilepic} alt="" />
        </div>
    );
}

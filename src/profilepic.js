import React from "react";

export default function ProfilePic(props) {
    console.log("props: ", props);
    var url;
    if (props.url) {
        url = props.url;
    } else {
        url = "/assets/defaultPic.png";
    }
    return (
        <div className="profile-pic-container">
            <img
                className="profile-pic"
                src={url}
                alt="/assets/1a.jpg"
                onClick={props.showUploader}
            />
        </div>
    );
}

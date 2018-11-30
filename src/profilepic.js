import React from "react";

export default function ProfilePic(props) {
    console.log("props: ", props);
    return (
        <div>
            <img
                src={props.url}
                alt={props.name}
                onClick={props.showUploader}
            />
        </div>
    );
}

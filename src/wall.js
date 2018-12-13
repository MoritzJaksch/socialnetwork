import React from "react";
import {connect} from 'react-redux';
import {initSocket} from './socket';
import axios from "./axios";
import ProfilePic from "./profilepic";


class Wall extends React.Component {
    constructor(props){
        super(props);
        this.wallPost = this.wallPost.bind(this);
    }

    wallPost(e){
        let id;
        if(this.props.otherUserId){
            id = this.props.otherUserId;
        }else{
            id = this.props.thisUserId;
        }
        let socket = initSocket();
        if (e.which === 13){

            socket.emit('wallPost', {message: e.target.value, id: id});
            e.preventDefault();
            e.target.value = "";
        }
    }
    componentDidMount(){
        if(this.props.otherUserId){
            let socket = initSocket();

            socket.emit("wallMounted", this.props.otherUserId);

        }
    }

    componentDidUpdate(){
        console.log("this elem: ", this.elem);
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render(){

        return(

            <div>
                <h1>message board</h1>

                <div className = "wall-container" ref={elem => (this.elem = elem)}>
                    {this.props.posts && this.props.posts.map((post, idx) => {

                        return(
                            <div id="user-wall" key = {idx}>
                                <div className = "profile-pic-on-wall">
                                    <ProfilePic url = {post.profilepic}/>
                                </div>
                                <div className = "text-on-wall">
                                    <p className = "wall-poster">
                                        {post.first} wrote on {post.created_at}
                                    </p>

                                    <p className = "wall-post">
                                        {post.wallpost}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <textarea className = "wall-textarea" onKeyDown = {this.wallPost}/>

            </div>

        );
    }
}

const mapStateToProps = state => {
    console.log("state.posts",state.posts);
    return {

        posts: state.posts

    };
};

export default connect(mapStateToProps)(Wall);

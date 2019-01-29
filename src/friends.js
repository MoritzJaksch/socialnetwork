import React from "react";
import {connect} from 'react-redux';
import { Link } from "react-router-dom";
import Friendbutton from "./friendbutton";

import {receiveFriendsAndWannabes, unfriend, acceptFriendRequest } from './actions';

class Friends extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    render(){
        if (!this.props.friends) {
            return null;
        }
        return(

            <div className = "friends-and-wannabe-container">
                <div className = "friends-container">
                    <h4>friends</h4>
                    <div className = "friend-cards">
                        {this.props.friends.map(friend => {
                            var url;
                            if (friend.profilepic) {
                                url = friend.profilepic;
                            } else {
                                url = "/assets/defaultPic.png";
                            }

                            return (
                                <div key = {friend.id}>
                                    <Link to={`/user/${friend.id}`}>
                                        <img  src={url} alt=""/>
                                    </Link>
                                    <p>{friend.first} {friend.last}</p>
                                    <button onClick = {e=>this.props.dispatch(unfriend(friend.id))}>unfriend</button>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
                <div className = "wannabe-container">
                    <h4>requested</h4>
                    <div className = "wannabe-cards">
                        {/* {this.props.user && <div className = "request">
                            <button onClick = {e=>this.props.dispatch(acceptFriendRequest(this.props.user.id))}>accept friendrequest</button>
                        </div>} */}
                        {this.props.wannabes.map(friend => {
                            var url;
                            if (friend.profilepic) {
                                url = friend.profilepic;
                            } else {
                                url = "/assets/defaultPic.png";
                            }

                            return (
                                <div key = {friend.id}>
                                    <Link to={`/user/${friend.id}`}>
                                        <img  src={url} alt=""/>
                                    </Link>
                                    <p>{friend.first} {friend.last}</p>
                                    <button onClick = {e=>this.props.dispatch(acceptFriendRequest(friend.id))}>accept friendrequest</button>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {

    var list = state.friends;
    return {
        friends: list && list.filter(
            user=>user.accepted == true
        ),
        wannabes: list && list.filter(
            user=>!user.accepted
        ),
        user: state.user
    };
};

export default connect(mapStateToProps)(Friends);

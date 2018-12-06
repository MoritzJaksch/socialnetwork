import React from "react";
import {connect} from 'react-redux';
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

            <div>
                <h1>FRIENDS</h1>
                {this.props.friends.map(friend => {
                    var url;
                    if (friend.profilepic) {
                        url = friend.profilepic;
                    } else {
                        url = "/assets/1a.jpg";
                    }

                    return (
                        <div key = {friend.id}>
                            <img  src= {url} alt=""/>
                            <button onClick = {e=>this.props.dispatch(unfriend(friend.id))}>unfriend</button>
                            {friend.first} {friend.last}
                        </div>
                    );
                })
                }
                <h1>WANNABES</h1>
                {this.props.wannabes.map(friend => {
                    var url;
                    if (friend.profilepic) {
                        url = friend.profilepic;
                    } else {
                        url = "/assets/1a.jpg";
                    }

                    return (
                        <div key = {friend.id}>
                            <img  src={url} alt=""/>
                            <button onClick = {e=>this.props.dispatch(acceptFriendRequest(friend.id))}>accept friendrequest</button>

                            {friend.first} {friend.last}
                        </div>
                    );
                })
                }
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
        )
    };
};

export default connect(mapStateToProps)(Friends);

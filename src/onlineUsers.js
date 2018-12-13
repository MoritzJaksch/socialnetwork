import React from "react";
import {connect} from 'react-redux';

class OnlineUsers extends React.Component {
    constructor(props){
        super(props);
    }
    // componentDidMount(){
    //     this.props.dispatch(receiveFriendsAndWannabes());
    // }
    render(){
        if (!this.props.users) {
            return null;
        }
        return(

            <div>
                <h1>ONLINE</h1>
                {this.props.users && this.props.users.map(user => {
                    var url;
                    if (user.profilepic) {
                        url = user.profilepic;
                    } else {
                        url = "/assets/defaultPic.png";
                    }

                    return (
                        <div className = "online-users-container" key = {user.id}>
                            <img  src= {url} alt=""/>
                            {user.first} {user.last}
                        </div>
                    );
                })
                }


            </div>
        );
    }
}

const mapStateToProps = state => {

    var list = state.onlineUsers;
    let uniqueList = [...new Set(list)];
    console.log("list: ", list);
    console.log("unique list: ", uniqueList);
    return {
        users: uniqueList
    };
};

export default connect(mapStateToProps)(OnlineUsers);

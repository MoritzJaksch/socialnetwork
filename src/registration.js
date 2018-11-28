import React from 'react';
import axios from 'axios';

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        console.log("working");
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log('this state in handle change: ', this.state));

    }
    handleSubmit(e){
        e.preventDefault();
        console.log("default prevented", this.state);
        axios.post('/registration', this.state)
            .then(res=>{
                console.log('res in post', res);
                if (res.data.success == false) {
                    this.setState({
                        error: "something went wrong, please try again!"
                    });
                } else {
                    console.log('res in post SUCCESS: ', res);

                    location.replace('/');
                }

            })
            .catch(err => {console.log('error in post', err);});
    }
    render(){
        return(
            <div className = "registration-container">
                <h1>Register for this site please</h1>
                <form onSubmit = {this.handleSubmit}>
                    <input onChange = {this.handleChange} name = "first" type = "text" placeholder = "first name"/>
                    <input onChange = {this.handleChange} name = "last" type = "text" placeholder = "last name"/>
                    <input onChange = {this.handleChange} name = "email" type = "text" placeholder = "eMail"/>
                    <input onChange = {this.handleChange} name = "password" type = "text" placeholder = "password"/>
                    <button>register</button>
                </form>
                <p>{this.state.error}</p>
            </div>
        );
    }
}

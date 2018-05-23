import React, { Component } from 'react';
import '../css/AuthForm.css';

class AuthForm extends Component {

    state = {
        isRegister: false,
        ws: {}
    };

    socket = {};

    render(){
        this.socket = this.props.socket;
        const isError = this.props.isError;
        const errorDetail = this.props.errorDetail;
        const nick_field = this.state.isRegister ? (
            <div className="form-group">
                <small>How will others know you?</small><br />
                <label htmlFor="nickname">Nickname</label>
                <input type="text" className="form-control" id="nickname" placeholder="Type your nickname here..." required />
            </div>
        ) : (
            <div></div>
        );
        const error_tip = isError ? (
            <div className="alert alert-danger" role="alert">{errorDetail}</div>
        ) : (
            <div></div>
        );
        return (
            <div className="overlay container-fluid">
                <div className="row form-wrap">
                    <form id="auth_form" className="needs-validation">
                        {error_tip}
                        <div className="form-group">
                            <label htmlFor="username">Login</label>
                            <input type="text" className="form-control" id="username" placeholder="Type your username here..." required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Your password?" required />
                        </div>
                        {nick_field}
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="need_register" onChange={this.toggleRegister} />
                            <label className="form-check-label" htmlFor="need_register" >Register me, please</label>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={this.submitForm}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    toggleRegister = () => {
        console.log("New state " + !this.state.isRegister);
        this.setState({
            isRegister: !this.state.isRegister
        });
    };

    submitForm = (e) =>{
        e.preventDefault();
        let r = {};
        const username = document.getElementById("username").value;
        const passwd = document.getElementById("password").value;
        const need_register = document.getElementById("need_register").checked;
        if(need_register){
            const nickname = document.getElementById("nickname").value;
            r = {
                "username": username,
                "passwd": passwd,
                "nickname": nickname
            };
            this.socket.emit('register', r);
        } else {
            r = {
                "username": username,
                "passwd": passwd
            };
            this.socket.emit('auth', r);
        }

        console.log("Submitted ", r);
    };
}

export default AuthForm;
import React, { Component } from 'react';
import '../css/Header.css';

const request = {
    "class": "",
    "action": "",
    "key": ""
};

class Header extends Component {

    state = {
        addChat: false,
        editChat: false,
        addUser: false
    }

    render(){
        const chatUsers = this.props.chatUsers;
        const chatTitle = this.props.chatTitle;
        const chatId = this.props.chatId;
        const chatError = this.props.chatError;
        const e_error = (chatError != "") ? (
            <div className="alert alert-danger alert-custom" role="alert">{chatError}</div>
        ) : (
            <span></span>
        )
        const e_title = !this.state.addChat ? (
            <a className="navbar-brand" href="#">ЫChat</a>
        ) : (
            <span></span>
        );
        const e_add_chat = this.state.addChat ? (
            <form className="form-inline">
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text">@</span>
                    </div>
                    <input type="text" className="form-control" id="new_name" placeholder="Nickname/Title" onSubmit={this.handleKey}/>
                    <input type="hidden" id="new_id" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={this.processAddChat}>Add</button>
                        <button className="btn btn-outline-secondary" type="button" onClick={this.handleAddFormClick}>Cancel</button>
                    </div>
                </div>
            </form>
        ) : (
            <form className="form-inline">
                <button className="btn btn-sm align-middle btn-outline-secondary" type="button" onClick={this.handleAddFormClick}>Create new chat</button>
            </form>
        );
        const e_add_to_chat = this.state.addUser ? (
            <form className="form-inline form-user">
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <span className="input-group-text">@</span>
                    </div>
                    <input type="text" className="form-control" id="add_username" placeholder="Nickname" />
                    <input type="hidden" id="new_id" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => this.processAddUser(chatId, e)}>Add</button>
                        <button className="btn btn-outline-secondary" type="button" onClick={this.handleAddUserFormClick}>Cancel</button>
                    </div>
                </div>
            </form>

        ) : (
            <form className="form-inline form-user">
                <button className="btn btn-sm align-middle btn-outline-secondary" type="button" onClick={this.handleAddUserFormClick}>Add user here</button>
            </form>
        );
        const e_edit_chat = this.state.editChat ? (
            <form className="form-inline form-title">
                <div className="input-group input-group-sm">
                    <input type="text" className="form-control" id="chat_title" placeholder="Type new title..." defaultValue={chatTitle} onKeyPress={this.handleKey} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => this.processEditChat(chatId, e)}>Save</button>
                        <button className="btn btn-outline-secondary" type="button" onClick={this.handleEditFormClick}>Cancel</button>
                    </div>
                </div>
            </form>
        ) : (
            <form className="form-inline form-title">
                <button className="btn btn-sm align-middle btn-light" type="button" onClick={this.handleEditFormClick}>{chatTitle}</button>
            </form>
        );

        if(chatId != ""){
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    {e_title}
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {e_add_chat}
                        {e_error}
                    </div>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {e_edit_chat}
                        {e_add_to_chat}
                    </div>
                    <form className="form-inline">
                        <button className="btn btn-sm align-middle btn-danger" type="button" onClick={(e) => this.processRemoveMe(chatId, e)}>Leave this chat</button>
                        <button className="btn btn-sm align-middle btn-primary" type="button" onClick={this.processDeAuth}>Log out</button>
                    </form>
                </nav>
            );
        } else {
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    {e_title}
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {e_add_chat}
                        {e_error}
                    </div>
                    <form className="form-inline">
                        <button className="btn btn-sm align-middle btn-primary" type="button" onClick={this.processDeAuth}>Log out</button>
                    </form>
                </nav>
            );
        }

    }

    processAddChat = () => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        const title = document.getElementById("new_name").value;
        let r = Object.assign({}, request);
        r.class = "chats";
        r.action = "create";
        r.title = title;
        r.key = key;
        console.log(r);
        socket.emit('action', r);
        this.setState({addChat: false});
    };

    processAddUser = (chat_id) => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        const username = document.getElementById("add_username").value;
        let r = Object.assign({}, request);
        r.class = "chats";
        r.action = "add_user";
        r.username = username;
        r.chat_id = chat_id;
        r.key = key;
        console.log(r);
        socket.emit('action', r);
        this.setState({addUser: false});
    };

    processEditChat = (chat_id) => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        const title = document.getElementById("chat_title").value;
        let r = Object.assign({}, request);
        r.class = "chats";
        r.action = "edit";
        r.chat_id = chat_id;
        r.title = title;
        r.key = key;
        console.log(r);
        socket.emit('action', r);
        this.setState({editChat: false});
    };

    processRemoveMe = (chat_id) => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        let r = Object.assign({}, request);
        r.class = "chats";
        r.action = "remove_me";
        r.chat_id = chat_id;
        r.key = key;
        console.log(r);
        socket.emit('action', r);
    };

    handleKey = (e) => {
        return false;
    };

    handleAddFormClick = () => {
        this.setState({addChat: !this.state.addChat});
    };

    handleAddUserFormClick = () => {
        this.setState({addUser: !this.state.addUser});
    };

    handleEditFormClick = () => {
        this.setState({editChat: !this.state.editChat});
    };

    processDeAuth = () => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        let r = Object.assign({}, request);
        r.key = key;
        console.log(r);
        socket.emit('deauth', r);
    };
}

export default Header;
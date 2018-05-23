import React, { Component } from 'react';
import Connection from './Connection.js';
import AuthForm from './AuthForm.js';
import Header from './Header.js';
import ChatList from './ChatList.js';
import MsgList from './MsgList.js';
import '../css/App.css';

const request = {
    "class": "",
    "action": "",
    "key": ""
};

class App extends Component {

    state = {
        isConnected: false,
        isLoginError: false,
        errorDetail: "",
        isLogged: false,
        authKey: "",
        chats: [],
        chatActive: "",
        chatTitle: "",
        chatUsers: [],
        chatError: "",
        users: [],
        messages: [],
        ws: {}
    };

    componentDidMount(){
        const io = require('socket.io-client');
        const socket = io.connect('http://localhost:8080');
        socket.on('connect', () => {
            this.setState({ws: socket});
            this.setState({isConnected: true});
        });
        socket.on('disconnect', () => {
            this.setState({ws: {}});
            this.setState({isConnected: false});
        });
        // Auth result
        socket.on('auth', (r) => {
            if(r.status == "error"){
                this.setState({isLoginError: true, isLogged: false, authKey: "", errorDetail: r.detail});
            } else {
                this.setState({isLoginError: false, isLogged: true, authKey: r.detail});
            }
            console.log("Received from back: ", r);
        });
        // Auth result
        socket.on('deauth', (r) => {
            this.setState({isLoginError: false, isLogged: false, authKey: "", errorDetail: ""});
            console.log("Received from back: ", r);
        });
        // Register result
        socket.on('register', (r) => {
            if(r.status == "error"){
                this.setState({isLoginError: true, isLogged: false, authKey: "", errorDetail: r.detail});
            } else {
                this.setState({isLoginError: false, isLogged: true, authKey: r.detail});
            }
            console.log("Received from back: ", r);
        });

        // Main callback
        socket.on('info', this.processData);
        socket.on('event-msg', this.updateMessages);
    };

    render() {
        if(this.state.isConnected){
            if(this.state.isLogged) {
                return (
                    <div className="row lists-container">
                        <Header socket={this.state.ws} authKey={this.state.authKey} users={this.state.users} chatUsers={this.state.charUsers} chatTitle={this.state.chatTitle} chatId={this.state.chatActive} chatError={this.state.chatError}/>
                        <ChatList socket={this.state.ws} authKey={this.state.authKey} chats={this.state.chats} active={this.state.chatActive}/>
                        <MsgList socket={this.state.ws} authKey={this.state.authKey} messages={this.state.messages} active={this.state.chatActive}/>
                    </div>
                );
            } else {
                return (
                    <AuthForm socket={this.state.ws} isError={this.state.isLoginError} errorDetail={this.state.errorDetail}/>
                );
            }
        } else {
            return (
                <Connection/>
            );
        }
    }

    processData = (r) => {
        console.log("Received from back (action): ", r);
        const socket = this.state.ws;
        const key = this.state.authKey;
        let rq = Object.assign({}, request);
        switch (r.class) {
            case "users":
                switch (r.action) {
                    case "search":
                        this.setState({users: r.data});
                        break;
                    case "list":
                        this.setState({users: r.data});
                        break;
                    default:
                        console.log("Strange answer, class " + r.class + ", action " + r.action);
                        break;
                }
                break;
            case "chats":
                switch (r.action) {
                    case "create":
                        if(r.status == "error"){
                            this.setState({chatError: r.detail});
                        } else {
                            rq.class = "chats";
                            rq.action = "get";
                            rq.key = key;
                            console.log(rq);
                            socket.emit('action', rq);
                            this.setState({chatError: "", chatActive: r.id, chatTitle: r.detail, messages: []});
                        }
                        break;
                    case "get":
                        this.setState({chats: r.data});
                        break;
                    case "edit":
                        this.setState({chatTitle: r.detail, chatActive: r.id});
                        break;
                    case "info":
                        rq.class = "messages";
                        rq.action = "get";
                        rq.chat_id = r.id;
                        rq.limit = 100;
                        rq.key = key;
                        console.log(rq);
                        socket.emit('action', rq);
                        this.setState({chatTitle: r.detail, chatUsers: r.data, chatActive: r.id});
                        break;
                    case "add_user":
                        if(r.status == "error"){
                            this.setState({chatError: r.detail});
                        } else {
                            this.setState({chatError: ""});
                        }
                        break;
                    case "remove_me":
                        rq.class = "chats";
                        rq.action = "get";
                        rq.key = key;
                        console.log(rq);
                        socket.emit('action', rq);
                        this.setState({chatError: "", chatActive: "", chatTitle: "", messages: []});
                        break;
                    default:
                        console.log("Strange answer, class " + r.class + ", action " + r.action);
                        break;
                }
                break;
            case "messages":
                // TODO: refactor this? may be ignore action? Or do not reload all on send msg?
                switch (r.action) {
                    case "send":
                        // Reload messages in chat
                        rq.class = "messages";
                        rq.action = "get";
                        rq.chat_id = this.state.chatActive;
                        rq.limit = 100;
                        rq.key = key;
                        console.log(rq);
                        socket.emit('action', rq);
                        break;
                    case "get":
                        this.setState({messages: r.data, chatActive: r.detail});
                        break;
                    case "search":
                        this.setState({messages: r.data, chatActive: r.detail});
                        break;
                    default:
                        console.log("Strange answer, class " + r.class + ", action " + r.action);
                        break;
                }
                break;
            default:
                console.log("Strange answer, class " + r.class + ", action " + r.action);
                break;
        }
    };

    updateMessages = (chat_id) => {
        const socket = this.state.ws;
        const key = this.state.authKey;
        let rq = Object.assign({}, request);
        rq.class = "messages";
        rq.action = "get";
        rq.chat_id = chat_id;
        rq.limit = 100;
        rq.key = key;
        console.log(rq);
        socket.emit('action', rq);
    }

}

export default App;

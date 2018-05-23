import React, { Component } from 'react';
import ChatItem from './ChatItem.js';
import '../css/ChatList.css';

const request = {
    "class": "chats",
    "action": "",
    "key": ""
};

class ChatList extends Component {

    componentDidMount(){
        const socket = this.props.socket;
        const key = this.props.authKey;
        //Initial chat loading
        this.loadChats(socket, key);
    }

    render(){
        const chats = this.props.chats;
        const active = this.props.active;
        return (
            <div className="col-3 chat-container">
                {
                    chats.map((elem) => (
                        <ChatItem chat={elem} active={active} onChatChange={this.handleChatChange} key={elem.id}/>
                    ))
                }
            </div>
        )
    }

    loadChats = (socket, key) => {
        let r = Object.assign({}, request);
        r.action = "get";
        r.key = key;
        console.log(r);
        socket.emit('action', r);
    };

    handleChatChange = (chat_id) => {
        const socket = this.props.socket;
        const key = this.props.authKey;
        let r = Object.assign({}, request);
        r.class = "chats";
        r.action = "info";
        r.chat_id = chat_id;
        r.key = key;
        console.log(r);
        socket.emit('action', r);
    }

}

export default ChatList;
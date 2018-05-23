import React, { Component } from 'react';
import '../css/ChatItem.css';

class ChatItem extends Component {
    render(){
        const chat = this.props.chat;
        const active = this.props.active;
        const id = chat.id;
        const h_class = (active == id) ? ("chat-active") : ("");
        const msg_cnt = ((active != id) && (chat.unread != "0")) ? (<span className="badge badge-secondary">{chat.unread}</span>) : (<span></span>);
        return (
            <div className={"chat-item " + h_class} data-id={chat.id} onClick={(e) => this.handleSelect(id, e)}>
                <div className="row">
                    <div className="col-3">
                        <img className="chat-img" src={require('../i/logo.svg')} alt="Avatar"/>
                    </div>
                    <div className="col-9 chat-name-wrap">
                        <span className="chat-name">{chat.title} {msg_cnt}</span>
                    </div>
                </div>
            </div>
        )
    }

    handleSelect = (id, e) => {
        this.props.onChatChange(id);
    };
}

export default ChatItem;
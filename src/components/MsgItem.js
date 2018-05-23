import React, { Component } from 'react';
import '../css/MsgItem.css';

class MsgItem extends Component {
    render(){
        const {msg} = this.props;
        return (
            <div className="msg-item-wrap" data-id={msg.id}>
                <div className="msg-item">
                    <div className="msg-author-wrap">
                        <span className="msg-author">{msg.nickname}</span>
                    </div>
                    <div className="msg-body-wrap">
                        <p className="msg-body">{msg.body}</p>
                    </div>
                    <div className="msg-ts-wrap">
                        <span className="msg-ts">{msg.ts}</span>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }
}

export default MsgItem;
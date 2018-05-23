import React, { Component } from 'react';
import MsgItem from './MsgItem.js';
import '../css/MsgList.css';

const request = {
    "class": "chats",
    "action": "",
    "key": ""
};

class MsgList extends Component {

    componentDidUpdate(){
        document.getElementById("msg_list").scrollTop = document.getElementById("msg_list").scrollHeight;
    };

    render(){
        const messages = this.props.messages;
        return(
            <div className="col-9">
                <div className="msg-container" id="msg_list">
                    {
                        messages.map((elem) => (
                            <MsgItem msg={elem} key={elem.id}/>
                        ))
                    }
                </div>
                <div className="mf-wrap">
                    <div className="input-group mb-3">
                        <input type="text" id="new_msg" className="form-control" placeholder="Текст сообщения..." onKeyUp={this.completeInput}/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">Отправить</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    completeInput = (e) =>{
        if(e.keyCode === 13){
            let msg = document.getElementById("new_msg").value;
            console.log("Added msg ", msg);

            const socket = this.props.socket;
            const key = this.props.authKey;
            const chat_id = this.props.active;
            let r = Object.assign({}, request);
            r.class = "messages";
            r.action = "send";
            r.chat_id = chat_id;
            r.body = msg;
            r.key = key;
            console.log(r);
            socket.emit('action', r);

            document.getElementById("new_msg").value = "";

        }
    };
}

export default MsgList;
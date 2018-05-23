import React, { Component } from 'react';
import '../css/Connection.css';

class Connection extends Component {
    render(){
        const {data} = this.props;
        return (
            <div className="overlay container-fluid">
                <div className="row progress-wrap-text">
                    <h3>Waiting for connect...</h3>
                </div>
                <div className="row progress-wrap-img">
                    <img src={require('../i/conn.gif')} alt="Connecting" />
                </div>
            </div>
        )
    }
}

export default Connection;
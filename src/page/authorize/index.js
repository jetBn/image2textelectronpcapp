
import React, { Component } from 'react';
import './style.scss'
const { ipcRenderer } = window.require('electron')
class Authorize extends Component {
    askForScreenRecordPermission() {
        ipcRenderer.send('require-mac-screen-capture-permission')
    }
    render() {
        return (
            <div className="authorize-box">
                <div className="title">请先授予我们访问屏幕截图权限</div>
                <img src={require('@/assets/images/authorize_bg.png')} alt=""></img>
                <button className="authorize-btn" onClick={this.askForScreenRecordPermission}>立即去授权</button>
            </div>
        );
    }
}

export default Authorize
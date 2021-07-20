import React, { Component } from 'react';
import './style.scss'

export default class Tab extends Component {
    itemClickHandle(index){
        this.props.tabItemClick(index)
    }
    render() {
    const { tabsTitle, actIndex } = this.props
    // const  { actIndex } = this.state
    return (
        <div className="tab-box">
            <ul>
                {
                    tabsTitle.map((item ,index)=> {
                        return (
                            <li key={index} className={index === actIndex ?  `${'tab-item'} ${'active'}` : 'tab-item'} onClick={this.itemClickHandle.bind(this, index)}>{item}</li>
                        )
                    })
                }
            </ul>
        </div>
    );
    }
}

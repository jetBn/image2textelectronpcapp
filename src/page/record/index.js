import React, { Component, Fragment } from 'react';
import { getOcrRecordList } from '@/api/main.js'
import { message } from 'antd';
import './style.scss'
const { clipboard  } = window.require('electron')

export default class Record extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowPrivew: false,
      privewItem: {},
      dataList:[]
    }
  }
 async componentDidMount() {  
  const res = await getOcrRecordList({})
  // console.log(res)
  this.setState({
    dataList: res.data.user_conversion_record
  })
  }

  contentItemCopyClick(text) {
    clipboard.writeText(text)
    message.success('复制成功！')
  }

  privewClickHandle(item) {
    this.setState({
      isShowPrivew: true,
      privewItem: item
    })
  }
  
  rebackToListHandle() {
    this.setState({
      isShowPrivew: false,
      privewItem: {}
    })
  }

  render() {
    const { isShowPrivew, privewItem, dataList } = this.state
    return (
      <div className="record-box">
        {
          isShowPrivew ? (
            <div className="privew-box">
              <div className="left">
                <img src={privewItem.ucr_image_str} alt=""/>
              </div>
              <div className="right">
                  {privewItem.ucr_result}
              </div>
              <button className="reback" onClick={this.rebackToListHandle.bind(this)}>返回</button>
            </div>
          ) : (
            <Fragment>
              <div className="list">
                {
                 dataList.map((item, index) => {
                   return (
                    <div className="item">
                    <div className="top">
                      <div className="left">
                        <div className="img"
                              style={{
                                background: `url(${item.ucr_image_str})`, 
                                backgroundSize: 'cover',
                                backgroundRepeat:'no-repeat'}}
                        ></div>
                      </div>
                      <div className="right">
                           {item.ucr_result}
                      </div>  
                    </div>
                    <div className="bottom">
                      <div className="left">
                        <div onClick={this.privewClickHandle.bind(this, item)}>查看原图</div>
                      </div>
                      <div className="right">
                          <button onClick={this.contentItemCopyClick.bind(this, item.ucr_result)}>复制结果</button>
                      </div>  
                    </div>
                  </div>  
                   )
                 })
                }
              
              </div>  
            </Fragment>
          ) 
        }
        
      </div>
    )
  }
}

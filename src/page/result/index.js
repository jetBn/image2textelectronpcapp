
import React, { Component } from 'react';
import './style.scss'
import { message } from 'antd';
import { generalOCR } from '@/api/main.js'
const { ipcRenderer, clipboard  } = window.require('electron')

class Result extends Component {
    constructor(props) {
        super(props)
        this.state= {
            imgUrl: '',
            contentList: [
                {words_result: ''}
            ]
        }
    }

    async componentDidMount() {
        ipcRenderer.on('capture-img-url', async (e, url) => {
        console.log("start ocr")
          const res = await generalOCR({image_list: JSON.stringify([url])})
          console.log(res)
          this.setState({
            image_base64: url,
            contentList: res.data.result
          })
          // this.imgItemClick(url)
        })
    }

    contentItemCopyClick(text) {
        clipboard.writeText(this.state.contentList[0].words_result)
        message.success('复制成功！')
      }

    exportFileHandle() {
        ipcRenderer.send('save-file', this.state.contentList[0].words_result)
        // remote.dialog.showSaveDialog({
        //     filters: [{
        //         name: 'text',
        //         extensions: ['text'],
        //     }],
        // }, (path) => {
        //     console.log(path)
        //     fs.writeFile(path, that.state.contentList[0].words_result, 'utf8', (err) => {
        //         !err && message.success('保存成功！')
        //     })
        // })
       
    }
    render() {
        return (
           <div className="result-box">
               <div className="left">
                   <img src={this.state.imgUrl} alt=""/>
               </div>
               <div className="right">
                    <div className="content">{this.state.contentList[0].words_result}</div>
                   <div className="buttom">
                       <div className="text" onClick={this.contentItemCopyClick.bind(this)}>复制识字结果</div>
                       <div className="text" onClick={this.exportFileHandle.bind(this)}>保存到文件</div>
                   </div>
               </div>
           </div>
        );
    }
}

export default Result
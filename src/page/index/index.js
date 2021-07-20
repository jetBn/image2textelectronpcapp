import React, { Fragment } from 'react';
import './style.scss'
import { generalOCR } from '@/api/main.js'
import Drag from '@/components/Drag'
import { message } from 'antd';

import Analytics from 'electron-google-analytics';
const { ipcRenderer, clipboard  } = window.require('electron')

const analytics = new Analytics('G-B0NKZL7WDX');

analytics.pageview('http://example.com', '/home', 'Example')
  .then((response) => {
    console.log("ga resp:",response)
  }).catch((err) => {
    // return err;
    console.log("ga err:",err)
  });

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      imgArr: [],
      contentList: [],
      token:'',
      isShoWImgPrivew: false,
      isShowContentPrivew: false,
      privewImgUrl: '',
      privewContent: ''
    }
    this.imgUploadOnchange = this.imgUploadOnchange.bind(this)
  }
  captureHandle() {
    ipcRenderer.send('capture-screen', { cType: 'mutile' })
  }
  async imgItemClick(imgBase64) {
    console.log("Img Item Click");

    try {
      const res = await generalOCR({image_list: JSON.stringify([imgBase64])})
      this.setState({
        contentList: res.data.words_result
      })
    }catch(e)
    {
      console.log(e)
    }
    // this.props.history.push('/login')
  }
  componentDidMount() {
    ipcRenderer.on('capture-img-url', (e, url) => {
      this.setState({
        imgArr: [...this.state.imgArr, url]
      })
      // this.imgItemClick(url)
    })
    // authLogin()
    // .then(res => {
    //   console.log(res)
    //   this.setState({
    //     token: res.data.user.user_token
    //   })
    //   localStorage.setItem('token', res.data.user.user_token)
    // })
  }
  imgUploadOnchange(e) {
    let that = this
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (res) => {
      that.setState({
        imgArr: [...that.state.imgArr, res.target.result]
      })
    }
  }
  
  // onDropedImg(data) {
  //   let that = this
  //   let reader = new FileReader()
  //   reader.readAsDataURL(data)
  //   reader.onload = (res) => {
  //     that.setState({
  //       imgArr: [...that.state.imgArr, res.target.result]
  //     })
  //   }
  // }

  delImgArrItem(index) {

    let imgArr = this.state.imgArr
    imgArr.splice(index, 1)
    this.setState({
      imgArr: [...imgArr]
    })
  }
  setMainImgList(data) {
    console.log(data)
    // let this = this
    this.setState({
      imgArr: [...this.state.imgArr, ...data]
    })
  }

  contentImte(item, index) {
    return (
      <div className="content-item" key={index}>
        <div className="fill">{item.words_result}</div>
        <div className="bottom">
          <div className="zoom" onClick={this.showPrivewContentHandle.bind(this,item.words_result )}><img src={require('@/assets/images/s.png')} alt=""/></div>
          <div className="copy" onClick={this.contentItemCopyClick.bind(this, item.words_result)}>复制结果</div>
        </div>
      </div>
    )
  }
  async ocrClickHandle() {
    // console.log(this.state.imgArr)

    console.log("batch ocr clicked");
    const res = await generalOCR({image_list: JSON.stringify(this.state.imgArr), token: this.state.token})
    console.log(res)
    this.setState({
      contentList: res.data.result
    })
  }

  contentItemCopyClick(text) {
    clipboard.writeText(text)
    message.success('复制成功！')
  }

  clearClickHandle(){
    this.setState({contentList: []})
  }

  copyAllClickHandle() {
    const { contentList } = this.state
    let resText = ''
    for(let i = 0 ; i < contentList.length; i++) {
      resText += contentList[i].words_result
    }
    clipboard.writeText(resText)
    message.success('复制成功！')
  }

  showPrivewImgHandle(url){
    this.setState({
      privewImgUrl: url,
      isShoWImgPrivew: true,
      isShowContentPrivew: false
    })
  }

  rebackToListHandle(){
    this.setState({
      privewImgUrl: '',
      privewContent: '',
      isShoWImgPrivew: false,
      isShowContentPrivew: false
    })
  }

  showPrivewContentHandle(content) {
    this.setState({
      privewContent: content,
      isShoWImgPrivew: false,
      isShowContentPrivew: true
    })
  }

  render() {
      const { imgArr, contentList, isShoWImgPrivew, privewImgUrl, isShowContentPrivew, privewContent } = this.state
      return (
        <Drag setMainImgList={this.setMainImgList.bind(this)}>
          <div className="container">
              {/* <a href='#/capture'>去detail</a> */}
              <div className="box">
                {imgArr.length === 0 ? (
                  <div className="left empty">
                    <img src={require('@/assets/images/icon_img.png')}  alt=""/>
                    <span>点击选择图片或者将图片拖到这里</span>
                  </div>
                ) : (
                  <div className="left">
                    {
                      isShoWImgPrivew ? (
                          <div className="privew-box">
                            <img src={privewImgUrl} alt=""/>
                          </div>
                      ) : (
                        <ul>
                        {
                          imgArr.map((img , index) => (
                            <li key={index} onClick={this.imgItemClick.bind(this, img)}>
                              <div className="item-left">
                                <img src={img} alt=''/>
                              </div>
                              <div className="item-right">
                                <div onClick={this.showPrivewImgHandle.bind(this, img)}><img src={require('@/assets/images/s.png')} alt=''/></div>
                                <div onClick={this.delImgArrItem.bind(this, index)}><img src={require('@/assets/images/icon_delete.png')} alt=''/></div>
                              </div>
                            </li>
                          ))
                        }   
                        <li className="min-drag">
                           {/* <Drag onDropedImg={this.onDropedImg.bind(this)}> */}
                              <div className="main">
                                <img src={require('@/assets/images/icon_img.png')}  alt=""/>
                                <span>点击选择图片或者将图片拖到这里</span>
                              </div>
                           {/* </Drag>  */}
                        </li>  
                      </ul>
                      )
                    }
                  </div>
                )}
                  {
                      contentList.length === 0 ? (
                        <div className="right empty">
                          <img src={require('@/assets/images/icon_text.png')}  alt=""/>
                          <span style={{marginTop: '52px', color:'#898B95'}}>识别结果</span>
                        </div>
                      ) : (
                        <div className="right">
                          {
                            isShowContentPrivew ? (
                              <div className="content-privew">
                                {privewContent}
                              </div>
                            ) : (
                              <Fragment>
                                {
                                  contentList.map((item, index) => {
                                    return this.contentImte(item, index)
                                  })
                                }
                              </Fragment>

                            )
                          }
                         
                        </div>
                      )
                  }
                  
              </div>
              {
                isShoWImgPrivew || isShowContentPrivew ? (
                  <button className="reback" onClick={this.rebackToListHandle.bind(this)}>返回</button>
                ) : (
                  <Fragment>
                    <button onClick={this.captureHandle}>截图</button>
                    <div className="file">
                      选择图片
                      <input type="file" accept="image/jpeg, image/png" onChange={this.imgUploadOnchange}></input>
                    </div>
                    <button className="start-ocr" onClick={this.ocrClickHandle.bind(this)}>开始识别</button>
                    {contentList.length > 0 && (
                      <Fragment>
                        <button className="clear" onClick={this.clearClickHandle.bind(this)}>清空</button>
                        <button className="copy-all" onClick={this.copyAllClickHandle.bind(this)}>复制全部</button>
                      </Fragment>
                    ) }
                  </Fragment>
                )
              }
          </div>
        </Drag>
      )
  }
}

export default Index;

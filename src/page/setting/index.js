import React, { Component, Fragment } from 'react';
import Tabs from '@/components/Tab'
import './style.scss'
import { userRegister, getUserRegisterVCode, authLogin } from '@/api/main.js'
import { message, Button } from 'antd';
import IAPView from "./components/iapview"
const { ipcRenderer } = window.require('electron')
export default class Setting extends Component {
  state = {
    actIndex: 0,
    isShowWechatBlock:false,
    showMainMemBlock:true,
    showPhongLoginBlock: false,
    showRegisterBlock: false,
    showForgetBlock: false,
    showInfoBlock: false,
    settingHotkeyVal: 'Ctrl + Shift + C',
    outTime: 60,
    verifyBtnText: '发送验证码',
    verifyBtnDisabled: false,
    userInfo: {},
    loginForm: {
      phone: '',
      password: ''
    },
    registerForm: {
      phone: '',
      password: '',
      verifyCode: ''
    },
    forgetLoginForm: {
      phone: '',
      password: '',
      verifyCode: ''
    },
    isOpenStart: true
  }

  memberDisplay() {
    const {showInfoBlock, isShowWechatBlock, showMainMemBlock, showPhongLoginBlock, showRegisterBlock, showForgetBlock} = this.state
    if(showMainMemBlock){
      return(
        <div className="member-box">
          <div className="list">
            <div className="item" onClick={this.showDisplayClickHandle.bind(this, 'wechat', 'open')}>
              <img src={require('@/assets/images/icon_wechat.png')} alt=""/>
              <span>微信登录</span>
              <div className="tip">推荐</div>
            </div>
            <div className="item" onClick={this.showDisplayClickHandle.bind(this, 'phone', 'open')}>
              <img src={require('@/assets/images/icon_iphone.png')} alt=""/>
              <span>手机号登录</span>
            </div>
          </div>

          <Button onClick={this.iAPPurchase.bind(this)}>购买IAP</Button>
        </div>
      )
    } else {
      console.log(isShowWechatBlock)
      if(isShowWechatBlock){
        return this.wechatLoginDisplay()
      }
      if(showPhongLoginBlock) {
        return this.phoneLoginDisplay()
      }
      if(showRegisterBlock) {
        return this.registerDisplay()
      }
      if(showForgetBlock) {
        return this.forgetLoginDisplay()
      }
      if(showInfoBlock) {
        return this.userInfoDisplay()
      }
    }
 
  }


  iAPPurchase() {
    console.log("iA purchase")
  }

  settingDisplay() {
    return (
      <div className="setting-box">
          <div className="form-item">
            <div className="left">开机启动</div>
            <div className="right">
                <input type="checkbox" name="checkbox" id="btn1" value={true}  checked={this.state.isOpenStart} onChange={this.checkboxChangeHandle.bind(this)} />
            </div>
          </div>
          <div className="form-item">
            <div className="left">截图识图快捷键</div>
            <div className="right">
                <input className="input" value={this.state.settingHotkeyVal} type="text" onChange={this.settingHotkeyChange.bind(this)} onBlur={this.settingHotkeyChangeBlur.bind(this)}/>
            </div>
          </div>
      </div>
    )
  }
  checkboxChangeHandle(e) {
    const checkedVal= e.target.checked
    this.setState({
      isOpenStart: checkedVal
    })
    if(checkedVal) {
      ipcRenderer.send('is-open-start')
    }
  }

  settingHotkeyChange(e) {
    this.setState({
      settingHotkeyVal: e.target.value
    })
  }
  settingHotkeyChangeBlur() {
    ipcRenderer.send('hotkey-setting', this.state.settingHotkeyVal)
  }

  aboutDisplay() {
    return(
      <div className="about-box">
        <img src={require('@/assets/images/png_default_logo.png')} alt=""/>
        <span>传图识字</span>
      </div>
    )
  }

  getiAPView(){
    return <IAPView></IAPView>
  }

 
  tabContent() {
    const { actIndex } = this.state
    switch(actIndex){
      case 0:
        return this.memberDisplay()
      case 1:
        return this.settingDisplay()
      case 2:
        return this.aboutDisplay()
      case 3:
        return this.getiAPView()
      default:
    }
  }
  returnTitle(typeTag) {
    return(
      <div className="reback-box" onClick={this.showDisplayClickHandle.bind(this, typeTag)}>返回</div>
    )
  }
  showDisplayClickHandle(typeTag, type) {
    console.log(typeTag)
    switch(typeTag){
      case 'wechat':
       /* this.setState({
          showMainMemBlock: !this.state.showMainMemBlock,
          isShowWechatBlock: !this.state.isShowWechatBlock,
          showPhongLoginBlock: false
        })*/
        message.warn('暂未开放')
        break
      case 'phone':
        this.setState({
          showMainMemBlock: !this.state.showMainMemBlock,
          showPhongLoginBlock: !this.state.showPhongLoginBlock,
          isShowWechatBlock: false,
          showRegisterBlock: false
        })
        break
        case 'register':
          this.setState({
            showMainMemBlock: false,
            showPhongLoginBlock: !this.state.showPhongLoginBlock,
            showRegisterBlock: !this.state.showRegisterBlock,
            isShowWechatBlock: false
          })
          break
        case 'forget':
          this.setState({
            showMainMemBlock: false,
            showPhongLoginBlock: !this.state.showPhongLoginBlock,
            showForgetBlock: !this.state.showForgetBlock,
            isShowWechatBlock: false
          })
          break
      default:
    }
  }


  wechatLoginDisplay() {
    return (
      <div className="wechat-box setting-box-com">
        {this.returnTitle('wechat')}
        <div className="main">
          <div className="title">微信登录</div>
          <img className="qrcode" src={require('@/assets/images/png_default_logo.png')} alt=""/>
          <span>请打开微信扫一扫登录</span>
        </div>
      </div>
    )
  }

  phoneLoginDisplay() {
    const { phone, password } = this.state.loginForm
    return (
      <div className="phone-box setting-box-com">
        {this.returnTitle('phone')}
        <div className="main">
            <div className="form-item">
              <div className="left">手机号</div>
              <div className="right">
                <input className="form-input"
                       value={ phone } 
                       onChange={ (e)=> this.setState({loginForm: {...this.state.loginForm, phone: e.target.value }})}/>
              </div>
            </div>
            <div className="form-item">
              <div className="left">密码</div>
              <div className="right">
                 <input type="password" className="form-input"
                      value={ password } 
                      onChange={ (e)=> this.setState({loginForm: {...this.state.loginForm, password: e.target.value }})}/>
              </div>
            </div>
            <div className="form-bottom">
              <div className="pl-block"></div>
              <div className="content">
                <button onClick={this.loginHandle.bind(this)}>登录</button>
                <div className="remain">
                  <div className="left" onClick={this.showDisplayClickHandle.bind(this, 'forget', 'open')}>忘记密码</div>
                  <div className="right" onClick={this.showDisplayClickHandle.bind(this, 'register', 'open')}>立即注册</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
  async loginHandle() {
    const { phone, password } = this.state.loginForm
    const params = {
      u_phone: phone ,
      u_password: password,
    }
    const res = await authLogin(params)
    // console.log(res)
    if(res) {
      message.success('登录成功！')
      localStorage.setItem('token', res.data.user.user_token)
      ipcRenderer.send('token', res.data.user.user_token)
      this.setState({
        showInfoBlock: true,
        showMainMemBlock: false,
        showPhongLoginBlock: false,
        userInfo: res.data.user
      })
    }
  }

  registerDisplay() {
    const { phone, password } = this.state.registerForm
    return (
      <div className="phone-box setting-box-com">
        {this.returnTitle('register')}
        <div className="main">
            <div className="form-item">
              <div className="left">手机号</div>
              <div className="right">
                <input className="form-input" 
                       value={ phone } 
                       onChange={ (e)=> this.setState({registerForm: {...this.state.registerForm, phone: e.target.value }})}/>
              </div>
            </div>
            <div className="form-item">
              <div className="left">验证码</div>
              <div className="right">
                <input className="form-input verify" onChange={ (e)=> this.setState({registerForm: {...this.state.registerForm, verifyCode: e.target.value }})}/>
                <button className="verify-btn" disabled={this.state.verifyBtnDisabled} onClick={this.getVerifyCodeHandle.bind(this)}>{this.state.verifyBtnText}</button>
              </div>
            </div>
            <div className="form-item">
              <div className="left">密码</div>
              <div className="right">
                 <input type="password" 
                        value={password} 
                        onChange={ (e)=> this.setState({registerForm: {...this.state.registerForm, password: e.target.value }})} className="form-input"/>
              </div>
            </div>
            <div className="form-bottom">
              <div className="pl-block"></div>
              <div className="content">
                <button onClick={this.submitRegisterHandle.bind(this,'register')}>立即注册</button>
              </div>
            </div>
        </div>
      </div>
    )
  }
  
  async submitRegisterHandle(type) {
    let formRes = { phone: '', password: '', verifyCode: '' }
    type === 'register' ?
    formRes = this.state.registerForm
    :
    formRes = this.state.forgetLoginForm 

    const params = {
      u_phone: formRes.phone ,
      u_password: formRes.password,
      verify_code: formRes.verifyCode
    }

    const res = await userRegister(params)
    if(res) {
      clearInterval(this.setIntervalTag)
      type === 'register' ?
        message.success('注册成功')
      :
        message.success('重置成功')
    }
  }

  forgetLoginDisplay() {
    const { phone, password } = this.state.forgetLoginForm
    return (
      <div className="phone-box setting-box-com">
        {this.returnTitle('forget')}
        <div className="main">
          <form>
            <div className="form-item">
              <div className="left">手机号</div>
              <div className="right">
                <input className="form-input"
                    value={ phone } 
                    onChange={ (e)=> this.setState({forgetLoginForm: {...this.state.forgetLoginForm, phone: e.target.value }})}/>
              </div>
            </div>
            <div className="form-item">
              <div className="left">验证码</div>
              <div className="right">
                <input className="form-input verify"
                onChange={ (e)=> this.setState({forgetLoginForm: {...this.state.forgetLoginForm, verifyCode: e.target.value }})}/>
                <button className="verify-btn" disabled={this.state.verifyBtnDisabled} onClick={this.getVerifyCodeHandle.bind(this)}>{this.state.verifyBtnText}</button>
              </div>
            </div>
            <div className="form-item">
              <div className="left">新密码</div>
              <div className="right">
                <input type="password" className="form-input"
                      value={ password } 
                      onChange={ (e)=> this.setState({forgetLoginForm: {...this.state.forgetLoginForm, password: e.target.value }})}/>
              </div>
            </div>
            <div className="form-bottom">
              <div className="pl-block"></div>
              <div className="content">
                <button onClick={this.submitRegisterHandle.bind(this, 'forget')}>重设密码</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  async getVerifyCodeHandle() {
      this.setState({
        verifyBtnDisabled: true
      })
      this.setIntervalTag = setInterval(() => {
        if(this.state.outTime > 0) {
          this.setState({
            outTime: this.state.outTime - 1,
            verifyBtnText: `再次发送 （${this.state.outTime}）`
          })
        } else {
          this.setState({
            outTime: 60,
            verifyBtnText: `发送验证码`,
            verifyBtnDisabled: false
          })
          clearInterval(this.setIntervalTag)
        }
      }, 1000);
      const res = await getUserRegisterVCode({u_phone: this.state.registerForm.phone})
      if(res) {
        message.success('获取验证码成功')
      }
  }

  loginOutHandle() {
    localStorage.clear()
    this.setState({
      showMainMemBlock: true,
      showInfoBlock: false
    })
  }

  userInfoDisplay() {
    const { userInfo } = this.state
    return (
    <div className="info-box setting-box-com">
        <div className="info-item">
            您好：{userInfo.user_nickname}
        </div>
        <div className="info-item">
            当前套餐：高级版
        </div>
        <div className="info-item">
            您的会员有效期：{userInfo.um_expire_time}
        </div>
        <button className="login-out" onClick={this.loginOutHandle.bind(this)}>退出登录</button>
    </div>
    )
  }

  tabItemClick(index){
    console.log(index)
    this.setState({
      actIndex: index
    })
  }

  render() {
    const { actIndex } = this.state
    return (
      <Fragment> 
        <Tabs tabsTitle={['会员', '设置', '关于','iAP']} actIndex={actIndex} tabItemClick={this.tabItemClick.bind(this)}></Tabs>
        {this.tabContent()}
      </Fragment>
    );
  }
}

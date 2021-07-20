

const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')

const path = require('path')
const {
  hasScreenCapturePermission,
  hasPromptedForPermission,
  openSystemPreferences
} = require('mac-screen-capture-permissions');


const crateAuthorizeWin = () => {
    let authorizeWin = new BrowserWindow({
      width: 640, 
      height: 504, 
      backgroundColor: "#292B35",
      darkTheme:true,
      show:true,
      autoHideMenuBar: true,
      // titleBarStyle: "hidden",
      // icon: path.join(__dirname, favIcon),
      title: '传图识字',
      webPreferences: {
        javascript: true,
        plugins: true,
        webSecurity: false,
        nodeIntegration: true, // 是否集成 Nodejs
      }})
  
      process.env.NODE_ENV === 'development' ?  authorizeWin.loadURL('http://localhost:3000/#/authorize') : authorizeWin.loadURL(`file://${path.resolve(__dirname, '..')}/index.html#/authorize`)
  
  
      // if (process.platform === 'darwin') {
      //   app.dock.setIcon(path.join(__dirname, '../logo.png'));
      // }
    // 打开开发者工具，默认不打开
    // settingWin.webContents.openDevTools() 
  
    // 关闭window时触发下列事件.
    authorizeWin.on('closed', function () {
      // settingWin = null
    })
  
  
    authorizeWin.on('close', (event) => { 
      authorizeWin.hide();
      authorizeWin.setSkipTaskbar(true)
      event.preventDefault()
    })
  
    ipcMain.on('close-auth-win', ()=> {
      authorizeWin.hide();
      authorizeWin.setSkipTaskbar(true)
    })
  
  
    ipcMain.on('require-mac-screen-capture-permission', ()=> {
      hasScreenCapturePermission();
      app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
      // 申请mac屏幕录取权限
      // openSystemPreferences().then((rt)=>{
      //   console.log(rt)
      // }).catch((e)=>{
      //   console.log(e)
      // })
    })
  
    return authorizeWin
  }
  
  module.exports = crateAuthorizeWin
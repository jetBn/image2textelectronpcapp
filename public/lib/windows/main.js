/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-06-08 14:58:24
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-09 15:38:49
 */ 

const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')

const path = require('path')
let mainWin 
const createMainWin = () => {
     mainWin = new BrowserWindow({
          width: 1080, 
          height: 800, 
          backgroundColor: "#292B35",
          darkTheme:true,
          show:false,
          autoHideMenuBar: true,
          title: '传图识字',
          //icon: path.join(__dirname, favIcon),
          webPreferences: {
            webSecurity: false,
            nodeIntegration: true, // 是否集成 Nodejs
          }})
      
          process.env.NODE_ENV === 'development' ? 
              mainWin.loadURL('http://localhost:3000/')
              :
              mainWin.loadURL(`file://${path.resolve(__dirname, '..')}/index.html`)
  
        //  if (process.platform === 'darwin') {
        //     app.dock.setIcon(path.join(__dirname, '../logo.png'));
        //   }
            
        // 打开开发者工具，默认不打开
        mainWin.webContents.openDevTools() 
      
        // 关闭window时触发下列事件.
        mainWin.on('closed', function () {
          mainWin = null
        })
      
      
        mainWin.on('close', (event) => { 
          mainWin.hide(); 
          mainWin.setSkipTaskbar(true);
          event.preventDefault();
        })
      
      //   mainWindow.on('show', () => {
      //     mainTray.setHighlightMode('always')
      //   })
      //   mainWindow.on('hide', () => {
      //     mainTray.setHighlightMode('never')
      //   })
  
     return mainWin
  }

module.exports = createMainWin
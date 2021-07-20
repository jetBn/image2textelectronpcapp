
 
const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')

const path = require('path')
// const iAP = require('../../utils/MaciAP')

const createSettingWin = () => {
    let settingWin = new BrowserWindow({
      width: 640, 
      height: 504, 
      backgroundColor: "#292B35",
      // backgroundColor: "#0000FF",
      darkTheme:true,
      show:false,
      autoHideMenuBar: true,
      // titleBarStyle: "hidden",
      // icon: path.join(__dirname, favIcon),
      title: '设置',
      webPreferences: {
        javascript: true,
        plugins: true,
        webSecurity: false,
        nodeIntegration: true, // 是否集成 Nodejs
      }})
  
      process.env.NODE_ENV === 'development' ?
      settingWin.loadURL('http://localhost:3000/#/setting')
          :
          settingWin.loadURL(`file://${path.resolve(__dirname, '..')}/index.html#/setting`)
  
  
      // if (process.platform === 'darwin') {
      //   app.dock.setIcon(path.join(__dirname, '../logo.png'));
      // }
        
    // 打开开发者工具，默认不打开
    settingWin.webContents.openDevTools()
  
    // 关闭window时触发下列事件.
    settingWin.on('closed', function () {
      settingWin = null
    })
  
  
    settingWin.on('close', (event) => {
      settingWin.hide();
      settingWin.setSkipTaskbar(true);
      event.preventDefault();
    })
  
    ipcMain.on('is-open-start', () => {
      
    })
  
    ipcMain.on('token', (e, tokenData)=> {
      // token = tokenData
    })
  
    // ipcMain.on('iap-get-products', async (e)=>{
    //   let products = await iAP.getProducts();
    //   e.reply("iap-product-get-success",JSON.stringify(products))
    // })

    // ipcMain.on('iap-product-purchase', async (e,item)=>{
    //   console.log("buy",item)
    //   iAP.productPurchase(item.productIdentifier,1)
    // })


    return settingWin
  }

module.exports =  createSettingWin

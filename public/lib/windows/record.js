/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-06-08 14:36:41
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-09 15:42:52
 */

const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')

const path = require('path')
var createRecordWindow = function() {
    var recordWin = new BrowserWindow({
        width: 1080,
        height: 800,
        backgroundColor: "#292B35",
        darkTheme: true,
        show: false,
        autoHideMenuBar: true,
        title: '识别历史',
        // icon: path.join(__dirname, favIcon),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true, // 是否集成 Nodejs
        }
    })

    process.env.NODE_ENV === 'development' ? recordWin.loadURL('http://localhost:3000/#/record') : recordWin.loadURL(`file://${path.resolve(__dirname, '..')}/index.html#/record`)


    // if (process.platform === 'darwin') {
    //   app.dock.setIcon(path.join(__dirname, '../logo.png'));
    // }

    // 打开开发者工具，默认不打开
    recordWin.webContents.openDevTools()

    // 关闭window时触发下列事件.
    recordWin.on('closed', function () {
        recordWin = null
    })

    recordWin.on('close', (event) => {
        recordWin.hide();
        recordWin.setSkipTaskbar(true);
        event.preventDefault();
    })

    return recordWin
}

module.exports = createRecordWindow
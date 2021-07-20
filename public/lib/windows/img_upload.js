/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-06-08 15:00:14
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-09 15:42:59
 */


const {
    BrowserWindow,
    ipcMain,
    dialog,
    app
} = require('electron')


const mineType = require('mime-types')
const uploadImgDialog = () => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'Images',
            extensions: ['jpg', 'png', 'gif']
        }]
    }, res => {
        if (typeof (res) !== 'undefined') {
            fs.readFile(res[0], function (err, originBuffer) {
                const base64Img = 'data:' + mineType.lookup(res[0]) + ';base64,' + originBuffer.toString('base64');
                mutileWin.webContents.send('capture-img-url', base64Img)
                mutileWin.show()
            })
        }
    })
}

module.exports = uploadImgDialog
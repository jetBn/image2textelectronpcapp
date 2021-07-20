const {
  app,
  Menu,
  Tray,
  ipcMain
} = require('electron')
const {
  useCapture,
  captureSceen
} = require('./lib/capture-main.js')
const path = require('path')

// const electronScreenshot = require('electron-base64-screenshot');
const createRecordWindow = require("./lib/windows/record")
const createSettingWin = require("./lib/windows/setting")
const createMainWin = require("./lib/windows/main")
const uploadImgDialog = require('./lib/windows/img_upload')
const uploadPdfDialog = require('./lib/windows/pdf_upload')
// const createMacResultPopUp = require('./lib/windows/mac_show_result')
// const createMacPermissionRequireWin = require('./lib/windows/mac_permission')

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWin, settingWin, recordWin, macResultPopUp, macPermissionRequireWin;
let mainTray = null

function init() {

  useCapture() //eslint-disable-line
  Menu.setApplicationMenu(null)

  //创建浏览器窗口
  mainWin = createMainWin()
  settingWin = createSettingWin()
  // recordWin = createRecordWindow()

  // macPermissionRequireWin = createMacPermissionRequireWin()
  //  托盘
  if (require('os').platform() === 'win32') {
    mainTray = new Tray(path.join(__dirname, 'win_favicon.ico'));
    mainWin.show()
  } else {
    mainTray = new Tray(path.join(__dirname, 'logo_normal.png'));
    mainTray.setPressedImage(path.join(__dirname, 'logo_pressed.png'))
    // macResultPopUp = createMacResultPopUp(mainTray)
    // macPermissionRequireWin.show()
    settingWin.show()
  }

  const contextMenu = Menu.buildFromTemplate([{
      label: '截图识字',
      click: () => {
        captureSceen()
      }
    },
    {
      label: '批量识别',
      click: () => {
        mainWin.show()
      }
    },
    {
      label: "选择文件",
      submenu: [{
          label: '选择图片',
          click: () => {
            uploadImgDialog()
          }
        },
        {
          label: '选择PDF文件',
          click: () => {
            uploadPdfDialog()
          }
        },
      ]
    },
    {
      label: "更多",
      submenu: [{
          label: '设置',
          click: () => {
            settingWin.show()
          }
        },
        {
          label: '识别历史',
          click: () => {
            recordWin.show()
          }
        },
        {
          label: '退出',
          click: () => {
            //真正的退出（这里直接强制退出）
            require('os').platform() === 'win32' ?
              mainTray.destroy() :
              macResultPopUp.destroy()
            mainWin.destroy()
            settingWin.destroy()
            recordWin.destroy()
            macPermissionRequireWin.destroy()
            app.quit()
          }
        }
      ]
    }
  ])
  mainTray.setToolTip('图片识字')
  mainTray.setContextMenu(contextMenu)
  mainTray.on('click', () => { //模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWin.isVisible() ? mainWin.hide() : mainWin.show()
    mainWin.isVisible() ? mainWin.setSkipTaskbar(false) : mainWin.setSkipTaskbar(true);
  })

  ipcMain.on('capture-screen', (e, {
    type = 'start',
    screenId,
    url,
    cType = 'single'
  } = {}) => {
    if (type === 'complete') {
      if (require('os').platform() === 'win32') {
        mainWin.webContents.send('capture-img-url', url)
        mainWin.isVisible() && mainWin.setSkipTaskbar(false)
        mainWin.show()
      } else {
        if (cType === 'mutile') {
          mainWin.webContents.send('capture-img-url', url)
          mainWin.isVisible() && mainWin.setSkipTaskbar(false)
        } else {
          macResultPopUp.webContents.send('capture-img-url', url)
          macResultPopUp.show()
        }
      }
    }
  })

}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', init)

if (process.platform === 'darwin') {
  app.dock.setIcon(path.join(__dirname, 'logo.png'));
}


// app.on('before-quit', e => {
//   // 只在 win 系统下销毁托盘图标
//   if (process.platform === 'win32') {
//     tray.destroy()
//   }
// })


// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  mainWin.show()
  //  macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  // if (mainWin === null) {
  //   // createWindow()
  // }
})
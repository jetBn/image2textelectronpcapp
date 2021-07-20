/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-06-08 15:07:54
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-08 15:12:14
 */


const {
  BrowserWindow,
  ipcMain,
  dialog,
  app
} = require('electron')

const path = require('path')
const createMacResultPopUp = (MainTray) => {

  const WINDOW_SIZE_DEFAULTS = {
    width: 700,
    height: 414,
    margin: {
      x: 0,
      y: 0
    }
  };
  // const screenBounds = screen.getPrimaryDisplay().size;
  const trayBounds = MainTray.getBounds();
  let x = Math.floor(
    trayBounds.x - WINDOW_SIZE_DEFAULTS.width - WINDOW_SIZE_DEFAULTS.margin.x + trayBounds.width / 2 + WINDOW_SIZE_DEFAULTS.width / 2
  );
  let y = Math.floor(
    trayBounds.y - WINDOW_SIZE_DEFAULTS.height - WINDOW_SIZE_DEFAULTS.margin.y + trayBounds.height / 2
  );
  console.log(x, y)
  var macResultPopUp = new BrowserWindow({
    width: WINDOW_SIZE_DEFAULTS.width,
    height: WINDOW_SIZE_DEFAULTS.height,
    maxWidth: WINDOW_SIZE_DEFAULTS.width,
    maxHeight: WINDOW_SIZE_DEFAULTS.height,
    x: x,
    y: y,
    show: true, // Window will be show when clicked a tray icon
    frame: false, // Tray Windows are not framed usually
    fullscreenable: false,
    resizable: false,
    useContentSize: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true, // 是否集成 Nodejs
    }
  });

  // Disabling Window menu
  macResultPopUp.setMenu(null);


  // macResultPopUp.webContents.openDevTools() 

  process.env.NODE_ENV === 'development' ?
    macResultPopUp.loadURL('http://localhost:3000/#/result') :
    // TrayWindow.loadURL(`file:///${path.join(__dirname, "index.html")}#/tray`);
    macResultPopUp.loadURL(`file://${path.resolve(__dirname, '..')}/index.html#/result`)

  macResultPopUp.hide();

  macResultPopUp.on("blur", () => {
    if (!macResultPopUp) return;
    if (!macResultPopUp.webContents.isDevToolsOpened()) {
      macResultPopUp.hide();
      ipcMain.emit("tray-window-hidden", {
        window: macResultPopUp,
        tray: MainTray
      });
    }
  });

  macResultPopUp.on("close", function (event) {
    if (!macResultPopUp) return;
    event.preventDefault();
    macResultPopUp.hide();
  });

  ipcMain.on('save-file', (e, content) => {
    dialog.showSaveDialog({
      filters: [{
        name: 'text',
        extensions: ['txt'],
      }],
    }, (path) => {
      console.log(path)
      fs.writeFile(path, content, 'utf8', (err) => {
        !err && console.log('保存成功')
      })
    })
  })

  return macResultPopUp
}

module.exports = createMacResultPopUp
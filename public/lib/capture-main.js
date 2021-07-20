const { BrowserWindow, ipcMain, globalShortcut } = require('electron')
const os = require('os')
const path = require('path')

let captureWins = []


const captureScreen = (e, args) => {
    if (captureWins.length) {
        return
    }
    const { screen } = require('electron')

    let displays = screen.getAllDisplays()
    captureWins = displays.map((display) => {
        let captureWin = new BrowserWindow({
            // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
            fullscreen: os.platform() === 'win32' || undefined,
            width: display.bounds.width,
            height: display.bounds.height,
            x: display.bounds.x,
            y: display.bounds.y,
            transparent: true,
            frame: false,
            // skipTaskbar: true,
            // autoHideMenuBar: true,
            movable: false,
            resizable: false,
            enableLargerThanScreen: true,
            hasShadow: false,
            webPreferences: {
                nodeIntegration: true, // 是否集成 Nodejs
            }
        })
        captureWin.setAlwaysOnTop(true, 'screen-saver')
        captureWin.setVisibleOnAllWorkspaces(true)
        captureWin.fullScreenable = false


        captureWin.loadFile(path.join(__dirname, 'capture.html'))
        // captureWin.loadURL('http://localhost:3000/#/capture')
        let { x, y } = screen.getCursorScreenPoint()
        if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
            captureWin.focus()
        } else {
            captureWin.blur()
        }
        // 调试用
        // captureWin.openDevTools()

        ipcMain.on('capture-message', (event, arg) => {
            const {api, ...rest} = arg
            let rtv = null
            switch (api) {
              case 'getCurrentScreen':
                const {x, y} = rest
                const display = screen.getAllDisplays().filter(d => d.bounds.x === x && d.bounds.y === y)[0]
                rtv = display
                break
              case 'isCursorInCurrentWindow':
                const {
                  x: winX, y: winY, width, height
                } = rest
                const { x: ptX, y: ptY } = screen.getCursorScreenPoint()
                rtv = ptX >= winX && ptX <= winX + width && ptY >= winY && ptY <= winY + height
                break
              default:
                break
            }
            event.returnValue = rtv
          })

        captureWin.on('closed', () => {
            let index = captureWins.indexOf(captureWin)
            if (index !== -1) {
                captureWins.splice(index, 1)
            }
            captureWins.forEach(win => win.close())
        })
        return captureWin
    })

}

const useCapture = () => {
    globalShortcut.register('Esc', () => {
        if (captureWins) {
            captureWins.forEach(win => win.close())
            captureWins = []
        }
    })

    globalShortcut.register('CmdOrCtrl+Shift+C', captureScreen)

    ipcMain.on('hotkey-setting', (e, val)  => {
        globalShortcut.register(val, captureScreen)
    })

   

    ipcMain.on('capture-screen', (e, { type = 'start', screenId, url, cType } = {}) => {
        if (type === 'start') {
            console.log('start')
            captureScreen()
        } else if (type === 'complete') {
            // nothing
            // ipcMain.
            // mainWindow.webContents.send('capture-img-url', url)
        } else if (type === 'select') {
            captureWins.forEach(win => win.webContents.send('capture-screen', { type: 'select', screenId }))
        }
    })


    ipcMain.on('capture-screen-hide', () => {
        captureWins.forEach(win => win.hide())
    })

}

exports.useCapture = useCapture
exports.captureSceen = captureScreen

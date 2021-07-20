const { ipcRenderer, remote } = require('electron')

let currentWindow = remote.getCurrentWindow()

module.exports.getCurrentScreen = () => {
  let { x, y } = currentWindow.getBounds()
  const rtv = ipcRenderer.sendSync('capture-message', {api: 'getCurrentScreen', x, y})
  return rtv
}

module.exports.isCursorInCurrentWindow = () => {
  let bound = currentWindow.getBounds()
  const rtv = ipcRenderer.sendSync('capture-message', {api: 'isCursorInCurrentWindow', ...bound})
  return rtv
}
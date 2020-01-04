// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    mainWindow.openDevTools()
    // and load the index.html of the app.
    const url = isDev ? 'http://localhost:3000' : 'zxx'
    mainWindow.loadURL(url)
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', async () => {
    createWindow()
    require('devtron').install()
})











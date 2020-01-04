// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/util/menuTemplate')

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
        // autoHideMenuBar: true
    })
    mainWindow.openDevTools()
    // and load the index.html of the app.
    const url = isDev ? 'http://localhost:3000' : 'zxx'
    mainWindow.loadURL(url)
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

app.on('ready', async () => {
    createWindow()
    require('devtron').install()
})











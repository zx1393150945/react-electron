// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/util/menuTemplate')
const AppWindow = require('./AppWindow')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, settingsWindow

function createWindow () {
    // Create the browser window.
    const url = isDev ? 'http://localhost:3000' : 'zxx'
    mainWindow = new AppWindow({
        width: 1200,
        height: 900,
    }, url)
    mainWindow.openDevTools()
    // and load the index.html of the app.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    ipcMain.on('open-settings', () => {
        settingsWindow = new AppWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            autoHideMenuBar: true
        }, 'http://localhost:3000/settings')
        settingsWindow.on('closed', function () {
            settingsWindow = null
        })
    })

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    ipcMain.on('qiniu-enabled', (event, arg) => {
       let cloudMenu =  menu.items[3];
        [0,1,2].forEach(key => {
           cloudMenu.submenu.items[key].enabled = arg
       })
    })
}

app.on('ready', async () => {
    createWindow()
    require('devtron').install()
})











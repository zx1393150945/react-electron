// Modules to control application life and create native browser window
const {app, Menu, ipcMain, dialog} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const { dirname} = path
const menuTemplate = require('./src/util/menuTemplate')
const AppWindow = require('./AppWindow')
const QiniuHelper = require('./src/util/qiniuHelper')
const Store = require('electron-store')
const store = new Store()


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`
    const getQiniuHelper = () => {
        const {accessKey, secretKey, bucket} = store.get('settings') || {}
        return  new QiniuHelper(accessKey, secretKey, bucket)
    }
    mainWindow = new AppWindow({
        width: 1200,
        height: 900,
    }, url)
    // mainWindow.openDevTools()
    // and load the index.html of the app.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
/*    ipcMain.on('open-settings', () => {
        const settings_url = url.format({
            pathname: path.join(__dirname, './build/index.html/#/settings'),
            hash: 'baz',
            protocol: 'file',
            slashes: true,
        })
        settingsWindow = new AppWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            autoHideMenuBar: true
        }, settings_url)
        settingsWindow.on('closed', function () {
            settingsWindow = null
        })
    })*/

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    ipcMain.on('qiniu-enabled', (event, arg) => {
       let cloudMenu =  menu.items[3];
        [0,1,2].forEach(key => {
           cloudMenu.submenu.items[key].enabled = arg
       })
    })
    ipcMain.on('upload-file', (event, ...arg) => {
        const qiniuHelper = getQiniuHelper()
        qiniuHelper.uploadFile(arg[0], arg[1]).then(data => {
            console.log("上传成功", data)
            mainWindow.webContents.send('upload-success')
        }).catch(err => {
            console.log("上传失败", err)
            dialog.showErrorBox("上传失败", "请检查七牛云配置")
        })
    })
    ipcMain.on('upload-all', (event) => {
        mainWindow.webContents.send("loading", true)
        const files = store.get("files")
        const qiniuHelper = getQiniuHelper()
        const promiseArr = Object.keys(files).map(key => {
            const {title, path} = files[key]
            return  qiniuHelper.uploadFile(`${title}.md`, path)
        })

        Promise.all(promiseArr).then(result => {
            dialog.showMessageBox({
                type: 'info',
                title: '上传成功',
                message: `成功上传了${result.length}个文件`
            })
            mainWindow.webContents.send("upload-all-success", false)
        }).catch(err => {
            console.log("err", err)
            dialog.showErrorBox("上传失败", "请检查七牛云配置")
        }).finally(() => {
            mainWindow.webContents.send("loading", false)
        })
    })
    ipcMain.on('download-file', (event, ...arg) => {
        const qiniuHelper = getQiniuHelper()
        qiniuHelper.getStat(arg[0]).then(data => {
            // console.log("data0", data)
            const serverUpdateTime = Math.round(data.putTime / 10000)
            const updatedAt = arg[2]
            // console.log("===", serverUpdateTime, updatedAt)
            if (serverUpdateTime > updatedAt || !updatedAt) {
                qiniuHelper.downloadFile(arg[0], dirname(arg[1])).then(data => {
                    console.log("下载成功", data)
                    mainWindow.webContents.send('file-downloaded', arg[3])
                }).catch(err => {
                    console.log("下载失败", err)
                    dialog.showErrorBox("下载失败", "请检查七牛云配置")
                })
            }else {
                mainWindow.webContents.send('file-downloaded', arg[3])
            }
        }).catch(err => {
            console.log("文件没有找到", err)
            mainWindow.webContents.send('file-downloaded', arg[3], 'not-found')
            // dialog.showErrorBox("下载失败", "文件不存在")
        })

    })
    ipcMain.on('delete-file', (event, ...arg) => {
        const qiniuHelper = getQiniuHelper()
        qiniuHelper.getStat(arg[0]).then(data => {
            qiniuHelper.deleteFile(arg[0])
        })
    })
}

app.on('ready', async () => {
    createWindow()
    require('devtron').install()
    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.on("error", (err) => {
        dialog.showErrorBox("更新失败", err)
    })
    autoUpdater.on("update-available", () => {
        dialog.showMessageBox({
            type: 'info',
            title: '应用有新的版本',
            message: `发现有新的版本，是否更新`,
            buttons: ["是", "否"]
        }, buttonIndex => {
            if( buttonIndex === 0 ) {
                autoUpdater.downloadUpdate()
            }
        })
    })
    autoUpdater.on("update-not-available", () => {
        dialog.showMessageBox({
            type: 'info',
            title: '没有新的版本',
            message: `当前已经是新的版本`,
        })
    })
})











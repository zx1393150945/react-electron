const {ipcMain} = require('electron')
const Store = require('electron-store')
const store = new Store()
const {accessKey, secretKey, bucket} = store.get('settings')
const autoSync = store.get('autoSync')
const qiniuEnabled = !!accessKey &&  !!secretKey && !!bucket
module.exports = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建',
                accelerator: 'CmdOrCtrl+N',
                click: (menuItem, browserWindow, event) => {
                    browserWindow.webContents.send('create-new-file')
                 }
            },
            {
                label: '保存',
                accelerator: 'CmdOrCtrl+S',
                click: (menuItem, browserWindow, event) => {
                    browserWindow.webContents.send('save-edit-file')
                 }
            },
            {
                label: '搜索',
                accelerator: 'CmdOrCtrl+F',
                click: (menuItem, browserWindow, event) => {
                    browserWindow.webContents.send('search-file')
                 }
            },
            {
                label: '导入',
                accelerator: 'CmdOrCtrl+O',
                click: (menuItem, browserWindow, event) => {
                    browserWindow.webContents.send('import-file')
                 }
            },
            {
                label: '清空列表',
                accelerator: 'Shift+CmdOrCtrl+C',
                click: (menuItem, browserWindow, event) => {
                    // 主进程向渲染进程发送事件
                    browserWindow.webContents.send('clear-file')
                 }
            },
            {
                label: '设置',
                accelerator: 'CmdOrCtrl+,',
                click: (menuItem, browserWindow, event) => {
                    // 主进程向主进程发送事件
                    ipcMain.emit('open-settings')
                 }
            },
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: '重做',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                role: 'reload'
            },
            {
                label: '全屏',
                accelerator: 'F11',
                role: 'togglefullscreen'
            },
            {
                label: '开发者工具',
                accelerator: 'Ctrl+Shift+I',
                role: 'toggledevtools'
            }
        ]
    },
    {
        label: '云同步',
        submenu: [
            {
                label: '自动同步',
                type: 'checkbox',
                enabled: qiniuEnabled,
                checked: autoSync,
                click: (menuItem, browserWindow, event) => {
                    store.set("autoSync", !autoSync)
                }
            },
            {
                label: '全部同步至云端',
                enabled : qiniuEnabled,
                click: (menuItem, browserWindow, event) => {

                }
            },
            {
                label: '从云端下载至本地',
                enabled: qiniuEnabled,
                click: (menuItem, browserWindow, event) => {

                }
            }
        ]
    },
    {
        label: '窗口',
        submenu: [
            {label:'最小化', role: 'minimize' },
            {label:'关闭',role: 'close' }
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: '了解更多',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]
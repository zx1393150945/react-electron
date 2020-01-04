const {app, BrowserWindow} = require('electron')

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
                    browserWindow.webContents.send('clear-file')
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
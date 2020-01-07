const {BrowserWindow} = require('electron')
 class AppWindow extends BrowserWindow{
    constructor(config, urllocation) {
        const basicConfig = {
            window: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            show: false,
            backgroundColor: '#efefef'
        }
        const finalConfig = {...basicConfig, ...config}
        super(finalConfig)
        this.loadURL(urllocation)
        this.once('ready-to-show', () => {
            this.show()
        })
    }
}

module.exports = AppWindow
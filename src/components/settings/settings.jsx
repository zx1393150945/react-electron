import React, {useState} from 'react'
// 这里必须用 bundle ，不能直接用js,会报错
import 'bootstrap/dist/js/bootstrap.bundle.min'
const {remote, ipcRenderer} = window.require('electron')
const Store = window.require('electron-store')
const store = new Store()

export const Settings = () => {
    const settings = store.get('settings') || {}
    console.log("settings", settings)
    const [file, setFile] = useState(settings.saveLocation || '')
    const [accessKey, setAccessKey] = useState(settings.accessKey || '')
    const [secretKey, setSecretKey] = useState(settings.secretKey || '')
    const [bucket, setBucket] = useState(settings.bucket || '')
    const handleOpenDirectory = () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            message: '请选择文件夹'
        }).then(result => {
            const {canceled, filePaths} = result
            if (!canceled) {
                setFile(filePaths[0])
            }
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!file) return
        const oldSettings = store.get('settings')
        store.set("settings", {
            ...oldSettings,
            saveLocation: file
        })
        // remote.getCurrentWindow().close()
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: "设置成功",
            message: '设置存储位置成功',
        })
    }
    const handleSubmit2 = (e) => {
        e.preventDefault()
        const oldSettings = store.get('settings')
        store.set("settings", {
            ...oldSettings,
            accessKey,
            secretKey,
            bucket
        })
        //发送消息给主进程，让原始菜单生效
        const qiniuEnabled = !!accessKey &&  !!secretKey && !!bucket
        ipcRenderer.send("qiniu-enabled", qiniuEnabled)
        // remote.getCurrentWindow().close()
        remote.dialog.showMessageBoxSync({
            type: 'info',
            title: "设置成功",
            message: '设置七牛云成功',
        })
    }
    return (
        <div className={"container-fluid"}>
            <ul className="nav nav-pills"  role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-toggle="tab" aria-controls="location" role="tab" href="#location">存储位置</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="tab"   role="tab" aria-controls="qiniu" href="#qiniu">七牛云</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="location"  role="tabpanel" aria-labelledby="location-tab">
                    <form action="#"  onSubmit={handleSubmit} className={"mt-3 pr-3 pt-3"}>
                        <div className="form-group row ">
                            <label htmlFor="" className="col-3 col-form-label text-right">文件存储位置</label>
                            <div className="col-9 ">
                                <div className="input-group mb-3">
                                    <input type="text" value={file} className="form-control" placeholder="请选择文件" onChange={() => {}}/>
                                    <div className="input-group-append">
                                        <span style={{cursor: 'pointer'}}  onClick={handleOpenDirectory} className="input-group-text" id="basic-addon2">浏览</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            <button type="submit" className="btn btn-primary">保存</button>
                        </div>
                    </form>
                </div>
                <div className="tab-pane fade" id="qiniu" role="tabpanel" aria-labelledby="qiniu-tab">
                    <form action="#"  onSubmit={handleSubmit2} className={"mt-3 pr-3 pt-3"}>
                        <div className="form-group row ">
                            <label htmlFor="" className="col-3 col-form-label text-right">Access Key</label>
                            <div className="col-9 ">
                                    <input type="text" value={accessKey} className="form-control" placeholder="Access Key" onChange={e => {setAccessKey(e.target.value)}}/>
                            </div>
                        </div>
                        <div className="form-group row ">
                            <label htmlFor="" className="col-3 col-form-label text-right">Secret Key</label>
                            <div className="col-9 ">
                                    <input type="text" value={secretKey}  className="form-control" placeholder="Secret Key" onChange={e => {setSecretKey(e.target.value)}}/>
                            </div>
                        </div>
                        <div className="form-group row ">
                            <label htmlFor="" className="col-3 col-form-label text-right">Bucket</label>
                            <div className="col-9 ">
                                    <input type="text" value={bucket}   className="form-control" placeholder="Bucket" onChange={e => {setBucket(e.target.value)}}/>
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            <button type="submit" className="btn btn-primary">保存</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
const {remote} = window.require('electron')
const Store = window.require('electron-store')
const store = new Store()

export const Settings = () => {
    const settings = store.get('settings') || {}
    const [file, setFile] = useState(settings.saveLocation || '')
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
        store.set("settings", {
            saveLocation: file
        })
        remote.getCurrentWindow().close()
    }
    return (
        <div className={"container-fluid"}>
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
    )
}
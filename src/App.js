import React, {useEffect, useState} from 'react';
import './App.less';
import 'bootstrap/dist/css/bootstrap.min.css'
import {FileSearch} from './components/file-search/file-search'
import {FileList} from './components/file-list/file-list'
import {defaultFiles} from './util/default-files'
import {BottomButton} from './components/bottom-btn/bottom-btn'
import {faPlus, faFileImport} from "@fortawesome/free-solid-svg-icons"
import {TabList} from './components/tab-list/tab-list'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import classNames from 'classnames'
import uuidv4 from 'uuid/v4'
import {flattenArr, objToarr, getStoreFiles, formatTime} from './util/helper'
import {fileHelper} from './util/fileHelper'
import useIpcRenderer from './hook/useIpcRenderer'
import {Loader} from './components/loader/loader'
const {join, basename, extname, dirname} = window.require('path')
const {remote, ipcRenderer} = window.require('electron')
const Store = window.require('electron-store');
const store = new Store()
function App({history}) {
    const [files, setFiles] = useState(getStoreFiles() || {})
    const [activeId, setActiveId] = useState('')
    const [openedFileIds, setOpenedFIleIds] = useState([])
    const [unsavedIds, setUnsavedIds] = useState([])
    const [searching, setSearching] = useState(false)
    const [hasNewFile, setHasNewFile] = useState(false)
    const openedFiles = openedFileIds.map(id => files[id])
    const activeFile = activeId === '' ? null : files[activeId]

    const [searchFiles, setSearchFiles] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const settings = store.get('settings') || {}
    const saveLocation = settings.saveLocation || remote.app.getPath('documents')
    const handleChange = value => {
        if (value === files[activeId].body) return
        const newFile = {...files[activeId], body: value }
        setFiles({...files, [activeId]: newFile })
        if (!unsavedIds.includes(activeId)) {
            setUnsavedIds([...unsavedIds, activeId])
        }
    }
    const fileClick =  id => {
        setActiveId(id)
        if(!openedFileIds.includes(id)) {
            setOpenedFIleIds([...openedFileIds, id])
        }
        const activeFile = files[id]
        const {path, title, isLoaded, updatedAt} = activeFile
        if (!isLoaded) {
            if(getAutoSync()) {
                ipcRenderer.send('download-file', `${title}.md`, path, updatedAt, id)
            }else {
                const path = files[id].path
                fileHelper.readFile(path).then(data => {
                    const newFile = {...files[id], body: data, isLoaded: true}
                    const newFiles = {...files, [id] : newFile }
                    setFiles(newFiles)
                    saveFilesToStore(newFiles)
                }).catch(err => {
                    console.log("读取文件出错...")
                })
            }

        } else {

        }

    }
    const leftClass = classNames({
        "col-3": true,
        "left-panel": true,
        hasShadow: !!activeFile
    })
    const tabClick = (id) => {
        setActiveId(id)
    }

    const tabClose = (id) => {
        let  ids = [...openedFileIds]
        const newIds = ids.filter(_id => _id !== id  )
        setOpenedFIleIds(newIds)
        if (activeId === id) {
            if(newIds.length > 0) {
                setActiveId(newIds[ids.length-1])
            } else {
                setActiveId('')
            }
        }
    }
    const deleteFile = id => {
        const currentFile = files[id]
        if(currentFile.isNew) {
            const newFiles = {...files}
            delete newFiles[id]
            // 或者
            //  const {[id] : value, ...afterDelete} = files
            //  setFiles(afterDelete)
            setFiles(newFiles)
            setHasNewFile(false)
            return
        }
        const {title} = currentFile
        fileHelper.deleteFile(join(saveLocation, `${title}.md`)).then(() => {
            delete files[id]
            store.set("files", files)
            setFiles(files)
            tabClose(id)
            ipcRenderer.send('delete-file', `${title}.md`)
        })
    }

    const updateFileName = (id, title, isNew) => {
        const newPath = isNew ? join(saveLocation, `${title}.md`) : join(dirname(files[id].path), `${title}.md`)
        const oldFile = Object.values(files).find(file => file.path === newPath)
        if (oldFile) {
            remote.dialog.showMessageBox({
                type: 'info',
                title: '文件已存在',
                message: `已存在相同路径下的文件名`,
            })
            return
        }
        const newFile = {...files[id], title: title, isNew: false, path: newPath }
        const newFiles = {...files, [id]: newFile }
        if (isNew) {
            fileHelper.writeFile(newPath, files[id].body).then(() => {
                setFiles(newFiles)
                saveFilesToStore(newFiles)
                setHasNewFile(false)
            })
        } else {
            fileHelper.renameFile(files[id].path,newPath).then(() => {
                setFiles(newFiles)
                saveFilesToStore(newFiles)
            })
        }
    }

    const fileSearch = keyword => {
        const newFiles = objToarr(files).filter(file => file.title.includes(keyword))
        setSearchFiles(newFiles)
    }
    const createNewFile = () => {
        console.log("hasNewFile", hasNewFile)
        if (hasNewFile) return
        const id = uuidv4()
        const newFile = {id, title: '', body: '## 请输出markdown', createAt: new Date().getTime(), isNew: true}
        const newFiles = {
            ...files,
            [id]: newFile
        }
        setFiles(newFiles)
        setHasNewFile(true)
    }
    const saveCurrentFile = () => {
        fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
            const newFiles = {
                ...files,
                [activeId]: activeFile
            }
            setFiles(newFiles)
            setUnsavedIds(unsavedIds.filter(id => id !== activeId))
            uploadCloud()

        })
    }

    const getAutoSync = () => {
        const {accessKey, secretKey, bucket} = store.get('settings') || {}
        const autoSync = store.get('autoSync')
        return  !!accessKey && !!secretKey && !!bucket && !!autoSync
    }

    const uploadCloud = () => {
        const needUpload = getAutoSync()
        if (needUpload) {
            const {title, path} = activeFile
            ipcRenderer.send('upload-file', `${title}.md`, path)
        }
    }
    const saveFilesToStore = files => {
        const fileStoreObj = objToarr(files).reduce((pre, file) => {
            const {id , title, createAt, path, isSynced, updatedAt} = file
            pre[id] = {id, title, createAt, path, isSynced, updatedAt}
            return pre
        },{})
        store.set("files", fileStoreObj)
    }


    const clearFiles = () => {
        store.delete("files")
        setFiles({})
        setOpenedFIleIds([])
    }
    const importFile = () => {
        remote.dialog.showOpenDialog({
            title:'请选择文件',
            properties: ['openFile','multiSelections'],
            filters: [
                { name: 'Markdown Files', extensions: ['md'] },
            ],
            buttonLabel: 'OK'
        }).then( sfiles => {
            if (!sfiles.canceled) {
                // 过滤掉已经存在的文件
                const filterPaths =  sfiles.filePaths.filter(path => {
                    const isAlreadyAdded = Object.values(files).find(file => file.path === path)
                    return !isAlreadyAdded
                })
                // 将数组转换成对象数组
                const fileObjArr = filterPaths.map(path => ({
                    id: uuidv4(),
                    path,
                    title: basename(path, extname(path)),
                }))
                // 转换成对象
                const fileObjs = flattenArr(fileObjArr)
                //添加到store
                // 将对象添加到files
                const newFiles ={...files, ...fileObjs}
                setFiles(newFiles)
                store.set("files", newFiles)
                if (fileObjArr.length > 0) {
                    remote.dialog.showMessageBox({
                        type: 'info',
                        title: "导入成功",
                        message: `成功导入${fileObjArr.length}个文件`,
                    })
                }
            }
        })
    }
    const uploadSuccess = () => {
        const {id} = activeFile
        const newFile = {...files[id], isSynced: true, updatedAt: new Date().getTime()}
        const newfiles = {...files, [id]: newFile}
        setFiles(newfiles)
        saveFilesToStore(newfiles)
    }
    const fileDownloaded = (event, id, msg) => {
        console.log("file-downloaded", id)
        fileHelper.readFile(files[id].path).then((data) => {
            let newFile
            if (msg === 'not-found') {
                 newFile = {...files[id], body: data, isLoaded: true}
            } else {
                 newFile = {...files[id], body: data, isLoaded: true, isSynced: true, updatedAt: new Date().getTime()}
            }
            const newFiles = {...files, [id] : newFile }
            setFiles(newFiles)
            saveFilesToStore(newFiles)
        })

    }
    const loading = (event, status) => {
        setShowLoader(status)
    }
    const uploadAllSuccess = () => {
        const newFiles = objToarr(files).reduce((pre, file) => {
            pre[file.id] = {...file, isSynced: true, updatedAt: new Date().getTime()}
            return pre
        }, {})
        setFiles(newFiles)
        saveFilesToStore(newFiles)
    }
    const openSettings = () => {
        history.replace('/settings')
    }
    useIpcRenderer({
        'create-new-file': createNewFile,
        'import-file': importFile,
        'save-edit-file': saveCurrentFile,
        'clear-file': clearFiles,
        'upload-success': uploadSuccess,
        'file-downloaded': fileDownloaded,
        'loading': loading,
        'upload-all-success': uploadAllSuccess,
        'open-settings': openSettings
    })
    const fileArr = searching ?  searchFiles : objToarr(files)
    return (
        <div className="App container-fluid px-0">
           {showLoader && <Loader/>}
            <div className={"row main no-gutters"}>
                <div className={leftClass}>
                    <FileSearch title={"我的云文档"} onFileSearch={fileSearch}  setSearching={setSearching}/>
                    <FileList files={fileArr} onFileClick={fileClick} onFileDelete={deleteFile} onSaveEdit={updateFileName} setHasNewFile={setHasNewFile} />
                    <div className={"row no-gutters button-group"}>
                        <div className={"col"}>
                            <BottomButton icon={faPlus} onClick={createNewFile} colorClass={"btn-primary"} text={"新建"}/>
                        </div>
                        <div className={"col"}>
                            <BottomButton icon={faFileImport} onClick={importFile} colorClass={"btn-success"} text={"导入"}/>
                        </div>
                    </div>

                </div>
                <div className={"col-9 right-panel"} >
                    {
                        activeFile ? (
                            <>
                                <TabList files={openedFiles}  activeId={activeId} unsavedIds={unsavedIds} onTabClick={tabClick} onCloseTab={tabClose}/>
                                <SimpleMDE onChange={handleChange} value={activeFile.body}
                                           key={activeFile.id}
                                           options={{
                                               autofocus: true,
                                               minHeight: '690px'
                                           }}/>
                                {activeFile.isSynced && (
                                    <span className={'sync-status'}>已同步，上次同步时间 {formatTime(activeFile.updatedAt)}</span>
                                )}
                            </>
                        ) : (
                            <div className={"start-page"}>
                                选择或创建新的文档
                            </div>
                        )
                    }


                </div>
            </div>
        </div>
    )
}

export default App




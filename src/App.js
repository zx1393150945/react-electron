import React, {useEffect, useState} from 'react';
import './App.less';
import 'bootstrap/dist/css/bootstrap.min.css'
import {FileSearch} from './components/file-search/file-search'
import {FileList} from './components/file-list/file-list'
import {defaultFiles} from './util/default-files'
import {BottomButton} from './components/bottom-btn/bottom-btn'
import {faPlus, faFileImport, faSave} from "@fortawesome/free-solid-svg-icons"
import {TabList} from './components/tab-list/tab-list'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import classNames from 'classnames'
import uuidv4 from 'uuid/v4'
import {flattenArr, objToarr, getStoreFiles} from './util/helper'
import {fileHelper} from './util/fileHelper'
import useIpcRenderer from './hook/useIpcRenderer'
const {join, basename, extname, dirname} = window.require('path')
const {remote, ipcRenderer} = window.require('electron')
const Store = window.require('electron-store');
const store = new Store()
function App() {
    const [files, setFiles] = useState(getStoreFiles() || {})
    const [activeId, setActiveId] = useState('')
    const [openedFileIds, setOpenedFIleIds] = useState([])
    const [unsavedIds, setUnsavedIds] = useState([])
    const openedFiles = openedFileIds.map(id => files[id])
    const activeFile = activeId === '' ? null : files[activeId]

    const [searchFiles, setSearchFiles] = useState([])
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
        if (!activeFile.isLoaded) {
            fileHelper.readFile(files[id].path).then((data) => {
                const newFile = {...files[id], body: data, isLoaded: true}
                setFiles({...files, [id] : newFile })
            })
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
        ids.splice(openedFileIds.indexOf(id),1)
        setOpenedFIleIds(ids)
        if (activeId === id) {
            if(ids.length > 0) {
                setActiveId(ids[ids.length-1])
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
            return
        }
        fileHelper.deleteFile(join(saveLocation, `${currentFile.title}.md`)).then(() => {
            delete files[id]
            store.set("files", files)
            setFiles(files)
            tabClose(id)
        })
    }

    const updateFileName = (id, title, isNew) => {
        const newPath = isNew ? join(saveLocation, `${title}.md`) : join(dirname(files[id].path), `${title}.md`)
        const newFile = {...files[id], title: title, isNew: false, path: newPath }
        const newFiles = {...files, [id]: newFile }
        if (isNew) {
            fileHelper.writeFile(newPath, files[id].body).then(() => {
                setFiles(newFiles)
                saveFilesToStore(newFiles)
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
        const id = uuidv4()
        const newFile = {id, title: '', body: '## 请输出markdown', createAt: new Date().getTime(), isNew: true}
        const newFiles = {
            ...files,
            [id]: newFile
        }
        setFiles(newFiles)
    }
    const saveCurrentFile = () => {
        fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
            const newFiles = {
                ...files,
                [activeId]: activeFile
            }
            setFiles(newFiles)
            setUnsavedIds(unsavedIds.filter(id => id !== activeId))
        })
    }
    const saveFilesToStore = files => {
        const fileStoreObj = objToarr(files).reduce((pre, file) => {
            const {id , title, createAt, path} = file
            pre[id] = {id, title, createAt, path}
            return pre
        },{})
        store.set("files", fileStoreObj)
    }


    const clearFiles = () => {
        store.clear()
        setFiles({})
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
    useIpcRenderer({
        'create-new-file': createNewFile,
        'import-file': importFile,
        'save-edit-file': saveCurrentFile,
        'clear-file': clearFiles
    })
    const fileArr = (searchFiles.length > 0) ?  searchFiles : objToarr(files)
  return (
    <div className="App container-fluid px-0">
      <div className={"row main no-gutters"}>
         <div className={leftClass}>
             <FileSearch title={"我的云文档"} onFileSearch={fileSearch}/>
             <FileList files={fileArr} onFileClick={fileClick} onFileDelete={deleteFile} onSaveEdit={updateFileName}/>
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
                         <SimpleMDE onChange={handleChange} value={activeFile ? activeFile.body : null}
                             key={activeFile.id}
                             options={{
                             autofocus: true,
                             minHeight: '690px'
                         }}/>
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

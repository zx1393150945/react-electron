import React, {useState} from 'react';
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
import {flattenArr, objToarr} from './util/helper'

function App() {
    const [files, setFiles] = useState(flattenArr(defaultFiles))
    const [activeId, setActiveId] = useState('')
    const [openedFileIds, setOpenedFIleIds] = useState([])
    const [unsavedIds, setUnsavedIds] = useState([])
    const openedFiles = openedFileIds.map(id => files[id])
    const activeFile = files[activeId]
    const fileList = objToarr(files)
    const [searchFiles, setSearchFiles] = useState([])
    const handleChange = value => {
        const newFile = {...files[activeId], body: value }
        setFiles({...files, [activeId]: newFile })
        if (!unsavedIds.includes(activeId)) {
            setUnsavedIds([...unsavedIds, activeId])
        }
    }
    const fileClick = id => {
        setActiveId(id)
        if(!openedFileIds.includes(id)) {
            setOpenedFIleIds([...openedFileIds, id])
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
        delete files[id]
        setFiles(files)
        tabClose(id)
    }

    const updateFileName = (id, title) => {
        const newFile = {...files[id], title: title, isNew: false }
        setFiles({...files, [id]: newFile })
    }

    const fileSearch = keyword => {
        const newFiles = fileList.filter(file => file.title.includes(keyword))
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
    const fileArr = (searchFiles.length > 0) ?  searchFiles : fileList
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
                     <BottomButton icon={faFileImport} colorClass={"btn-success"} text={"导入"}/>
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

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

function App() {
    const [files, setFiles] = useState(defaultFiles)
    const [activeId, setActiveId] = useState('')
    const [openedFileIds, setOpenedFIleIds] = useState([])
    const [unsavedIds, setUnsavedIds] = useState([])
    const openedFiles = openedFileIds.map(id => files.find(file => file.id === id))
    const activeFile = files.find(file => file.id === activeId)
    const [searchFiles, setSearchFiles] = useState([])
    const handleChange = value => {
        const newFiles = files.map(file => {
            if (file.id === activeId ) file.body = value
            return file
        })
        setFiles(newFiles)
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
       const newFiles = files.filter(file => file.id !== id)
        setFiles(newFiles)
        tabClose(id)
    }

    const updateFileName = (id, title) => {
        const newFiles = files.map(file => {
            if ( file.id === id) {
                file.title = title
                file.isNew = false
            }
            return file
        })
        setFiles(newFiles)
    }

    const fileSearch = keyword => {
        const newFiles = files.filter(file => file.title.includes(keyword))
        setSearchFiles(newFiles)
    }
    const createNewFile = () => {
        const id = uuidv4()
        const newFiles = [
            ...files,
            {id, title: '', body: '## 请输出markdown', createAt: new Date().getTime(), isNew: true}
        ]
        setFiles(newFiles)
    }
    const fileArr = (searchFiles.length > 0) ?  searchFiles : files
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

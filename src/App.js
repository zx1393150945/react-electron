import React from 'react';
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

function App() {

    const handleChange = value => {
        console.log(value)
    }
  return (
    <div className="App container-fluid px-0">
      <div className={"row main no-gutters"}>
         <div className={"col-3  left-panel"}>
             <FileSearch title={"我的云文档"} onFileSearch={value => {console.log(value)}}/>
             <FileList files={defaultFiles} onFileClick={() => {}} onFileDelete={() => {}} onSaveEdit={(id, value) => {console.log(id, value)}}/>
             <div className={"row no-gutters"}>
                 <div className={"col"}>
                     <BottomButton icon={faPlus} colorClass={"btn-primary"} text={"新建"}/>
                 </div>
                 <div className={"col"}>
                     <BottomButton icon={faFileImport} colorClass={"btn-success"} text={"导入"}/>
                 </div>
             </div>

         </div>
         <div className={"col-9  right-panel"} >
             <TabList files={defaultFiles}  activeId={"1"} unsavedIds={['1']} onTabClick={(id) => {console.log(id)}} onCloseTab={id => {console.log("closing:"+ id)}}/>
             <SimpleMDE onChange={handleChange} value={defaultFiles[0].body}
                        options={{
                            autofocus: true,
                            minHeight: '690px'
                        }}/>
         </div>
      </div>
    </div>
  )
}

export default App

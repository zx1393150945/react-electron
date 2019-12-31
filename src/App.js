import React from 'react';
import './App.less';
import 'bootstrap/dist/css/bootstrap.min.css'

import {FileSearch} from './components/file-search/file-search'
import {FileList} from './components/file-list/file-list'
import {defaultFiles} from './util/default-files'

function App() {
  return (
    <div className="App container-fluid">
      <div className={"row main"}>
         <div className={"col-3 bg-danger left-panel"}>
             <FileSearch title={"我的云文档"} onFileSearch={value => {console.log(value)}}/>
             <FileList files={defaultFiles} onFileClick={() => {}} onFileDelete={() => {}} onSaveEdit={(id, value) => {console.log(id, value)}}/>
         </div>
         <div className={"col-9 bg-success right-panel"} >222</div>
      </div>
    </div>
  )
}

export default App

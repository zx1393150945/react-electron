import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import {FileSearch} from './components/file-search/file-search'

function App() {
  return (
    <div className="App container-fluid">
      <div className={"row"}>
         <div className={"col-3 bg-danger left-panel"}>
             <FileSearch title={"我的云文档"} onFileSearch={value => {console.log(value)}}/>
         </div>
         <div className={"col-9 bg-success right-panel"}>222</div>
      </div>
    </div>
  );
}

export default App

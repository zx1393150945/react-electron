import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons'
import { faMarkdown} from '@fortawesome/free-brands-svg-icons'
import './file-lisr.less'

export  const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('')
    const input = useRef(null)
    const closeSearch = () => {
        const file = files.find(file => file.id === editStatus)
        if(file.isNew) {
            onFileDelete(file.id)
        }
        setEditStatus(false)
        setValue('')
    }
    useEffect(() => {
        const handleInputEvent = e => {
            const {keyCode} = e
            if (keyCode === 13 && editStatus && value.trim() !== '') {
                onSaveEdit(editStatus, value)
                closeSearch()
            } else if (keyCode === 27 && editStatus){
                closeSearch(e)
            }
        }
        document.addEventListener("keyup", handleInputEvent)
        return () => {
            document.removeEventListener("keyup", handleInputEvent)
        }
    })
    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        if(newFile) {
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [files])
    useEffect(() => {
        if (editStatus) {
            input.current.focus()
        }
    }, [editStatus])
    return (
        <ul className={"list-group list-group-flush file-list"}>
            {
                files.map(file =>
                    {
                       return (file.id !== editStatus && !file.isNew) ? (
                        <li className={"list-group-item bg-light  file-item"} key={file.id}>
                            <div className={"row"}>
                            <span className={"col-2"}>
                                <FontAwesomeIcon icon={faMarkdown} title={"markdown"} size={"lg"} />
                            </span>
                            <span className={"col-6 c-link"} onClick={() => {onFileClick(file.id)}}>{file.title}</span>
                            <div className={"col-2"}>
                                <button type={"button"} className={"icon-button"}
                                onClick={
                                        () => {
                                            setEditStatus(file.id);
                                            setValue(file.title)
                                        }
                                    }
                                >
                                    <FontAwesomeIcon icon={faEdit} title={"编辑"} size={"lg"}/>
                                </button>
                            </div>
                            <div className={"col-2"}>
                                <button type={"button"}
                                className={"icon-button"}
                                onClick={() => {
                                     onFileDelete(file.id)
                                 }}
                                >
                                    <FontAwesomeIcon icon={faTrash} title={"删除"} size={"lg"}/>
                                </button>
                            </div>
                            </div>
                        </li>
                        ) : (
                           <li className={"list-group-item bg-light d-flex align-items-center file-item"} key={file.id}>
                               <div className={"row"}>
                                   <input  ref={input} type="text" placeholder={"请输入文件名称"} className={"form-control col-10"} value={value}  onChange={ e => setValue(e.target.value) }/>
                                   <button type={"button"}
                                           className={"icon-button col-2"}
                                           onClick={closeSearch}
                                   >
                                       <FontAwesomeIcon icon={faTimes} title={"关闭"} size={"lg"}/>
                                   </button>
                               </div>
                           </li>
                       )
                    }
                )
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func
}
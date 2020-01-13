import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import useIpcRenderer from '../../hook/useIpcRenderer'
import './file-search.less'

export const FileSearch = ({title, onFileSearch, setSearching}) => {
    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')
    const input = useRef(null)
    // console.log("keyPress", keyPress)
    const closeSearch = () => {
        setInputActive(false)
        setValue('')
        setSearching(false)
    }
    const handleChange = e => {
        const newValue = e.target.value
        setValue(newValue)
        onFileSearch(newValue)
        setSearching(true)
    }
    useEffect(() => {
       if (inputActive) {
           input.current.focus()
       }
    }, [inputActive])
    // A && B  返回值 如果A是false,返回A 否则返回 B , 也就是哪个是假返回哪个
    //   <> </> 在页面上是不会有什么节点的
    const searchFile = () => {
        setInputActive(true)
    }
    useIpcRenderer({
        'search-file': searchFile
    })
    return (
        <div className={"alert alert-primary d-flex justify-content-between align-items-center mb-0"}>
            {!inputActive &&
                <>
                 <span>{title}</span>
                  <button type={"button"}
                          className={"icon-button"}
                          onClick={searchFile}
                  >
                      <FontAwesomeIcon icon={faSearch} title={"搜索"} size={"lg"}/>
                  </button>
                </>
            }
            {
                inputActive &&
                <>
                    <input ref={input} style={{height:'25px'}} type="text" className={"form-control"} value={value} id="" onChange={handleChange}/>
                    <button type={"button"}
                            className={"icon-button"}
                            onClick={closeSearch}
                    >
                        <FontAwesomeIcon icon={faTimes} title={"关闭"} size={"lg"}/>
                    </button>
                </>
            }
        </div>
    )
}
FileSearch.propTypes = {
  title: PropTypes.string.isRequired,
  onFileSearch: PropTypes.func.isRequired
}
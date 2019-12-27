import React, {useState, useEffect, useRef} from 'react'

export const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')
    const input = useRef(null)

    const closeSearch = e => {
        e.preventDefault()
        setInputActive(false)
        setValue('')
    }
    useEffect(() => {
        const handleInputEvent = e => {
            const {keyCode} = e
            if (keyCode === 13 && inputActive) {
                onFileSearch(value)
            } else if (keyCode === 27 && inputActive){
                closeSearch(e)
            }
        }
        document.addEventListener("keyup", handleInputEvent)
        return () => {
            document.removeEventListener("keyup", handleInputEvent)
        }
    })

    useEffect(() => {
       if (inputActive) {
           input.current.focus()
       }
    }, [inputActive])
    // A && B  返回值 如果A是false,返回A 否则返回 B , 也就是哪个是假返回哪个
    return (
        <div className={"alert alert-primary"}>
            {!inputActive &&
              <div className={"d-flex justify-content-between align-items-center"}>
                 <span>{title}</span>
                  <button type={"button"}
                          className={"btn btn-primary"}
                          onClick={() => setInputActive(true)}
                  >搜索</button>
              </div>
            }
            {
                inputActive &&
                <div className={"row"}>
                    <input ref={input} type="text" className={"form-control col-8"} value={value} id="" onChange={ e => setValue(e.target.value) }/>
                    <button type={"button"}
                            className={"btn btn-primary col-4"}
                            onClick={closeSearch}
                    >关闭</button>
                </div>
            }
        </div>
    )
}

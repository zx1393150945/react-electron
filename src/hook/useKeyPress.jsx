import  {useState, useEffect} from 'react'

export const useKeyPress = () => {
   const [keyPressed, setKeyPressed] = useState('')
    const keyUpHandler = ({keyCode}) => {
       if (keyCode === 13) {
           setKeyPressed("enter")
       } else if (keyCode === 27) {
           setKeyPressed("esc")
       }else {
           setKeyPressed(keyCode)
       }
    }
    useEffect(() => {
        document.addEventListener("keyup", keyUpHandler)
        return () => {
            document.removeEventListener("keyup", keyUpHandler)
        }
    },[])
   return keyPressed
 }

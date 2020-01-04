import  {useEffect, useRef} from 'react'
const {remote} = window.require('electron')
const {Menu, MenuItem} = remote
export const useContextMenu = (itemArr, selector, deps) => {
    let clickElement = useRef(null)
    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handleContextMenu = e => {
            clickElement.current = e.target
            // 只有当触发元素是selelctor的子元素时候，才触发
            if(document.querySelector(selector).contains(e.target)) {
                menu.popup({window: remote.getCurrentWindow()})
            }
        }
        window.addEventListener("contextmenu",handleContextMenu)
        return () => {
            window.removeEventListener("contextmenu",handleContextMenu)
        }
    }, deps)

    return clickElement
}
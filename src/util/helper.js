import {fileHelper} from "./fileHelper";

const Store = window.require('electron-store');
const store = new Store()

export const flattenArr = arr => {
    return arr.reduce((pre, item) => {
        pre[item.id] = item
        return pre
    }, {})
}
export const objToarr = obj => {
    return Object.keys(obj).map(key => obj[key])
}
export const getParentNode = (node, parentClassName) => {
    let current = node
    while (current !== null) {
        if (current.classList.contains(parentClassName)) {
            return current
        }
        current = current.parentNode
    }
    return  false
}
export const getStoreFiles = () => {
    const storeFiles = store.get("files")
    if (storeFiles) {
        const newStoreFiles = Object.keys(storeFiles).reduce((pre, key) => {
            const path = storeFiles[key].path
            const exist = fileHelper.checkFile(path)
            if(exist) {
                pre[key] = storeFiles[key]
            }            return pre

        }, {})
        store.set("files", newStoreFiles)
        return newStoreFiles
    }
    return storeFiles
}

export const formatTime = (time) => {
  const date = new Date(time)
    return date.toLocaleDateString() + ' '+ date.toLocaleTimeString()
}
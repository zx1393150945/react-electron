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
export const flattenArr = arr => {
    return arr.reduce((pre, item) => {
        pre[item.id] = item
        return pre
    }, {})
}
export const objToarr = obj => {
    return Object.keys(obj).map(key => obj[key])
}
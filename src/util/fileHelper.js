const fs = window.require("fs").promises
const  fs2 = window.require("fs")
const path = window.require("path");
export const fileHelper = {
    readFile (path) {
        return fs.readFile(path, {encoding: 'utf-8'})
    },
    writeFile (path, content) {
       return fs.writeFile(path, content, {encoding: 'utf-8'})
    },
    renameFile (path, newPath) {
        return fs.rename(path, newPath)
    },
    deleteFile (path) {
       return fs.unlink(path)
    },
    checkFile (path) {
        return fs2.existsSync(path)
    }
}

/*
const testPath = path.join(__dirname, "helper.js")
const testPath2 = path.join(__dirname, "hello.txt")
const testPath3 = path.join(__dirname, "hello2.txt")
const testPath4 = path.join(__dirname, "hello3.txt")
fileHelper.readFile(testPath).then(data => {
    console.log(data)
})
fileHelper.writeFile(testPath2, "中国，你好").then (() => {
    console.log("写入成功")
})
fileHelper.renameFile(testPath2, testPath3)

fileHelper.deleteFile(testPath4)*/

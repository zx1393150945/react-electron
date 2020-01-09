const QiniuHelper = require('./src/util/qiniuHelper')
// 上传凭证
var accessKey = 'IMqposS-uOf2aAkR5JXp_iIEIpgD7_FrrHhTX3SQ'
var secretKey = 'Oaxt5qTMCJcp-9yNfi-M5HWynYOzh62AVvUidR1U'
var bucket = 'zx-test-2020'
var localFile = "D:\\Documents\\nnn.md";
// 上传之后的文件名
var key='nnn.md'
const qiniuHelper = new QiniuHelper(accessKey, secretKey, bucket)

/*qiniuHelper.downloadFile('nnn.md', 'D:\\Documents').catch(err=> {
    console.log(err)
})*/
 qiniuHelper.uploadFile(key, localFile).then(data => {
     console.log("data", data)
 }).catch(err => {
     console.log("err", err)
 })

/*async function f() {
    const result = await qiniuHelper.uploadFile(key, localFile)
    console.log("result", result)
}
f()*/
// qiniuHelper.deleteFile(key)

/*qiniuHelper.getBucketDomain().then(data => {
    console.log("url: ", data)
})*/


/*async function getlink(){
    const url1 = await qiniuHelper.generateDownloadLink(key)
    const url2 = await qiniuHelper.generateDownloadLink(key)
    console.log("url1", url1)
    console.log("url2", url2)
}
getlink()*/

// 下载文件
/*
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://q3pxqffhr.bkt.clouddn.com';
// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(publicDownloadUrl);*/

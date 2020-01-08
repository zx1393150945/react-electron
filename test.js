const qiniu = require('qiniu')
// 上传凭证
var accessKey = 'IMqposS-uOf2aAkR5JXp_iIEIpgD7_FrrHhTX3SQ'
var secretKey = 'Oaxt5qTMCJcp-9yNfi-M5HWynYOzh62AVvUidR1U'
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

var options = {
    // zx-test-2020 是对象存储的空间名
    scope: 'zx-test-2020',
};
var putPolicy = new qiniu.rs.PutPolicy(options)
var uploadToken=putPolicy.uploadToken(mac)

// 构建配置类
var config = new qiniu.conf.Config()
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0

var localFile = "C:\\Users\\Administrator\\Desktop\\hhh.md";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
// 上传之后的文件名
var key='zx.md';
// 文件上传
/*
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
                                                                     respBody, respInfo) {
    if (respErr) {
        throw respErr;
    }
    if (respInfo.statusCode == 200) {
        console.log(respBody);
    } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
    }
});*/

// 下载文件
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://q3pxqffhr.bkt.clouddn.com';
// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(publicDownloadUrl);
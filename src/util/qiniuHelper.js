const qiniu = require('qiniu')
const axios =require('axios')
const fs =require('fs')

class QiniuHelper {
    constructor(accessKey, secretKey, bucket) {
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        this.bucket = bucket
        // 构建配置类
        this.config = new qiniu.conf.Config()
        // 空间对应的机房
        this.config.zone = qiniu.zone.Zone_z0
        this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    }

    uploadFile(key, localFile) {
        var options = {
            // zx-test-2020 是对象存储的空间名  ":"+key 表示上传的时候同名覆盖,
            scope: this.bucket+":"+key,
        }
        var putPolicy = new qiniu.rs.PutPolicy(options)
        var uploadToken=putPolicy.uploadToken(this.mac)
        var formUploader = new qiniu.form_up.FormUploader(this.config)
        var putExtra = new qiniu.form_up.PutExtra();
        return new Promise((resolve, reject) => {
            // 文件上传
            formUploader.putFile(uploadToken, key, localFile, putExtra, this.handleCallBack(resolve, reject))
        })

    }

    deleteFile(key) {
        return new Promise((resolve, reject) => {
            this.bucketManager.delete(this.bucket, key, this.handleCallBack(resolve, reject))
        })
    }

    handleCallBack(resolve, reject) {
        return (respErr, respBody, respInfo) => {
            if (respErr) {
                throw respErr
            }
            const {statusCode} = respInfo
            if (statusCode === 200) {
                resolve(respBody);
            } else {
                reject({
                    statusCode,
                    respBody
                })
            }
        }

    }
    getStat(key) {
        return new Promise((resolve, reject) => {
            this.bucketManager.stat(this.bucket, key, this.handleCallBack(resolve, reject));
        })

    }
     async downloadFile(key, saveLocation) {
        const url =  await this.generateDownloadLink(key)
        const timestamp = new Date().getTime()
        const reqUrl =`${url}?timestamp=${timestamp}`
         return axios({
             url: reqUrl,
             method: 'GET',
             responseType: 'stream',
             headers:{'Cache-Control': 'no-cache'}
         }).then(function (response) {
             const writer = fs.createWriteStream(`${saveLocation}\\${key}`)
             response.data.pipe(writer)
             return new Promise((resolve, reject) =>{
                 writer.on('finish', resolve)
                 writer.on('error', reject)
             })
         }).catch(err => {
             return Promise.reject({err: err.response})
         })
     }
     async generateDownloadLink(key) {
      if (this.publicBucketDomain)  return this.publicBucketDomain
        const data =  await this.getBucketDomain()
         if (Array.isArray(data) && data.length > 0) {
             const pattern = /^https?/
             const baseUrl = pattern.test(data[0]) ? data[0] : `http://${data[0]}`
             this.publicBucketDomain = this.bucketManager.publicDownloadUrl(baseUrl, key)
             return  this.publicBucketDomain
         } else {
             throw Error('域名未找到，请查看存储空间是否已过期')
         }
    }
    getBucketDomain () {
        const requestUrl = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
        const digest = qiniu.util.generateAccessToken(this.mac, requestUrl)
        return new Promise((resolve, reject) => {
            qiniu.rpc.postWithoutForm(requestUrl, digest, this.handleCallBack(resolve, reject))
        })
    }

}

module.exports = QiniuHelper
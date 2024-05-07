
import uploadForOSS from "./oss-uploader/upload.js";
import config from "./config.mjs";
import axios from "axios";

const { getStsApi, noEmptyFile } = config
const args = process.argv.slice(2)
const pwd = args[1]||'./'

const getsts = ()=>new Promise((resolve, reject) => {
  axios.get(getStsApi).then(res=>{
    if (res.data.code == 10200) {
      resolve(res.data)
    }else{
      reject(res)  
    }
  }).catch(rej=>{
    reject(rej)
  })
})

noEmptyFile(pwd).then(async (res)=>{
  if (res) {
    try {
      const {data} = await getsts()
      uploadForOSS({
        uploadPath: pwd, 
        ossData:{
          region: data.host.split('.')[1], //'oss-cn-hangzhou',
          accessKeyId: data.credentials.AccessKeyId,//process.env.OSS_ACCESS_KEY_ID,
          accessKeySecret: data.credentials.AccessKeySecret,//process.env.OSS_ACCESS_KEY_SECRET,
          stsToken: data.credentials.SecurityToken,
          bucket: data.bucket, //'hz-care',
          refreshSTSToken: async () => {
            const refreshToken = await axios.get(getStsApi);
            return {
              accessKeyId: refreshToken.AccessKeyId,
              accessKeySecret: refreshToken.AccessKeySecret,
              stsToken: refreshToken.SecurityToken,
            };
          },
        },
        prefixKey:`/admin/static/${args[0]}`,// 一般sts会限制用户上传的文件目录所以这里写死前缀，可以基于实际情况修改
      })
    } catch (error) {
      console.log('error=======>',error);
    }
  }
}).catch(rej=>{
  console.error(rej);
})



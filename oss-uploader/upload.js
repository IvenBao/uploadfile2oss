const file = require('./readFile'); // 读取文件
const ProgressBar = require('./progress-bar');  // 进度条
const pb = new ProgressBar('正在上传至阿里云', 50); // 初始化进度条

let OSS = require('ali-oss'); // OSS SDK
let client;
let prefix; // 最外层文件夹名 即 oss最外层路径名
const name_array = [] // 上传成功后存储文件名与在线地址
// 构造上传函数
function uploadFile(key, localFile) {
  return client.put(key, localFile).then(function (r1) {
    // console.log('put success: %j', JSON.parse(r1));
    return client.get(key);
  }).then(function (r2) {
    // console.log('get success: %j', r2);
    return r2;
  }).catch(function (err) {
    console.error('error: %j', err);
  });
}

let num = 1;
function uploading(files) {
  // 获取当前时间戳命名文件
  const time = new Date().getTime();
  if (num <= files.length) {
    // 更新进度条
    pb.render({ completed: num, total: files.length });
    const filenames = files[num - 1].fileName.split('.')
    filenames[filenames.length-1] = `${time}.${filenames[filenames.length-1]}`
    const refilename = filenames.join('.') // 重命名文件名，加上时间戳，防止同名文件上传成功后覆盖问题
    // 上传
    const key = (prefix ? prefix + '/' : '') + refilename;
    const filePath = files[num - 1].filePath;
    uploadFile(key, filePath).then((res) => {
      // console.log( '文件：',files[num - 1].fileName , '上传成功.\n文件地址：',res.res.requestUrls);
      name_array.push({
        name: files[num - 1].fileName,
        url: res.res.requestUrls[0]
      })
      num++;
      setTimeout(() => {
        uploading(files);
      }, 200)
    }).catch(() => {
      console.error('\nupload fail!')
    })
  } else {
    console.log('\nupload finish!')
    console.log(name_array);
  }
}

module.exports = function({uploadPath, ossData, prefixKey}) {
  const files = file.getFiles(uploadPath);
  client = new OSS(ossData);
  prefix = prefixKey;
  uploading(files);
}
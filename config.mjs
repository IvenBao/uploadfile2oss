import fs from "fs";
const getStsApi= 'stsapiurl' // 获取sts参数的api地址
const noEmptyFile = (folderPath)=> new Promise((resolve, reject) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      reject(err);
      return;
    }
    if (files.length === 0) {
      console.log(`文件夹 ${folderPath} 是空的.`);
      reject();
    } else {
      resolve(true);
      console.log(`文件夹 ${folderPath} 不是空的.`);
    }
  })
})
export default{
  getStsApi,
  noEmptyFile
}
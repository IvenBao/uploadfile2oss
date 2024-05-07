# uploadfiles2oss 批量上传文件到阿里云OSS
### 基于node.js开发 通过sts临时凭证上传本地文件到阿里云OSS

``` bash
# npm 安装
npm i 

#or

pnpm i


# 使用与配置
 config.js 配置sts接口地址与一些工具方法

 使用：
 pnpm upload:ds ${pwd} 上传pwd路径下的文件到ds空间内 用于交付项目
 pnpm upload:care ${pwd} 上传pwd路径下的文件到care空间内 用于车服项目
 pnpm upload:ssm ${pwd} 上传pwd路径下的文件到ssm空间内 用于超慧省项目

 上传完成后控制台会返回出来oss地址与文件名的对应关系，替换项目中的地址即可


## 开发
基于项目源码可以进行二次开发，可以改成不使用sts的方式，也可以修改源码中上传目录与文件名的规则

##鸣谢
核心代码来自： https://github.com/Jone-g/oss-uploader
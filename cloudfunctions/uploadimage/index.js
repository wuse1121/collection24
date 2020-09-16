// 云函数入口文件
const cloud = require('wx-server-sdk')
const webp = require('webp-converter');
const fs = require('fs');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    file,
    fileType
  } = event;
  const base64 = file.replace(/^data:image\/\w+;base64,/, "");
  const dataBuffer = new Buffer(base64, 'base64');
  const result = await webp.buffer2webpbuffer(dataBuffer,fileType,"-q 80");
  const cloudPath = 'my-image/' + 'xxx/'+ Date.now() + '.webp';
  console.log(result)
  return await cloud.uploadFile({
    cloudPath: cloudPath,
    fileContent: result,
  })
}
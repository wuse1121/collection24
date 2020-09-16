// 云函数入口文件
const cloud = require('wx-server-sdk')
const webp = require('webp-converter');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    file,
    fileType
  } = event;
  console.log(file)
  const result = await webp.str2webpstr(file,fileType,"-q 80");
  console.log(result)
  return result
}
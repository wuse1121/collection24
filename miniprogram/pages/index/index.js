//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrl:'',
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  // 获取文件类型
  getFileType: function (filePath) {
    var startIndex = filePath.lastIndexOf(".");
    if (startIndex != -1)
      return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
    else return "";
  },
  // 上传图片
  doUpload: function () {
    let _this = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('image', res)
        // wx.showLoading({
        //   title: '上传中',
        // })
        const fileManger = wx.getFileSystemManager();
        const filePath = res.tempFilePaths[0];
        const fileType = _this.getFileType(filePath);
        console.log('type', fileType)
        wx.getFileSystemManager().readFile({
          filePath: filePath, //选择图片返回的相对路径
          encoding: "base64", //这个是很重要的
          success: res => { //成功的回调
            //返回base64格式
            let file = `data:image/${fileType};base64,` + res.data;
            _this.setData({
              imgUrl:file
            })
            wx.cloud.callFunction({
              name: 'uploadimage',
              data: {
                file,
                fileType
              },
              success: res => {
                console.log('[云函数] [upload image]: ', res)
              },
              fail: err => {

              }
            })
          }
        })

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        // wx.cloud.uploadFile({
        //   cloudPath,
        //   filePath,
        //   success: res => {
        //     console.log('[上传文件] 成功：', res)

        //     app.globalData.fileID = res.fileID
        //     app.globalData.cloudPath = cloudPath
        //     app.globalData.imagePath = filePath

        //     wx.navigateTo({
        //       url: '../storageConsole/storageConsole'
        //     })
        //   },
        //   fail: e => {
        //     console.error('[上传文件] 失败：', e)
        //     wx.showToast({
        //       icon: 'none',
        //       title: '上传失败',
        //     })
        //   },
        //   complete: () => {
        //     wx.hideLoading()
        //   }
        // })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
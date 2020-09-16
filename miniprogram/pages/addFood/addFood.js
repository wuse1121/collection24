// pages/addFood/addFood.js
Page({
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },

  data: {
    unitOptions: [{
        value: 0,
        text: 'kcal'
      },
      {
        value: 1,
        text: 'kj'
      }
    ],

    formData: {
      name: '', // 食物名称
      weight: 0, // 重量
      power: 0, // 能量
      unit: 0, // 能量单位
      image: '', //食物图片
      openid: '', // 创建用户id
    },
    rules: [{
      name: 'name',
      rules: {
        required: true,
        message: 'qq必填'
      },
    }, {
      name: 'weight',
      rules: [{
        required: true,
        message: 'mobile必填'
      }],
    }, {
      name: 'power',
      rules: {
        required: true,
        message: '验证码必填'
      },
    }]
  },
  // 选择单位
  selectorChange(e) {
    console.log('unit code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      formData: {
        unit: e.detail.value
      }
    })
  },
  // 输入食物重量
  weightChange(e) {
    this.setData({
      formData: {
        weight: e.detail.value
      }
    })
  },

  // 输入食物能量
  powerChange(e) {
    this.setData({
      formData: {
        power: e.detail.value
      }
    })
  },

  onUploadImage: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('image',res)
      }
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
      }
    })
  }
})
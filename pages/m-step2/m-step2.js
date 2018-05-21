const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    act: "",
    arr: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (wx.getStorageSync("userinfo").uid) {
      wx.login({
        success: function (res) {
          var code = res.code
          wx.getWeRunData({//解密微信运动
            success(res) {
              wx.setStorageSync("run", true);
              wx.request({
                url: app.globalData.Murl + '/Applets/Active/wx_movemen',
                data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
                method: "post",
                success: function (res) {

                }
              })
            },
            fail: function () {
              wx.showToast({
                title: '请授权微信运动步数，参加活动',
                icon: "none",
                duration: 1000
              })
            }
          })
        }
      })
    }
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/carousel',
      method: "post",
      data: { member_id: wx.getStorageSync("userinfo").uid },
      success: function (res) {
        console.log(res)
        that.setData({
          arr: res.data.list,
          step: res.data.mem_step_num.step_number
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      uid: wx.getStorageSync("userinfo").uid
    })

    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_step_list',
      method: "post",
      success: function (res) {
        //console.log(res.data)
        that.setData({
          act: res.data
        })
      }
    })



  },
  Submit: function (e) {//开团
    var that = this
    var ac_id = e.detail.value.ac_id;
    var formId = e.detail.formId;//模板id
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/create_step',
      data: { member_id: that.data.uid, ac_id: ac_id, formid: formId },
      method: "post",
      success: function (res) {
        var sta = res.data.status;
        console.log(res)
        console.log(res.data.msg)
        if (sta == 1) {
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?teamid=' + res.data.team_id,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
        }
      }
    })


  },
  Submit2: function (e) {
    var that = this;
    var ac_id = e.detail.value.acid;
    var team_id = e.detail.value.teamid;
    var formId = e.detail.formId;
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/join_team',
      data: { member_id: that.data.uid, ac_id: ac_id, team_id: team_id, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.status == 3) {//人数不够
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?teamid=' + team_id,
          })
        }
        if (res.data.status == 2) {//人数够了，步数不够
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?teamid=' + team_id,
          })
        }
        if (res.data.status == 1) {//赵晓阳页面 都够了
          // wx.navigateTo({
          //   url: '/pages/hasbeencompleted/hasbeencompleted?coupon=' + res.data.coupon,
          // })
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?teamid=' + team_id,
          })
        }
        if (res.data.status == -3) {//满员
          wx.navigateTo({
            url: '/pages/m-step3/m-step3?teamid=' + team_id,
          })
        }
        if (res.data.status == -1 || res.data.status == -2 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
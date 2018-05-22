const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    show: "display:none",
    more: "display:block",
    fold: true,
    fold2: false,
    fold3: false,
    foldStyle: "height:340rpx;",
    foldStyle2: "height:1250rpx!important;",
    foldStyle3: "height:1250rpx!important;",
    team: "",
    teamList1: [],
    teamList2: [],
    h1: "",
    m1: "",
    s1: ""
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync("userinfo").uid) {
      that.setData({
        uid: wx.getStorageSync("userinfo").uid
      })
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
      //参加的团队
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/team_list',
        data: { member_id: wx.getStorageSync("userinfo").uid },
        method: "post",
        success: function (res) {
          console.log(res)
          if (res.data.create == "" && res.data.join == "") {
            that.setData({
              team: false
            })
          } else {
            that.setData({
              team: true,
              teamList1: res.data.create,
              teamList2: res.data.join,
            })
            if (res.data.create.length > 4) {
              that.setData({
                foldStyle2: "height:1200rpx!important;",
                foldStyle21: "padding-bottom:70rpx!important;",
                fold2: true
              })
            } else {
              that.setData({
                foldStyle2: "height:auto!important;",
                foldStyle21: "padding-bottom:0rpx!important;",
                fold2: false
              })
            }
            if (res.data.join.length > 4) {
              that.setData({
                foldStyle3: "height:1200rpx!important;",
                foldStyle31: "padding-bottom:70rpx!important;",
                fold3: true
              })
            } else {
              that.setData({
                foldStyle3: "height:auto!important;",
                foldStyle31: "padding-bottom:0rpx!important;",
                fold3: false
              })
            }
          }

        }
      })
      

    } else {
      that.setData({
        show: "display:block"
      })
      var timer = setInterval(function () {
        var userInfo = wx.getStorageSync("userinfo");
        // console.log(userInfo.uid)
        if (userInfo.uid) {
          clearInterval(timer)
          that.setData({
            uid: wx.getStorageSync("userinfo").uid,
            show: "display:none"
          })
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

          // 参加的团队
          wx.request({
            url: app.globalData.Murl + '/Applets/Active/team_list',
            data: { member_id: wx.getStorageSync("userinfo").uid },
            method: "post",
            success: function (res) {
              console.log(res)
              if (res.data.create == "" && res.data.join == "") {
                that.setData({
                  team: false
                })
              } else {
                that.setData({
                  team: true,
                  teamList1: res.data.create,
                  teamList2: res.data.join,
                })
                if (res.data.create.length > 4) {
                  that.setData({
                    foldStyle2: "height:1200rpx!important;",
                    foldStyle21: "padding-bottom:70rpx!important;",
                    fold2: true
                  })
                } else {
                  that.setData({
                    foldStyle2: "height:auto!important;",
                    foldStyle21: "padding-bottom:0rpx!important;",
                    fold2: false
                  })
                }
                if (res.data.join.length > 4) {
                  that.setData({
                    foldStyle3: "height:1200rpx!important;",
                    foldStyle31: "padding-bottom:70rpx!important;",
                    fold3: true
                  })
                } else {
                  that.setData({
                    foldStyle3: "height:auto!important;",
                    foldStyle31: "padding-bottom:0rpx!important;",
                    fold3: false
                  })
                }
              }

            }
          })

        } else {
          that.setData({
            show: "display:block"
          })
        }
      }, 1000)


    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/step_detail',
      method: "post",
      success: function (res) {
        console.log(2222)
        console.log(res)
        that.setData({
          rule: res.data.rule,
          finish_num: res.data.finish_num,
          total_num: res.data.total_num,
          tit: res.data.rule[0].step_number
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    // 倒计时
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var h = 23 - date.getHours();
    var m = 59 - date.getMinutes();
    var s = 59 - date.getSeconds();
    var gap = h * 60 * 60 + m * 60 + s;
    setInterval(
      function () {
        gap--;
        var h1 = parseInt(gap / 60 / 60);
        var m1 = parseInt(gap / 60) % 60;
        var s1 = gap % 60;
        if (m1 < 10) {
          m1 = "0" + m1;
        }
        if (s1 < 10) {
          s1 = "0" + s1;
        }
        that.setData({
          h1: h1,
          m1: m1,
          s1: s1
        })

      }

      , 1000)

  },
  UserInfo: function (e) {
    //console.log(e.detail);
    wx.login({
      success: function (res) {
        var code = res.code;
        var utoken = wx.getStorageSync("utoken");
        wx.request({
          //用户登陆URL地址，请根据自已项目修改
          url: app.globalData.Murl + '/Applets/Login/userAuthSlogin',
          method: "POST",
          data: {
            utoken: utoken,
            code: code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          fail: function (res) {
          },
          success: function (res) {
            var utoken = res.data.utoken;
            //设置用户缓存
            wx.setStorageSync("utoken", utoken);
            wx.setStorageSync("userinfo", res.data.userinfo);
            //console.log("允许");
          }
        })
      }
    })
  },
  Sfold: function (e) {
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
    var fold = !e.detail.value.ff;
    this.setData({
      fold: fold
    })
    if (!fold) {
      this.setData({
        foldStyle: "height:auto!important;"
      })
    } else {
      this.setData({
        foldStyle: "height:350rpx!important;"
      })
    }
  },
  Sfold2: function (e) {
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
    var fold2 = !e.detail.value.ff;
    this.setData({
      fold2: fold2
    })
    if (!fold2) {
      that.setData({
        foldStyle2: "height:auto!important;",
        foldStyle21: "padding-bottom:0rpx!important;"
      })
    } else {
      that.setData({
        foldStyle2: "height:1250rpx!important;",
        foldStyle21: "padding-bottom:70rpx!important;"
      })
    }
  },
  Sfold3: function (e) {
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
    var fold3 = !e.detail.value.ff;
    this.setData({
      fold3: fold3
    })
    if (!fold3) {
      that.setData({
        foldStyle3: "height:auto!important;",
        foldStyle31: "padding-bottom:0rpx!important;"
      })
    } else {
      that.setData({
        foldStyle3: "height:1250rpx!important;",
        foldStyle31: "padding-bottom:70rpx!important;"
      })
    }
  },
  Submit: function (e) {
    var that = this;
    var formId = e.detail.formId;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })

    // console.log(that.data.uid)
    if (!wx.getStorageSync('run')) {
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.openSetting({
            success(res) {
              if (res.authSetting["scope.werun"]) {
                wx.getWeRunData({//解密微信运动
                  success(res) {
                    wx.setStorageSync("run", true);
                    wx.request({
                      url: app.globalData.Murl + '/Applets/Active/wx_movemen',
                      data: { code: code, encryptedData: res.encryptedData, iv: res.iv, member_id: that.data.uid },
                      method: "post",
                      success: function (res) {
                        wx.navigateTo({
                          url: '/pages/m-step2/m-step2',
                        })
                      }
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '请授权微信运动步数，参加活动',
                      icon: "none",
                      duration: 1000
                    })
                  }
                })
              }
            }
          })

        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/m-step2/m-step2',
      })
    }
  },
  Submit2: function (e) {
    var that = this;
    var zl = e.detail.value.zl;
    var formId = e.detail.formId;
    console.log(formId)
    // console.log(zl)
    if (zl == 1) {
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
          // console.log(res)
        }
      })
      wx.navigateTo({
        url: '/pages/m-coupon/m-coupon',
      })
    }
    if (zl == 2) {
      var teamid = e.detail.value.teamid;
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
          // console.log(res)
        }
      })
      wx.navigateTo({
        url: '/pages/m-step3/m-step3?teamid=' + teamid,
      })
    }
    if (zl == 3) {
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
        data: { member_id: that.data.uid, formid: formId },
        method: 'post',
        success: function (res) {
          // console.log(res)
        }
      })
    }
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
    var that = this;
    // console.log(that.data.id)
    return {
      title: '青青优农',
      path: '/pages/m-step/m-step',
      imageUrl: '',
      success: function (res) {

        var shareTickets = res.shareTickets[0];
        wx.login({
          success: function (res) {
            //console.log(shareTickets)
            var code = res.code;
            wx.getShareInfo({
              shareTicket: shareTickets,
              success: function (res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                // console.log(res)
                // console.log(code)
                // wx.request({
                //   url: app.globalData.Murl+'/Applets/Login/jiemi',
                //   data: { encryptedData: encryptedData, iv: iv, code: code },
                //   method: "post",
                //   success: function (res) {
                //     var openGId = res.data.openGId;
                //     // console.log(res.data.openGId)
                //     //console.log(that.data.uid)

                //   }
                // })
              },
              fail: function (res) { console.log(res) },
              complete: function (res) { }
            })



          }
        })
        // console.log

      },
      fail: function (res) {
        // 分享失败
        //console.log(res)
        // wx.showToast({
        //   title: '系统繁忙',
        //   icon:'none',
        //   duration:1000
        // })
      }
    }
  }
})
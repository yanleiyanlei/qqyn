const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foldClass: 'display:none',
    now: "display:none",
    actInfo: "",
    teamMember: [],
    sta: "",
    uid: "",
    sta1: '',
    team_id: "",
    ac_id: "",
    show: "display:none",
    num: "",
    h1: "",
    m1: "",
    s1: "",
    klist: []
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
        // console.log(2222)
        // console.log(res)
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
    var team_id = options.teamid
    that.setData({
      team_id: team_id,
    })
    //console.log(team_id)
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
      wx.request({
        url: app.globalData.Murl + '/Applets/Active/create_detail',
        data: { team_id: team_id, member_id: wx.getStorageSync("userinfo").uid },
        method: 'post',
        success: function (res) {
          console.log(res)
          var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
          console.log(kk)
          var klist = [];
          if (kk != 0) {
            for (var i = 0; i < kk; i++) {
              klist.push(1)
            }
          }
          that.setData({
            actInfo: res.data.info,
            teamMember: res.data.info.member_info,
            ac_id: res.data.info.step_id,
            klist: klist
          })
          if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，
            wx.redirectTo({
              url: '/pages/hasbeencompleted/hasbeencompleted?coupon=' + res.data.coupon,
            })
          }
          if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
            that.setData({
              sta1: 2
            })
          }
          if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

            that.setData({
              sta1: 3
            })
          }
          if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
            that.setData({
              sta1: 4
            })
          }
          if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
            that.setData({
              sta1: 5,
              num: res.data.num,
              now: "display:block"
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
          }
          if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
            // setTimeout(function () {
            //   wx.redirectTo({
            //     url: '/pages/m-step/m-step',
            //   })
            // }, 3000)
          }

        }
      })
    } else {
      that.setData({
        show: "display:block"
      })
      var timer = setInterval(function () {
        var userInfo = wx.getStorageSync("userinfo");
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

          wx.request({
            url: app.globalData.Murl + '/Applets/Active/create_detail',
            data: { team_id: team_id, member_id: wx.getStorageSync("userinfo").uid },
            method: 'post',
            success: function (res) {
              console.log(res)
              var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
              console.log(kk)
              var klist = [];
              if (kk != 0) {
                for (var i = 0; i < kk; i++) {
                  klist.push(1)
                }
              }
              that.setData({
                actInfo: res.data.info,
                teamMember: res.data.info.member_info,
                ac_id: res.data.info.step_id,
                klist: klist
              })
              if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，
                wx.redirectTo({
                  url: '/pages/hasbeencompleted/hasbeencompleted?coupon=' + res.data.coupon,
                })
              }
              if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                that.setData({
                  sta1: 2
                })
              }
              if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                that.setData({
                  sta1: 3
                })
              }
              if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                that.setData({
                  sta1: 4
                })
              }
              if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                that.setData({
                  sta1: 5,
                  num: res.data.num,
                  now: "display:block"
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
              }
              if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 3000
                })
                // setTimeout(function () {
                //   wx.redirectTo({
                //     url: '/pages/m-step/m-step',
                //   })
                // }, 3000)
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
  gostep: function (e) {
    var that = this;
    var formId = e.detail.formId;
    console.log(formId)
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
    wx.navigateTo({
      url: '/pages/m-step/m-step',
    })
  },
  fold: function (e) {
    var formId = e.detail.formId;
    this.setData({
      foldClass: 'display:block'
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
  },
  close: function (e) {
    var formId = e.detail.formId;
    this.setData({
      foldClass: 'display:none'
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        // console.log(res)
      }
    })
  },
  close2: function () {
    this.setData({
      now: "display:none"
    })

  },
  top: function (e) {
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  again: function (e) {
    var formId = e.detail.formId;
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/get_mem_formid',
      data: { member_id: that.data.uid, formid: formId },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '/pages/m-step2/m-step2',
    })

  },
  Submit: function (e) {
    var that = this;
    // console.log(e.detail.value)
    var team_id = e.detail.value.teamid;


    var ac_id = e.detail.value.acid;
    var form_id = e.detail.formId;
    // console.log(form_id)
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
                      url: app.globalData.Murl + '/Applets/Active/join_team',
                      data: { member_id: that.data.uid, ac_id: ac_id, team_id: team_id, formid: form_id },
                      method: 'post',
                      success: function (res) {
                        if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                          })
                        }
                        if (res.data.status == -3) {
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                          })
                          // setTimeout(function(){
                          //   wx.redirectTo({
                          //     url: '',
                          //   })
                          // },1000)
                        }

                        if (res.data.status == 1 || res.data.status == 2 || res.data.status == 3) {


                          wx.request({
                            url: app.globalData.Murl + '/Applets/Active/create_detail',
                            data: { team_id: team_id, member_id: that.data.uid },
                            method: 'post',
                            success: function (res) {
                              console.log(res)
                              var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                              console.log(kk)
                              var klist = [];
                              if (kk != 0) {
                                for (var i = 0; i < kk; i++) {
                                  klist.push(1)
                                }
                              }


                              that.setData({
                                actInfo: res.data.info,
                                teamMember: res.data.info.member_info,
                                ac_id: res.data.info.step_id,
                                klist: klist
                              })
                              if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，

                                wx.redirectTo({
                                  url: '/pages/hasbeencompleted/hasbeencompleted?coupon=' + res.data.coupon,
                                })
                              }
                              if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                                that.setData({
                                  sta1: 2
                                })
                              }
                              if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                                that.setData({
                                  sta1: 3

                                })
                              }
                              if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                                that.setData({
                                  sta1: 4
                                })
                              }
                              if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                                that.setData({
                                  sta1: 5,
                                  num: res.data.num,
                                  now: "display:block"
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
                              }
                              if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                                wx.showToast({
                                  title: res.data.msg,
                                  icon: 'none',
                                  duration: 1000
                                })
                                // setTimeout(function () {
                                //   wx.redirectTo({
                                //     url: '/pages/m-step/m-step',
                                //   })
                                // }, 1000)
                              }

                            }
                          })
                        }

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

      wx.request({
        url: app.globalData.Murl + '/Applets/Active/join_team',
        data: { member_id: that.data.uid, ac_id: ac_id, team_id: team_id, formid: form_id },
        method: 'post',
        success: function (res) {
          console.log(res)
          if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3 || res.data.status == -4 || res.data.status == -5 || res.data.status == -6 || res.data.status == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })

          }
          if (res.data.status == 1 || res.data.status == 2 || res.data.status == 3) {
            wx.request({
              url: app.globalData.Murl + '/Applets/Active/create_detail',
              data: { team_id: team_id, member_id: that.data.uid },
              method: 'post',
              success: function (res) {
                console.log(res)
                var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
                console.log(kk)
                var klist = [];
                if (kk != 0) {
                  for (var i = 0; i < kk; i++) {
                    klist.push(1)
                  }
                }

                that.setData({
                  actInfo: res.data.info,
                  teamMember: res.data.info.member_info,
                  ac_id: res.data.info.step_id,
                  klist: klist
                })
                if (res.data.status == 1) {//跳晓阳页面，人数已满，步数已够，

                  wx.redirectTo({
                    url: '/pages/hasbeencompleted/hasbeencompleted?coupon=' + res.data.coupon,
                  })
                }
                if (res.data.status == 2) {//邀请好友，人数未满，该用户在该团队，
                  that.setData({
                    sta1: 2
                  })
                }
                if (res.data.status == 3) {//我要组队，人数已满，该用户不在该团队 

                  that.setData({
                    sta1: 3
                  })
                }
                if (res.data.status == 4) {//立即加入，人数未满，该用户不在该团队
                  that.setData({
                    sta1: 4
                  })
                }
                if (res.data.status == 5) {//人数已满，步数不够，该用户在该团队  差多少步
                  that.setData({
                    sta1: 5,
                    num: res.data.num,
                    now: "display:block"
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
                }
                if (res.data.status == -1 || res.data.status == -2 || res.data.status == -3) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                  })
                  // setTimeout(function () {
                  //   wx.redirectTo({
                  //     url: '/pages/m-step/m-step',
                  //   })
                  // }, 1000)
                }

              }
            })
          }


        }
      })
    }

  },
  join: function (e) {











  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

    return {
      title: '青青优农',
      path: '/pages/m-step3/m-step3?teamid=' + that.data.team_id,
      imageUrl: '',
      success: function (res) {

        var shareTickets = res.shareTickets[0];
        wx.login({
          success: function (res) {

            var code = res.code;
            wx.getShareInfo({
              shareTicket: shareTickets,
              success: function (res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;

              },
              fail: function (res) { },
              complete: function (res) { }
            })



          }
        })


      },
      fail: function (res) {

      }
    }
  }
})
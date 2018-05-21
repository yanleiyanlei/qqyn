
//app.js
App({
  data:{

  },
  onShow:function(options){
   // console.log(options)
    var shareTickets = options.shareTicket;
    if (options.scene == 1044) {
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
              wx.request({
                url: 'https://m.7710mall.com/index.php/Applets/Login/jiemi',
                data: { encryptedData: encryptedData, iv: iv, code: code },
                method: "post",
                success: function (res) {
                  //console.log(res.data)
                }
              })
            },
            fail: function (res) { console.log(res) },
            complete: function (res) { }
          })



        }
      })
      // wx.getShareInfo({
      //   shareTicket: options.shareTicket,
      //   success: function (res) {
      //     var encryptedData = res.encryptedData;
      //     var iv = res.iv;
      //     console.log(2222)
      //     console.log(encryptedData)        
      //   }
      // })
    }
    //console.log("55555")
  },
  onLaunch: function (res) {
    //console.log(res)
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)



    // 登录
    // this.getUserDataToken();
    
  },
  // getUserDataToken: function () {
  //   var that = this;
  //   //获取用户缓存token 此token是服务器作为用户唯一验证的标识，具体请看后端代码
  //   var utoken = wx.getStorageSync("utoken");
  //   wx.login({
  //     success: function (res) {
  //       var code = res.code;
  //       that.globalData.code = code;
  //       wx.getUserInfo({
  //         success: function (res) {
  //           wx.request({
  //             //用户登陆URL地址，请根据自已项目修改
  //             url: 'http://ss.bjzzdk.com/index.php/Applets/Login/userAuthSlogin',
  //             method: "POST",
  //             data: {
  //               utoken: utoken,
  //               code: code,
  //               encryptedData: res.encryptedData,
  //               iv: res.iv
  //             },
  //             fail: function (res) {
                

  //             },
  //             success: function (res) {
  //               //console.log(res)
  //               var utoken = res.data.utoken;
  //               //设置用户缓存
  //               wx.setStorageSync("utoken", utoken);
  //               wx.setStorageSync("userinfo", res.data.userinfo);
  //             }
  //           })
  //         },
  //         fail:function(){
  //           console.log("用户拒绝")
  //           wx.showModal({
  //             title: '提示',
  //             content: '您未授权登陆,无法正常商城购物,点击确定重新获取授权。',
  //             success: function (res) {
  //               if (res.confirm) {
  //                 wx.openSetting({
  //                   success: (res) => {
  //                     if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
  //                       wx.getUserInfo({
  //                         success: function (res) {
  //                           wx.request({
  //                             //用户登陆URL地址，请根据自已项目修改
  //                             url: 'http://ss.bjzzdk.com/index.php/Applets/Login/userAuthSlogin',
  //                             method: "POST",
  //                             data: {
  //                               utoken: utoken,
  //                               code: code,
  //                               encryptedData: res.encryptedData,
  //                               iv: res.iv
  //                             },
  //                             fail: function (res) {


  //                             },
  //                             success: function (res) {
  //                               //console.log(res)
  //                               var utoken = res.data.utoken;
  //                               //设置用户缓存
  //                               wx.setStorageSync("utoken", utoken);
  //                               wx.setStorageSync("userinfo", res.data.userinfo);
  //                             }
  //                           })
  //                         }
  //                       })
  //                     }
  //                   }, fail: function (res) {

  //                   }
  //                 })

  //               }
  //             }
  //           })






  //         }
  //       })
  //     }
  //   })
  // },
  globalData: {
    userInfo: null,
    code:"1",
    location:"北京",
    Murl:"https://www.77farmers.com/index.php"
  }
})
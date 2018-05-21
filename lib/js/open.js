var mdd = getApp();
function open() {
  wx.showModal({
    title: '提示',
    content: '您未授权登陆,无法正常商城购物,点击确定重新获取授权。',
    success: function (res) {
      if (res.confirm) {
        wx.login({
          success: function (res) {
            var code = res.code;
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                  wx.getUserInfo({
                    success: function (res) {
                      var utoken = wx.getStorageSync("utoken");
                      wx.request({
                        //用户登陆URL地址，请根据自已项目修改
                        url: 'https://m.7710mall.com/index.php/Applets/Login/userAuthSlogin',
                        method: "POST",
                        data: {
                          utoken: utoken,
                          code: code,
                          encryptedData: res.encryptedData,
                          iv: res.iv
                        },
                        fail: function (res) {


                        },
                        success: function (res) {
                          //console.log(res)
                          var utoken = res.data.utoken;
                          //设置用户缓存
                          wx.setStorageSync("utoken", utoken);
                          wx.setStorageSync("userinfo", res.data.userinfo);
                          //console.log(wx.getStorageSync("userinfo").uid)
                        }
                      })
                    }
                  })
                }
              }, fail: function (res) {

              }
            })
          }
        })


      }
    }
  })
}
module.exports = {
  open: open
}
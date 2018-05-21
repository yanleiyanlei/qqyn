const app = getApp()
function myfunc() {
  var timer = setInterval(function(){
    //console.log("检测")
    //var code = app.globalData.code
    wx.getSetting({
        success(res) {
            if(!res.authSetting['scope.userInfo']){
                console.log("未登录，检测中")
                
            
            }else{
              console.log("已登录，重新加载用户数据中……")

              clearInterval(timer);
              setTimeout(function(){
                var uid = wx.getStorageSync("userinfo").uid;
                console.log("[重新加载成功，用户ID]:"+ uid)
                app.globalData.uid = uid;
                console.log(app.globalData.uid)
                wx.request({
                    url: "https://m.7710mall.com/index.php/Applets/User/my",
                    data: { uid: uid},
                    method: "POST",
                    success: function (res) {
                       console.log(res.data.level_name)
                       
                       app.globalData.nickName = res.data.nickname;
                       app.globalData.head_pic =  res.data.head_pic;
                       app.globalData.levelname = res.data.level_name;
                       app.globalData.member_money=res.data.member_money;
                       app.globalData.yhq=res.data.yhq;
                       var page = getCurrentPages().pop();  
                       if (page == undefined || page == null) return;  
                       page.onShow();  
                       
                    },
                    fail: function () {
                      //console.log(888)
                    },
                    complete: function () {
              
                    }
              
                  })
              },500)
              
            }
        }
    })

  },300)
}
    
module.exports.myfunc = myfunc;

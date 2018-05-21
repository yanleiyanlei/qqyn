const app = getApp();
Page({
    date:[{
         datas:[],
    }],
    imgurleh(e){
        let goodsid= e.currentTarget.dataset.id;
          wx.redirectTo({
             url: '../details/details?goodsid='+goodsid,
            success: function(res) {console.log(res)},
            fail: function(res) {console.log(res)},
            complete: function(res) {console.log(res)},
          })
    },
    onLoad:function(){
    	var _this=this;
    	var uid = wx.getStorageSync("userinfo").uid;
    	wx.request({
          	 	url:app.globalData.Murl+'/Applets/Cart/orderlist1',
          	 	data:{
          	 		member_id:uid,
          	 	},
          	 	 method: "post",
          	 	 success: function (res) {
          	 	 	console.log(res.data);
          	 	   const datalist=res.data;
          	 	   _this.setData({
          	 	   	datas:datalist
          	 	   })
          	 	} 
          	 })
    }
})
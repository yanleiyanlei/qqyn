Page({
  data: {

  },
  pagesm2() {
    wx.redirectTo({
      url: '../m-step2/m-step2',
    })
  },
  tiaocar: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  onLoad: function (options) {
    var coupon = options.coupon;
    this.setData({
      coupon: coupon
    })
  }
})
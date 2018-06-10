

var app = getApp()
var baseUrl = 'http://z.cn/api/v1';
Page({
    onLoad: function () {
    },

    getSuperToken: function () {
        wx.request({
            url:baseUrl + '/token/app',
            data:{
                ac:'warcraft',
                se:'777'
            },
            method: 'POST',
            //OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT//header:{},
            success:function (res) {
                console.log(res.data);
                wx.setStorageSync('super_token', res.data.token);
            },
            fail:function(){
                
            },
            complete:function () {

            }
        })
    },

    getToken:function(){

        wx.login({
            success:function(res){
                var code = res.code;
                console.log('code');
                console.log(code);
                wx.request({
                  url: baseUrl + '/token/user',
                    data:{
                        code: code
                    },
                    method:'POST',
                    success:function (res) {
                        console.log(res.data);
                        wx.setStorageSync('token',res.data.token);
                    },
                    fail:function (res) {
                        console.log(res.data);
                    }
                })
            }
        })
    },

    checkSession:function () {
        wx.checkSession({
            success:function () {
                console.log('session success')
            },
            fail:function () {
                console.log('session fail');
            }
        })
    },

    delivery:function(){
                wx.request({
                    url:baseUrl + '/order/delivery?XDEBUG_SESSION_START=19812',
                    header:{
                        token:wx.getStorageSync('super_token')
                    },
                    method:'PUT',
                    data: {

                            id:293
                        },
                    success:function (res) {
                        console.log(res.data);
                    }
                })
            },



    pay:function () {
        var token = wx.getStorageSync('token');
        var that = this;

        wx.request({
            url: baseUrl + '/oder?XDBUG_SESSION_START=15140',
            header:{
                token:token
            },
            data:{
                products:
                [
                    {
                        product_id:1,count:1
                    },

                    {
                        product_id:2,count:1
                    }
                ]
            },
            method:'POST',
            success:function (res) {
                console.log(res.data);
                if(res.data.pass){
                    wx.setStorageSync('order_id',res.data.order_id);
                    that.getPreOrder(token,res.data.order_id);
                }
                else{
                    console.log('订单创建未成功');
                }
            }
        })
    },


    getPreOrder:function (token,orderID) {
        if (token){
            wx.request({
                url:baseUrl+ '/pay/pre_order?XDBUG_SESSION_START=13133',
                method:'POST',
                header: {
                    token: token
                },
                data:{
                    id:orderID
                },
                success:function (res) {
                    var preData = res.data;
                    wx.requestPayment({
                        timeStamp:preData.timeStamp.toString(),
                        nonceStr:preData.nonceStr,
                        package:preData.package,
                        signType:preData.signType,
                        paySign:preData.paySign,
                        success:function (res) {
                            console.log(res.data);
                        },
                        fail:function (error) {
                            console.log(error);
                        }
                    })
                }
            })
        }
    },

    formID:function (event) {
        console.log(event);
    }
})
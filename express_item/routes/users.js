var express = require('express');
var router = express.Router();
require('../util/util.js') // 引入日期格式化工具
var User = require('../models/user.js') // 模型
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// 登录路由
router.post('/login', function (req, res, next) {
  //res.send('respond with a resource');
  var param = { // 定义查询的条件
    userName: req.body.userName, // 用户名
    userPwd: req.body.userPwd // 密码
  }
  //console.log(param)
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message
      })
    } else {
      if (doc) {
        // app.js已经引用了cookie，我们直接使用就可以了
        res.cookie('userId', doc.userId, {
          // cookie配置
          path: '/', // 设置cookie的有效范围为根目录
          maxAge: 1000 * 60 * 60 * 5 // 1小时
        })
        res.cookie('userName', doc.userName, { // 设置cookie用户名
          // cookie配置
          path: '/', // 设置cookie的有效范围为根目录
          maxAge: 1000 * 60 * 60 * 5 // 1小时
        })
        res.json({
          status: '0',
          mes: '',
          result: {
            userName: doc.userName // 登录成功后的用户名返回到前端
          }
        })
      } else {
        res.json({
          status: '1',
          mes: 'err'
        })
      }
    }
  })
});
// 检测登录的状态
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) { // 如果检测到用户id，把userName给前端
    res.json({
      status: '0',
      mes: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      mes: '未登录',
      result: '',
    })
  }
})
// 退出登录
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1 // 过期
  })
  res.json({
    status: '0',
    mes: '',
    result: ''
  })
})
// 查询购物车数据路由
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId // 确定你是登录的状态
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) { // 报错
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          mes: '',
          result: doc.cartList
        })
      }
    }
  })
})
// 删除购物车商品
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId // 获取登录后的用户id
  var productId = req.body.productId // POST用body来获取，get用param来获取
  User.update({
      userId: userId
    }, // 谁
    {
      $pull: {
        'cartList': {
          'productId': productId
        }
      },
      // $pull是更新里的一个删除方法，删除cartList中的productId
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          mes: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          mes: '',
          result: 'suc'
        })
      }
    }
  )
})
// 更新购物车列表商品数量
router.post('/cartEdit', function (req, res, next) {
  // 更新需要哪些参数：用户id-谁的；商品id；商品数量
  var userId = req.cookies.userId // 用户id
  var productId = req.body.productId // 商品id
  var productNum = req.body.productNum // 商品数量
  var checked = req.body.checked // 购物车单选按钮值
  User.update(
    //更新的条件：userId为登录的用户id和子文档cartList.productId
    {
      "userId": userId,
      "cartList.productId": productId
    }, {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked,
    }, // $占位符，更新cartList.productNum
    function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          mes: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          mes: '',
          result: 'suc'
        })
      }
    }
  )
})
// 购物车商品全选或不选
router.post('/editCheckAll', function (req, res, next) {
  // 需要的参数：用户id、状态
  var userId = req.cookies.userId
  var checkAll = req.body.checkAll ? '1' : '0' // 状态,假如前端传递是true为‘1’，否则为‘0’
  User.findOne({
    userId: userId
  }, function (err, userTable) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      if (userTable) { // 只是对值进行了修改，并没有保存
        userTable.cartList.forEach(item => {
          item.checked = checkAll
        })
      }
      userTable.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            mes: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            mes: '',
            result: 'suc'
          })
        }
      })
    }
  })
})
//用户地址列表接口
router.get('/addressList', function (req, res, next) {
  // 数据：用户id
  var userId = req.cookies.userId
  User.findOne({
    userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        mes: '',
        result: doc.addressList // 地址列表
      })
    }
  })
})
// 修改地址的默认值
router.post('/setAddress', function (req, res, next) {
  var userId = req.cookies.userId
  var addressId = req.body.addressId // 前端传递的地址id
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      var addressList = doc.addressList // 得到的是文档中的地址列表
      addressList.forEach(item => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            mes: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            mes: '',
            result: 'suc' // 地址列表
          })
        }
      })
    }
  })
})
// 删除地址的接口
router.post('/delAddress', function (req, res, next) {
  // 需要的值
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  User.update({
    userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err1.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        mes: '',
        result: 'suc' // 地址列表
      })
    }
  })
})
//添加地址
router.post('/addAddress', function (req, res, next) {
  var userId = req.cookies.userId
  console.log(req.body)
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      doc.addressList.push(req.body)
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            mes: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            mes: '',
            result: 'suc' // 地址列表
          })
        }
      })
    }
  })
})
// 订单生成
router.post('/payMent', function (req, res, next) {
  // 那些数据：userId，商品的总价，地址id
  var userId = req.cookies.userId
  var orderTotal = req.body.orderTotal // 总价
  var addressId = req.body.addressId // 地址id
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      var address = '',
        goodList = [] // 地址和购物车商品列表
      // 获取当前用户地址信息
      doc.addressList.forEach(item => {
        if (addressId == item.addressId) { // 你选中的地址
          address = item
        }
      })
      //购物车里购买商品
      doc.cartList.forEach(item => {
        if (item.checked == '1') {
          goodList.push(item)
        }
      })
      // 订单号
      var platform = '322' // 平台码
      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)
      var sysDate = new Date().Format('yyyyMMddhhmmss') // 调用了插件的格式化日期
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss') // 创建日期
      var orderId = platform + r1 + sysDate + r2 // 订单号
      //整理数据
      var order = {
        "orderId": orderId,
        "orderTotal": orderTotal,
        "addressInfo": address,
        "goodsList": goodList,
        "orderStatus": '1',
        "createDate": createDate
      }
      doc.orderList.push(order) // 添加订单列表
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            mes: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            mes: '',
            result: { // 返回到前端
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})
router.get('/orderTotal', function (req, res, next) {
  var userId = req.cookies.userId,
    orderId = req.param('orderId')
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      var orderTotal = 0
      doc.orderList.forEach(item => {
        if (item.orderId == orderId) {
          orderTotal = item.orderTotal
        }
      })
      res.json({
        status: '0',
        mes: '',
        result: orderTotal
      })
    }
  })
})
// 购物成功删除购物车中的购买过的商品
router.get('/orderClear', function (req, res, next) {
  // 需要的数据：userid
  var userId = req.cookies.userId
  User.findOne({
    userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      doc.cartList.forEach((val, index) => {
        if (val.checked == '1') {
          delete doc.cartList[index]
          // doc.cartList.splice(index,1)
        }
      })
      //console.log(doc.cartList)
      doc.cartList = doc.cartList.filter(val => val);
      console.log(doc.cartList)
      doc.save((err1) => {
        if (err1) {
          res.json({
            status: '1',
            mes: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            mes: '',
            result: 'suc'
          })

        }
      })
    }
  })

})
router.get('/getCartCount', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      let wxp = 0;
      doc.cartList.forEach(item => {
        wxp += item.productNum
      })
      res.json({
        status: '0',
        mes: '',
        result: wxp
      })
    }
  })
})

router.get('/getUserName', function (req, res, next) {
  var userId = String(req.param('id'));;
  var userName = String(req.param('name'));
  var userPwd = String(req.param('pwd'));
  User.findOne({
    userName: userName
  }, (err, doc) => {
    if (err) { // 报错
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      console.log(userId, userName, userPwd);
      if (doc) {
        res.json({
          status: '2',
          mes: '错误',
          result: ''
        })
      } else {
        User.create({
          userId: userId,
          userName: userName,
          userPwd: userPwd,
          orderList: [],
          cartList: [],
          addressList: []
        }).then((data) => {}).catch((err) => {})
        res.json({
          status: '0',
          mes: '',
          result: 'suc'
        })
      }
    }
  })
})

// 流水
router.get('/getLiusui', function (req, res, next) {
    var oldTime = parseInt( req.param('oldTime')) ;
    var newTime = parseInt( req.param('newTime')) ;
  var arr = [];
  User.find((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      // arr.push(doc)
      doc.forEach((item, index) => { //createDate
        var data = new Date().get
        for (var i = 0; i < item.orderList.length; i++) {
          var t = new Date(item.orderList[i]['createDate']).getTime();

          if (t >= oldTime && t <= newTime) {
            arr.push(item['orderList']);
              return false;
          }

        }
      })
      res.json({
        status: '0',
        mes: '',
        result: arr
      })
    }
  })
})
module.exports = router;

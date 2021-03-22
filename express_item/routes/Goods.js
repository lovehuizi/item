var express = require('express');
var router = express.Router();
// 载入mongoose，操作数据库
var mongoose = require("mongoose")
var Good = require('../models/goods_model') // 加载模型

mongoose.connect("mongodb://127.0.0.1/db_demo") //数据库
mongoose.connection.on("connected", function () { // 数据库连接成功
  console.log('mongoDB connected success!')
})
mongoose.connection.on("error", function () { // 数据库连接错误失败
  console.log('mongoDB connected fail!')
})
mongoose.connection.on("disconnected", function () { // 数据库连接错误失败
  console.log('mongoDB disconnected!')
})

router.get('/list', function (req, res, next) { // 以get的方式请求路由 /goods/list
  // res.send('goods list!');
  let page = parseInt(req.param('page')) // 获取地址栏的当前页码
  let pageSize = parseInt(req.param('pageSize')) // 获取每页显示的条数
  let sort = req.param('sort') // 获取排序，1为升序，-1降序===express方法

  let priceLevel = req.param('priceLevel') // 排序级别
  let priceGt = '' // 最小
  let priceLt = '' // 最大

  let skip = (page - 1) * pageSize // 开始条数
  let params = {} // 查询的条件，空代表的是全部

  if (priceLevel != 'active') {
    console.log(priceLevel)
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLt = 100;
        break;
      case '1':
        priceGt = 100;
        priceLt = 500;
        break;
      case '2':
        priceGt = 500;
        priceLt = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLt = 2000;
        break;
      case '4':
        priceGt = 2000;
        priceLt = 4000;
        break;
      case '5':
        priceGt = 4000;
        priceLt = 10000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt, // 大于
        $lte: priceLt // 小于等于
      }
    }
  } else {
    params = {}
  }

  let goodModel = Good.find(params).skip(skip).limit(pageSize).sort({
    "salePrice": sort
  })
  //goodModel.sort({"salePrice":sort})
  // 执行模型
  goodModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1', // 状态,1错误
        mes: err.message
      })
    } else {
      res.json({
        status: '0',
        result: {
          count: doc.length, // 成功返回数据的长度
          list: doc
        }
      })
    }
  })
});
//获取get，而post一般是提交数据，为了测试方便先写成get，get不安全，post安全
//router.get('/addCart',function(req,res,next){
router.post('/addCart', function (req, res, next) { // /goods/addCart
  //正常情况下，先得到用户信息
  //var userId='100000077'   // 假设已经登录了
  var userId = req.cookies.userId
  console.log(userId)
  //var productId=req.param('productId')  //get 商品id
  var productId = req.body.productId //post 商品id
  var User = require('../models/user.js') // 导入模型
  User.findOne({
    userId: userId
  }, function (err, userDoc) { //性能上要高些
    if (err) {
      res.json({
        status: '1',
        mes: err.message
      })
    } else {
      if (userDoc) {
        //console.log(userDoc)
        var dataOnly = true // 开关，true购物车里没有添加过此商品
        userDoc.cartList.forEach(function (item) { // 遍历购物车
          if (item.productId == productId) { // 购物车里的产品id和传递过来的商品id相同，说明购物车里已经添加过该商品
            dataOnly = false // false购物车已经添加过
            item.productNum++ // 添加过的商品++
            userDoc.save(function (err2, doc2) {
              if (err2) {
                res.json({
                  status: '1',
                  mes: err2.message
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
        }) // end foreach
        if (dataOnly) { // 如果dataOnly是true没有添加过
          Good.findOne({
            productId: productId
          }, function (err3, doc3) {
            if (err3) {
              res.json({
                status: '1',
                mes: err3.message
              })
            } else {
              doc3.productNum = 1; // 默认购买1个
              doc3.checked = '1'; // 状态-是否在购物车中勾选
              //console.log(doc3)
              userDoc.cartList.push(doc3) // 添加到cartList
              userDoc.save(function (onlyerr, docbson) {
                if (onlyerr) {
                  res.json({
                    status: '1',
                    mes: onlyerr.message
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
        }
      }
    }
  })
})


// var multer = require('multer')
// router.post('/upload', multer({
//   //设置文件存储路径
//   dest: './'
// }).array('file', 1), function (req, res, next) {
//   let files = req.files;
//   let file = files[0];
//   let fileInfo = {};
//   let path = './' + Date.now().toString() + '_' + file.originalname;
//   let img = file.filename;
//   fs.renameSync('./' + img, path);
//   //获取文件基本信息
//   fileInfo.type = file.mimetype;
//   fileInfo.name = file.originalname;
//   fileInfo.size = file.size;
//   fileInfo.path = path;
//   res.json({
//     code: 0,
//     msg: 'OK',
//     data: fileInfo
//   })
// });


router.post('/addItem', function (req, res, next) {
  
  var name = String(req.body.name);
  console.log('%c 🍈 req.body.name: ', 'font-size:20px;background-color: #465975;color:#fff;', req.body.name);
  var img = String(req.body.img);
  var price = parseInt(req.body.price);
  var num = parseInt(req.body.num);
  var productId = '00' + parseInt(Math.random() * 123546214);
  var checked = 'false';
  Good.findOne({
    productName: name
  }, (err, doc) => {
    if (err) { // 报错
      res.json({
        status: '1',
        mes: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '2',
          mes: '错误',
          result: ''
        })
      } else {
        Good.create({
          productId: productId,
          productName: name,
          salePrice: price,
          checked: checked,
          productNum: num,
          productImg:img,
         
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
// router.get('/addItem', function (req, res, next) {
 
//   var name = String(req.param('name'));
//   var img = String(req.param('img'));
//   var price = parseInt(req.param('price'));
//   var num = parseInt(req.param('num'));
//   var productId = '00' + parseInt(Math.random() * 123546214);
//   var checked = 'false';
//   Good.findOne({
//     productName: name
//   }, (err, doc) => {
//     if (err) { // 报错
//       res.json({
//         status: '1',
//         mes: err.message,
//         result: ''
//       })
//     } else {
//       if (doc) {
//         res.json({
//           status: '2',
//           mes: '错误',
//           result: ''
//         })
//       } else {
//         Good.create({
//           productId: productId,
//           productName: name,
//           salePrice: price,
//           checked: checked,
//           productNum: num,
//           productImg:img,
         
//         }).then((data) => {}).catch((err) => {})
//         res.json({
//           status: '0',
//           mes: '',
//           result: 'suc'
//         })
//       }
//     }
//   })
// })

router.get('/getSpdata', function (req, res, next) {
  Good.find(function (err, doc) {
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
          result:doc
        })
      }
    }
  })
})


router.get('/spDel', function (req, res, next) {
  var id = String(req.param('id'));
  Good.remove({productId: id}, function (err) {
    if(err){
        console.error(err);
    }else{
        console.log('removed');
    }
})


})

// updateItem
router.get('/updateItem', function (req, res, next) {
  var id = String(req.param('id'));
  var name = String(req.param('name'));
  var num = parseInt(req.param('num'));
  var price = parseInt(req.param('price'));
  Good.update({productId: id}, {$set: {productName: name,salePrice:price,productNum:num}}, {multi: true}, function(err){
    if(err){
        console.error(err);
    }else{
        console.log("updated");
    }
  })
})




module.exports = router;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 图片上传限制解除
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goods = require('./routes/Goods');  // 加载Goods
var app = express();

app.use(bodyParser.json({"limit":"1000000kb"}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// 登录拦截--全局拦截
// app.use(function(req,res,next){
//   if(req.cookies.userId){  // cookies
//     //console.log(req.cookies.userId)
//     next()   // 如果检测到cookie为userId,那么就会往下运行--放行
//   }else{
//     //console.log(req.originalUrl)
//     //console.log(req.path)
//     if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){

//     //if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path=='/goods/list'){
//       next()
//     }else{
//       res.json({
//         status:'100',
//         mes:'',
//         result:''
//       })
//     }
//   }
// })
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goods);

// catch 404 and forward to error handler
// 错误处理，对404和500的拦截
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const express = require('express');
const chalk  = require('chalk');
const path = require('path');
const mount = require('./modules/router')
const bodyParser = require('body-parser');
const app = express();

// 设置跨域和相应数据格式
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
	res.header("Access-Control-Allow-Origin", allowOrigin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader('Content-Type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", 'Express');
	if (req.method == 'OPTIONS') {
    res.sendStatus(200);
	} else {
    next();
	}
});

// const MD5 = require('md5.js');
// console.log(new MD5().update('123456').digest('hex'), 'md5')

/**
 * 公共系统初始化
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// 初始化统一响应机制
var resextra = require('./modules/resextra');
app.use(resextra);

// 初始化数据库模块
let db = require('./modules/database');
db.initialize(app, (err, result)=> {
  if(err) console.log(err)
  console.log(result)
})

var managerService = require(path.join(process.cwd(),"services/ManagerService"));

// 初始化 后台登录 passport 策略
admin_passport = require('./modules/passport');
// 设置登录模块的登录函数衔接 passport 策略
admin_passport.setup(app,managerService.login);
// 设置 passport 登录入口点
app.use("/api/private/v1/login",admin_passport.login);
// // 设置 passport 验证路径
app.use("/api/private/v1/*",admin_passport.tokenAuth);

console.log(1);
console.log(2);

/**
 *
 * 初始化路由
 * 
 */
// 带路径的用法并且可以打印出路由表
mount(app, path.join(process.cwd(),"/routes"), true);

// 监听3006端口
app.listen(3006, ()=> {
  console.log(chalk.greenBright("服务器已启动,地址:") +  chalk.magentaBright('  localhost:3006'))

})
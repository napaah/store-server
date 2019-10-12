const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const jwt = require("jsonwebtoken");

const jwt_config = require("config").get("jwt_config");

module.exports.setup = (app, loginFn, cb)=> {
  // 用户名密码 登录策略
  passport.use(new LocalStrategy((username, password, done)=> {
    if(!loginFn) return done("登录函数未设置")

    loginFn(username, password, (err, user)=> {
      if(err) return done(err);
			return done(null, user);
    })
  }))

  // token 验证策略
  var jwtOptions = {}
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = jwt_config.get("secretKey");
  jwtOptions.expiresIn = jwt_config.get("expiresIn");
  passport.use(new JwtStrategy(jwtOptions, 

    function(jwt_payload, done) {
      // console.log('payload received', jwt_payload);
      // usually this would be a database call:
      // var user = users.find(user => user.id === jwt_payload.id);
      if (jwt_payload) {
        done(null, jwt_payload);
      } else {
        done(null, false);
      }
  }));
	// // 初始化passport模块
	app.use(passport.initialize());

	if(cb) cb();
}


/**
 * 登录验证逻辑
 * 
 * @param  {[type]}   req  请求
 * @param  {[type]}   res  响应
 * @param  {Function} next [description]
 */
module.exports.login = function(req,res,next) {

	passport.authenticate('local', function(err, user, info) {
		if(err) return res.sendResult(null,400,err);
    if(!user) return res.sendResult(null,400,"参数错误");
    
		// 获取角色信息
		var token = jwt.sign({"uid":user.id,"rid":user.rid}, jwt_config.get("secretKey"), {"expiresIn": jwt_config.get("expiresIn")});
		user.token = "Bearer " + token;
		return res.sendResult(user,200,'登录成功');
	})(req, res, next);
	
}


/**
 * token验证函数
 * 
 * @param  {[type]}   req  请求对象 
 * @param  {[type]}   res  响应对象
 * @param  {Function} next 传递事件函数
 */
module.exports.tokenAuth = function(req,res,next) {
	passport.authenticate('jwt', { session: false },function(err,tokenData) {
		if(err) return res.sendResult(null,400,err);
		if(!tokenData) return res.sendResult(null,400,'无效token');
		req.userInfo = {};
		req.userInfo.uid = tokenData["uid"];
		req.userInfo.rid = tokenData["rid"];
		next();
	})(req, res, next);
}
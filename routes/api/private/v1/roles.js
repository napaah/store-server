var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

// 角色管理模块
var roleServ = authorization.getService("RoleService");

// 获取角色列表
router.get("/",
	// 参数验证
	function(req,res,next){
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		roleServ.getAllRoles(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取成功");
		})(req,res,next);
	}
);
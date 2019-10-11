const express = require('express');
const router = express.Router()
const path = require('path');

// 获取验证模块
var authorization = require(path.join(process.cwd(),"/modules/authorization"));

// 通过验证模块获取用户管理服务
var mgrServ = authorization.getService("ManagerService");
// 查询用户列表
router.get("/",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
    if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		mgrServ.getAllManagers(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取管理员列表成功");
			}
		)(req,res,next);
		
	}
);

module.exports = router;


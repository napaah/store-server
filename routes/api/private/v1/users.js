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


// 创建用户
router.post("/",
	// 验证参数
	function(req,res,next) {
		if(!req.body.username){
			return res.sendResult(null,400,"用户名不能为空");
		}
		if(!req.body.password) {
			return res.sendResult(null,400,"密码不能为空");
		}
		if(!req.body.rid) {
			req.body.rid = -1;
			//return res.sendResult(null,200,"角色ID不能为空");
		}
		if(isNaN(parseInt(req.body.rid))) req.body.rid = -1;//return res.sendResult(null,200,"角色ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"username":req.body.username,
			"password":req.body.password,
			"mobile":req.body.mobile,
			"email":req.body.email,
			"rid":req.body.rid
		}
		mgrServ.createManager(params,function(err,manager){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(manager,201,"创建成功");
		})(req,res,next);
	}
);


// 删除用户
router.delete('/:id', 
	(req,res,next)=> {
		if(!req.params.id) return res.sendResult(null,400,"用户ID不能为空");
		// if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"ID必须是数字");
		next();
	},
	(req, res, next)=> {
		mgrServ.deleteManager({mg_id: req.params.id},(err, manager)=>{
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除成功");
		})(req, res, next)
	}
)


// 修改用户
router.put('/', 
	(req,res,next)=> {
		if(!req.body.id) return res.sendResult(null,400,"用户ID不能为空");
		// if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"ID必须是数字");
		next();
	},
	(req, res, next)=> {
		let idObj = {
			mg_id: req.body.id
		}
		let paramsObj = {
			"mg_mobile":req.body.mobile,
			"mg_email":req.body.email
		}
		mgrServ.updateManager(idObj, paramsObj,(err, manager)=>{
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"修改成功");
		})(req, res, next)
	}
)

// 修改用户状态
router.put("/state",
	// 参数验证
	function(req,res,next) {
		if(!req.body.id) {
			return res.sendResult(null,400,"用户ID不能为空");
		}

		// if(!req.body.state) {
		// return res.sendResult(null,400,"状态不能为空");
		// }

		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		
		state = 0
		if(req.body.state && req.body.state == true) state = 1
		let idObj = {
			mg_id: req.body.id
		};
		
		let paramsObj = {
			mg_state: state
		}
		mgrServ.updateMgrState(idObj,paramsObj,function(err,manager){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(manager,200,"设置状态成功");
		})(req,res,next);
	}
)


// 修改用户状态
router.put("/role",
	// 参数验证
	function(req,res,next) {
		if(!req.body.id) {
			return res.sendResult(null,400,"用户ID不能为空");
		}

		 if(!req.body.roleId) {
		 	return res.sendResult(null,400,"状态不能为空");
		 }

		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		
		let idObj = {
			mg_id: req.body.id
		};
		
		let paramsObj = {
			role_id: req.body.roleId
		}
		mgrServ.updateMgrState(idObj,paramsObj,function(err,manager){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(manager,200,"修改角色成功");
		})(req,res,next);
	}
)

module.exports = router;


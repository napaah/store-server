var path = require("path");
var managersDAO = require(path.join(process.cwd(),"dao/managerDAO"));
let db = require(path.join(process.cwd(),"modules/database")); 


/**
 * 创建管理员
 * 
 * @param  {[type]}   user 用户数据集
 * @param  {Function} cb   回调函数
 */
module.exports.createManager = function(params,cb) {

	// managersDAO.exists(params.username,function(err,isExists){
	// 	if(err) return cb(err);

	// 	if(isExists) {
	// 		return cb("用户名已存在");
	// 	}

		managersDAO.create({
			"mg_id": db.generateId(),
			"mg_name":params.username,
			"mg_pwd":params.password,
			"mg_mobile":params.mobile,
			"mg_email":params.email,
      "role_id":params.rid,
      "mg_state": params.state
		},function(err,manager){
			if(err) return cb("创建失败");
			result = {
				"id" : manager.mg_id,
				"username" : manager.mg_name,
				"mobile" : manager.mg_mobile,
				"email" : manager.mg_email,
				"role_id" : manager.role_id,
				"create_time":manager.mg_time
			};
			cb(null,result);
		});
	// });
}


/**
 * 获取所有管理员
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */
module.exports.getAllManagers = function(conditions,cb) {

	managersDAO.getAllManagers(conditions, (err, managers)=> {
		let {count, pagenum, rows} = managers;
		var retManagers = [];
		for(idx in rows) {
			var manager = rows[idx];
			var role_name = manager.role_name;
			if(!manager.role_id) {
				role_name = "超级管理员"
			}
			retManagers.push({
				"id": manager.mg_id,
				"username":manager.mg_name,
				"createTime":manager.createdAt,
				"updatedTime":manager.updatedAt,
				"mobile":manager.mg_mobile,
				"email":manager.mg_email,
				"mg_state":manager.mg_state == 1
			});
		}
		var resultDta = {};
		resultDta["total"] = count;
		resultDta["pagenum"] = pagenum;
		resultDta["users"] = retManagers;
		cb(err,resultDta);
	})


	// 	managersDAO.findByKey(key,offset,limit,function(err,managers){
			
	// 	});
	// });
}

/**
 * 管理员登录
 * @param  {[type]}   username 用户名
 * @param  {[type]}   password 密码
 * @param  {Function} cb       回调
 */
module.exports.login = function(username,password,cb) {
	// logger.debug('login => username:%s,password:%s',username,password);
  // logger.debug(username);
	managersDAO.findOne({"mg_name":username},function(err,manager) {
    // logger.debug(err);	
		if(err || !manager) return cb("用户名不存在");
		if(manager.role_id < 0) {
			return cb("该用户没有权限登录");
		}

		if(manager.role_id != 0 && manager.mg_state != 1) {
			return cb("该用户已经被禁用");
    }
    // return 
		if(password == manager.mg_pwd){
			cb(
				null,
				{
					"id":manager.mg_id,
					"rid":manager.role_id,
					"username":manager.mg_name,
					"mobile":manager.mg_mobile,
					"email":manager.mg_email,
				}
			);
		} else {
			return cb("密码错误");
		}
	});
}
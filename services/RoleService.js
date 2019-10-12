var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var permissionAPIDAO = require(path.join(process.cwd(),"dao/PermissionAPIDAO"));


/**
 * 获取所有用户的角色 & 权限
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.getAllRoles = function(cb) {
	dao.list("RoleModel",null,function(err,roles) {
		if(err) return cb("获取角色数据失败");
		permissionAPIDAO.list(function(err,permissions){
			if(err) return cb("获取权限数据失败");
			var permissionKeys = _.keyBy(permissions,'ps_id');
			var rolesResult = [];
			for(idx in roles) {
				role = roles[idx];
				permissionIds = role.ps_ids.split(",");
				roleResult = {
					"id" : role.role_id,
					"roleName" : role.role_name,
					"roleDesc" : role.role_desc,
					"children" : []
				};

				
				roleResult.children = _.values(getPermissionsResult(permissionKeys,permissionIds));

				rolesResult.push(roleResult);
			}

			cb(null,rolesResult);

		});
		
	});
}


/**
 * 权限验证函数
 * 
 * @param  {[type]}   rid         角色ID
 * @param  {[type]}   serviceName 服务名
 * @param  {[type]}   actionName  动作名（方法）
 * @param  {Function} cb          回调函数
 */
module.exports.authRight = function(rid,serviceName,actionName,cb) {
	permissionAPIDAO.authRight(rid,serviceName,actionName,function(err,pass) {
		cb(err,pass);
	});
}
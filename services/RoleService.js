var path = require("path");
const _ = require('lodash');
var dao = require(path.join(process.cwd(),"dao/DAO"));
var permissionAPIDAO = require(path.join(process.cwd(),"dao/PermissionAPIDAO"));


/**
 * 获取所有用户的角色 & 权限
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.getAllRoles = function(cb) {
	dao.findAll("RoleModel",true,function(err,roles) {
		
		if(err) return cb("获取角色数据失败");
		permissionAPIDAO.findAllList(function(err,permissions){
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

// 处理数据
function getPermissionsResult(permissionKeys,permissionIds) {
	var permissionsResult = {};

	// 处理一级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;

		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];

		if(permission && permission.ps_level == 0) {
			permissionsResult[permission.ps_id] = {
				"id":permission.ps_id,
				"authName":permission.ps_name,
				"path":permission.ps_api_path,
				"children":[]
			};
		}
	}

	// 临时存储二级返回结果
	tmpResult = {};
	// 处理二级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;
		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];
		if(permission && permission.ps_level == 1) {
			parentPermissionResult = permissionsResult[permission.ps_pid];
			if(parentPermissionResult) {
				tmpResult[permission.ps_id] = {
					"id":permission.ps_id,
					"authName":permission.ps_name,
					"path":permission.ps_api_path,
					"children":[]
				}
				parentPermissionResult.children.push(tmpResult[permission.ps_id]);
			}
		}
	}

	// 处理三级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;
		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];
		if(permission && permission.ps_level == 2) {

			parentPermissionResult = tmpResult[permission.ps_pid];

			if(parentPermissionResult) {
				
				parentPermissionResult.children.push({
					"id":permission.ps_id,
					"authName":permission.ps_name,
					"path":permission.ps_api_path
				});
			}
		}
	}
	return permissionsResult;
}
const path = require('path');
const daoModule = require("./DAO");


/**
 * 获取权限列表
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.findAllList = async (cb)=> {
  const PermissionModel = require(path.join(process.cwd(),"models/PermissionModel"));
  const PermissionApiModel = require(path.join(process.cwd(),"models/PermissionApiModel"));
  
  // 表与表根据ps_id关联查询
  PermissionModel.belongsTo(PermissionApiModel, { foreignKey: 'ps_id', targetKey: 'ps_id'});

  
  try {
    let result = await PermissionModel.findAll({
      // where: criteria, // 这里传入的是一个查询对象，因为我的查询条件是动态的，所以前面构建好后才传入，而不是写死
      // offset: start, // 前端分页组件传来的起始偏移量
      // limit: Number(pageSize), // 前端分页组件传来的一页显示多少条
      include: [{ // include关键字表示关联查询
          model: PermissionApiModel, // 指定关联的model
          attributes: [['ps_api_path','path'], ['ps_api_order', 'order']], // 这里的attributes属性表示查询class表的name和rank字段，其中对name字段起了别名className
          // attributes: { exclude: ['createdAt', 'updatedAt', 'version'] } // 这里的attributes属性表示排除指定的字段
      }],
      raw:true // 这个属性表示开启原生查询，原生查询支持的功能更多，自定义更强
    })
    cb(null, result)
  } catch (error) {
    console.log(error,'error')
    cb(error)
  }
}


/**
 * 权限验证
 * 
 * @param  {[type]}   rid         角色ID
 * @param  {[type]}   serviceName 服务名
 * @param  {[type]}   actionName  动作名
 * @param  {Function} cb          回调函数
 */
module.exports.authRight = function(rid,serviceName,actionName,cb) {
	
	// 超级管理员
	if(rid == 0) return cb(null,true);

	// 权限验证
	daoModule.findOne("PermissionAPIModel",{"ps_api_service":serviceName,"ps_api_action":actionName},function(err,permissionAPI){
		console.log("rid => %s,serviceName => %s,actionName => %s",rid,serviceName,actionName);
		if(err || !permissionAPI) return cb("无权限访问",false);
		
		daoModule.findOne("RoleModel",{"role_id":rid},function(err,role){
			if(err || !role) return cb("获取角色信息失败",false);
			ps_ids = role.ps_ids.split(",");
			for(idx in ps_ids) {
				ps_id = ps_ids[idx];
				if(parseInt(permissionAPI.ps_id) == parseInt(ps_id)) {
					return cb(null,true);
				}
			}
			return cb("无权限访问",false);
		});
	});
}
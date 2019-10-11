const path = require('path');
const daoModule = require('./DAO');


/**
 * 创建管理员
 * 
 * @param  {[type]}   obj 管理员信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("ManagerModel",obj,cb);
}


/**
 * 通过查询条件获取所有管理员
 * 
 * @param  {[type]}   conditions 管理员信息
 * @param  {Function} cb  回调函数
 */
module.exports.getAllManagers = function(conditions,cb) {
	daoModule.findAndCountAll("ManagerModel",conditions,cb);
}


/**
 * 通过查询条件获取管理员对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("ManagerModel",conditions,cb);
}
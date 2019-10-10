var path = require("path");

// 获取数据库模型
const db = require(path.join(process.cwd(),"modules/database")); 


/**
 * 创建对象数据
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   obj       模型对象
 * @param  {Function} cb        回调函数
 */
module.exports.create = async function(modelName,obj,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

  if(!obj) return  cb("条件为空",null);

  try {
    let result = await Model.create(obj)
    cb(null, result)
  } catch (error) {
    cb(error)
  }
}

/**
*	@method				function
*	@param		[Type]		modelName 模型名称		
*	@param		[Type]		arr       模型数组对象
*	@param		[Type]		cb       回调函数
*	@Description		批量创建并插入多个实例。
*/
module.exports.bulkCreate = async (modelName,arr,cb)=> {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

  if(!arr) return  cb("条件为空",null);

  try {
    let result = await Model.bulkCreate(arr)
    cb(null, result)
  } catch (error) {
    cb(error)
  }
}


/**
 * 获取一条数据
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = async function(modelName,conditions,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!conditions) return  cb("条件为空",null);
  
  try {
    const result = await Model.findOne({
      where: conditions
    })
    cb(null, result)
  } catch (error) {
    console.log(error)
    cb(error)
  }

}


/**
 * 删除一条数据
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.destroy = async function(modelName,conditions,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!conditions) return  cb("条件为空",null);
  try {
    const result = await Model.destroy({
      where: conditions
    })
    cb(null, result)
  } catch (error) {
    cb(error)
  }

}


/**
 * 更新一条数据
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.update = async function(modelName,conditions,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!conditions) return  cb("条件为空",null);
  try {
    const result = await Model.update(conditions)
    cb(null, result)
  } catch (error) {
    cb(error)
  }

}
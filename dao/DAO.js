var path = require("path");

// 获取数据库模型
const db = require(path.join(process.cwd(),"modules/database")); 
const Op = db.Op;

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
 * 获取所有数据
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.findAll = async function(modelName,conditions,cb) {
  
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!conditions) return  cb("条件为空",null);
  
  try {
    const result = await Model.findAll({
      // offset: start, // 前端分页组件传来的起始偏移量
      // limit: Number(pageSize), // 前端分页组件传来的一页显示多少条
    })
    cb(null, result)
  } catch (error) {
    console.log(error)
    cb(error)
  }

}


/**
 * 获取数据数量
 * 分页
 * 模糊查询
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.findAndCountAll = async function(modelName,conditions,cb) {
  if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
  const { query = '', pagesize, pagenum } = conditions
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!conditions) return  cb("条件为空",null);
  
  try {
    let result = {}
      result = await Model.findAndCountAll({
        offset: pagesize * (pagenum-1), // 前端分页组件传来的起始偏移量
        limit: Number(pagesize),        // 前端分页组件传来的一页显示多少条
        // order: [                     // 根据创建时间进行排序
        //   ['createdAt', 'DESC'],
        // ],
        where: {
          'mg_name': {
            [Op.like]: `%${query}%`
          }
          
        }
      })
    // console.log(result.rows[0].mg_name,'result')
    result.pagenum = pagenum
    result.pagesize = pagesize
    cb(null, result)
  } catch (error) {
    console.log(error)
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
 * @param  {[数组]}   idObj      id对象
 * @param  {Function} cb         回调函数
 */
module.exports.destroy = async function(modelName,idObj,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);
	if(!idObj) return  cb("条件为空",null);
  try {
    const result = await Model.destroy({
      where: idObj
    })
    cb(null, result)
  } catch (error) {
    console.log(error,'error')
    cb(error)
  }

}


/**
 * 更新一条数据
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   paramsObj  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.update = async function(modelName,idObj,paramsObj,cb) {
  const Model = require(path.join(process.cwd(),"models/") + modelName)
	if(!Model) return cb(Model+ "模型不存在",null);

	if(!idObj) return  cb("id不能为空",null);
	if(!paramsObj) return  cb("条件为空",null);
  try {
    paramsObj.updatedAt = '';
    paramsObj.version   = '';
    const result = await Model.update(paramsObj,{
        where: idObj
      }
    )
    console.log(idObj, 'idObj');
    console.log(paramsObj, 'paramsObj');
    console.log(result, 'result');
    
    cb(null, result)
  } catch (error) {
    console.log(error,'error')
    cb(error)
  }

}
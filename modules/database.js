const Sequelize = require('sequelize');
const uuidv1 = require('uuid/v1');
const path = require('path');
const fs = require('fs');
const Op = Sequelize.Op;
// 获取连接数据库配置
const config = require('config').get('db_config')
let { database, user, password, host, dialect, pool } = config;

// 连接数据库
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect,
  pool,
  define: {
    timestamps: false
  }
})

const ID_TYPE = Sequelize.STRING(50);

// 生成ID
function generateId() {
  return uuidv1().split('-').join('');
}

// 
function initialize(app,callback) {

  sequelize
  .authenticate()
  .then(() => {
    // 获取映射文件路径
    callback(null, "连接数据库成功")
    var modelsPath = path.join(process.cwd(),"/models");
    let files = fs.readdirSync(modelsPath);

    let js_files = files.filter((f)=>{
        return f.endsWith('.js');
    }, files);

    for (let f of js_files) {
      console.log(`import model from file ${f}...`);
      let name = f.substring(0, f.length - 3);
      module.exports[name] = require(path.join(process.cwd(),"models/") + f);
  }
    sequelize.sync();
  })
  .catch(err => {
    callback(err, "连接数据库失败")
  });
  // return 
    

}

// 定义公共model规范
function defineModel(name, attributes) {
  var attrs = {};
  for (let key in attributes) {
      let value = attributes[key];
      if (typeof value === 'object' && value['type']) {
          value.allowNull = value.allowNull || false;
          attrs[key] = value;
      } else {
          attrs[key] = {
              type: value,
              allowNull: false
          };
      }
  }
  attrs.createdAt = {
      type: Sequelize.BIGINT,
      allowNull: true
  };
  attrs.updatedAt = {
      type: Sequelize.BIGINT,
      allowNull: true
  };
  attrs.version = {
      type: Sequelize.BIGINT,
      allowNull: true
  };
  return sequelize.define(name, attrs, {
      tableName: name,
      timestamps: false,
      hooks: {
        beforeValidate: function (obj, options) {
          let now = Date.now();
          if (options.returning) {  // 判断是否是新纪录
            
            // if (!obj.mg_id) {
            //   obj.mg_id = generateId();
            // }
            obj.createdAt = now;
            obj.updatedAt = now;
            obj.version = 0;
          } else {
            
            obj.updatedAt = Date.now();
            obj.version++;
          }
        }
      }
  });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    defineModel: defineModel,
    initialize: initialize,
    // sync: () => {
    //     // only allow create ddl in non-production environment:
    //     if (process.env.NODE_ENV !== 'production') {
    //         sequelize.sync({ force: true });
    //     } else {
    //         throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    //     }
    // }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.Op = Op;
exp.generateId = generateId;

module.exports = exp;

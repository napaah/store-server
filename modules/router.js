const path = require('path');
var requireDirectory = require('require-directory');
var routes = requireDirectory(module);


function mount(app) {
  let r = arguments[1] || routes;
  // console.log(r, 'r')
  let pre = arguments[2] || '';
  for (const k in r) {
    var file = '/' + pre + '' + k + '.js';
    var path = '';
      // 如果目录是对象 递归遍历
    if(typeof r[k] == 'object') {
      mount(app, r[k], pre + k + '/')
    }else if( k == "index") {
      path = '/'+ pre;
      _use(app, file, path, r[k])
    }else {
      path = '/' + pre + '' + k;
      _use(app, file, path, r[k]);
    }
      
  }
}
function _use(app, file, path, handler) {
  // console.log(handler.stack)
  app.use(path, handler);
  return
  _track_routes(file, path, handler.stack);
}


/**
 * Mount routes with directory.
 *
 * Examples:
 *
 *     // mount routes in app.js
 *     mount(app, 'routes2', true);
 *
 * @param {Object} app
 * @param {String} routes_folder_path
 * @param {Boolean} is_debug
 * @return 
 */
function mount_with_folder(app, routes_folder_path) {
  let r      = arguments[1] || './routes';
  let is_bug = arguments[2] || false;
  /* 
    path.resolove :  从后向前，若字符以 / 开头，不会拼接到前面的路径(因为拼接到此已经是一个绝对路径)；若以 ../ 开头，拼接前面的路径，且不含最后一节路径；若以 ./ 开头 或者没有符号 则拼接前面路径；

    path.dirname :  返回path的目录名
    
    require.main.filename :  用node命令启动的module的filename
  */

  r = path.resolve(path.dirname(require.main.filename), r)
  routes = requireDirectory(module, r);
  mount(app);
}
module.exports = mount_with_folder
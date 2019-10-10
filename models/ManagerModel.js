const path = require('path');
let db = require(path.join(process.cwd(),"modules/database")); 

module.exports = db.defineModel('sp_manager', {
    mg_id : {type: db.ID, primaryKey: true},
		mg_name : {type: db.STRING, allowNull: false},
		mg_pwd : {type: db.STRING, allowNull: false},
		role_id : {type: db.INTEGER},
		mg_mobile : {type: db.STRING},
		mg_email : {type: db.STRING},
		mg_state : {type: db.INTEGER},
  }, {
    // options
});

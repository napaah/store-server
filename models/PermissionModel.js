const path = require('path');
let db = require(path.join(process.cwd(),"modules/database")); 

module.exports = db.defineModel('sp_permission', {
    ps_id : {type: db.ID, primaryKey: true, },
		ps_name : {type: db.STRING},
		ps_pid : {type: db.INTEGER},
		ps_c : {type: db.STRING},
		ps_a : {type: db.STRING},
		ps_level : {type: db.STRING},
  }, {
    // options
});

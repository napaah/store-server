const path = require('path');
let db = require(path.join(process.cwd(),"modules/database")); 

module.exports = db.defineModel('sp_permission_api', {
    id : {type: db.ID, primaryKey: true, },
		ps_id : {type: db.STRING},
		ps_api_service : {type: db.INTEGER},
		ps_api_action : {type: db.STRING},
		ps_api_path : {type: db.STRING},
		ps_api_order : {type: db.BIGINT},
  }, {
    // options
});

const path = require('path');
let db = require(path.join(process.cwd(),"modules/database")); 

module.exports = db.defineModel('sp_role', {
    role_id : {type: db.ID, primaryKey: true},
    role_name : {type: db.STRING},
    ps_ids : {type: db.STRING},
    ps_ca : {type: db.STRING},
    role_desc : {type: db.STRING}
  }, {
    // options
});

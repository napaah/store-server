module.exports = (req, res, next)=> {
  res.sendResult = (data, code, message)=> {
    var fmt = req.query.fmt ? req.query.fmt : "rest";
		if(fmt == "rest") {
			res.json(
			{
				"data" : data, 
				"meta" : {
					"msg" 		: message,
					"status" 	: code
				}
			});
		}
  },
  next()
}
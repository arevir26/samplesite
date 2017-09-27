var variable_initializer = function(req,res,next){
	req.arevir = {};
	req.arevir.page = {};
	req.arevir.page.title = "Movie Site";
	req.arevir.page.result = {};
	req.arevir.errors = {};
	req.arevir.success = {};
	req.arevir.dbresult = {};
	req.arevir.page.host = "http://localhost:3000";
	next();
}

module.exports = variable_initializer;
var variable_initializer = function(req,res,next){
	req.arevir = {};
	req.arevir.page = {};
	req.arevir.page.title = "Movie Site";
	req.arevir.page.result = {};
	req.arevir.errors = {};
	req.arevir.success = {};
	req.arevir.dbresult = {};
	req.arevir.page.host = "http://movies.arevir.net:3000";
	req.arevir.page.remove_enabled = false;//Enabled deletion of movie
	req.arevir.page.modify_enabled = false;//Enabled modifying movie informantion

	next();
}

module.exports = variable_initializer;
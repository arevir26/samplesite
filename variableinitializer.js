var variable_initializer = function(req,res,next){
	req.arevir = {};
	req.arevir.page = {};
	req.arevir.page.title = "Movie Site";
	next();
}

module.exports = variable_initializer;
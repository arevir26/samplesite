var variable_initializer = function(req,res,next){
	req.arevir = {};
	req.arevir.page = {};
	req.arevir.page.title = "Movie Site";
	console.log(req.arevir);
	next();
}

module.exports = variable_initializer;
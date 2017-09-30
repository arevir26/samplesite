var checkSession = {}


checkSession.isLoggedIn = function(req,res,next){
	if(req.session.isAdmin){
		req.arevir.page.remove_enabled = true;
		req.arevir.page.modify_enabled = true;
	}else{
		req.arevir.page.remove_enabled = false;
		req.arevir.page.modify_enabled = false;
	}
	next();
}

checkSession.logOut = function(req,res,next){
	req.session.destroy(function(err){

	});
	next();
}

checkSession.logIn = function(username,password){
	return function(req,res,next){
		req.body.username = (req.body.username)?req.body.username : "";
		req.body.password = (req.body.password)?req.body.password : "";
		req.sanitizeBody("username").trim();
		req.sanitizeBody("password").trim();
		username = (username) ? username : "admin";
		password = (password) ? password : "root";

		if(req.body.username===username&&req.body.password===password){
			req.session.isAdmin = true;
			console.log("login success");
		}else{req.session.isAdmin = false;console.log("login failed");};
		next();
	}
}

checkSession.restricted = function(req,res,next){
	console.log(req.session.isAdmin);
	if(!req.session.isAdmin){
		res.redirect(req.arevir.page.host+'/admin/login');		
	}else{next();}
}





module.exports = checkSession;
var express = require("express");
var checkSession = require('./include/checkSession');
var router = express.Router();


router.get('/login',function(req,res,next) {
	if(req.session.isAdmin){
		res.redirect(req.arevir.page.host);
	}else{
		res.render('login',req.arevir.page);
	}
});

router.post('/login',
	checkSession.logIn("Ryan","Joseph"),
	function(req,res,next){
		res.redirect('/admin/login');
		
});

router.get('/logout',
	checkSession.logOut,
	function(req,res,next){
		if(req.header('Referer')){
			res.redirect(req.header('Referer'));
		}else{
		res.redirect(req.arevir.page.host);
	}
	}
	);


module.exports = router;
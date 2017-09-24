var express = require('express');

var router = express.Router();

router.get('/',function(req,res,next){
	req.arevir.page.categorylist = [];
	res.render('categoryadd',req.arevir.page);
})

module.exports = router;
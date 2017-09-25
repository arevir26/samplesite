var express = require('express');

var router = express.Router();
var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";

router.get('/',
	database.connect(dbname),
	database.getCategories,
	function(req,res,next){
	req.arevir.page.categorylist = req.sqlitedb.result;
	res.render('categoryadd',req.arevir.page);
});

router.post('/',
	database.connect(dbname),
	function(req,res,next){
		req.sanitizeBody('category_name').trim();
		req.checkBody('category_name','Empty').notEmpty();
		if(!req.validationErrors()){
			var addcat = database.addCategory(req.body.category_name);
			addcat(req,res,next);
		}else{next();};
	},
	function(req,res,next){

		res.redirect('/category');
	}
	);

router.get('/remove/:category_id',
	database.connect(dbname),
	function(req,res,next){
		var removecat = database.deleteCategory(req.params.category_id);
		removecat(req,res,next);
	},
	function(req,res){
		res.redirect('/category');
	}
	);

module.exports = router;
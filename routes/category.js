var express = require('express');

var router = express.Router();
var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";

router.get('/',
	database.connect(dbname),
	database.getCategories,
	function(req,res,next){
	req.arevir.page.categorylist = req.arevir.page.result.categorylist;
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

router.get('/rename/:category_id',
	database.connect(dbname),
	database.getCategories,
	function(req,res,next){
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		req.arevir.page.renamecat_id = req.params.category_id;
		req.arevir.page.renamecat_name = "";
		req.arevir.page.categorylist.forEach((category)=>{
			if(category.category_id == req.params.category_id){
				req.arevir.page.renamecat_name = category.category_name;
			}
		});
		res.render('categoryrename',req.arevir.page);
	}
);

router.post('/rename/:category_id',
	database.connect(dbname),
	function(req,res,next){
		req.sanitizeBody('category_name').trim();
		req.checkBody('category_name','Category Empty').notEmpty();
		if(!req.validationErrors()){
			var rename = database.renameCategory(req.params.category_id,req.body.category_name);
			rename(req,res,next);
		}else{next();}
	},
	function(req,res,next){
		res.redirect('/category');
	}
);

module.exports = router;
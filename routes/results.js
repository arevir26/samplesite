var express = require('express');

var router = express.Router();
var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";

router.get('/',
	database.connect(dbname),
	database.getCategories,
	database.getMovies({limit:9,offset:0,sort:{field:"movie_name",ascending:true},category:'Action'}),
	(req,res,next)=>{
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		res.render('result',req.arevir.page);
	}
);

router.get('/:category/:offset',
	database.connect(dbname),
	database.getCategories,
	(req,res,next)=>{
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		res.render('result',req.arevir.page);
	}
);







module.exports = router;
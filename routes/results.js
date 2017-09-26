var express = require('express');

var router = express.Router();
var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";
var default_path = "all/1/asc";



router.get('/',
	(req,res,next)=>{
		res.redirect(default_path);
	}
);

router.get('/:category/:page/:order',
	database.connect(dbname),
	database.getMoviesParams,
	database.getCategories,
	database.getMovies,
	(req,res,next)=>{
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		req.arevir.page.movielist = req.arevir.dbresult.movies;
		req.arevir.page.links = {};
		req.arevir.page.links.page = req.params.page;
		req.arevir.page.links.order = req.params.order;
		req.arevir.page.title = "List of Movies";
		res.render('result',req.arevir.page);
	}
);







module.exports = router;
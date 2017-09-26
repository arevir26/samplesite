var express = require('express');

var router = express.Router();

var database = require('../SqliteDatabase');
var movieclass = require('./include/movie_class');

var dbname = "webdb.sqlite3";


router.get('/',
	database.connect(dbname),
	database.getCategories,
	database.test,
	function(req,res,next){
		req.arevir.page.message = (req.query.message)?req.query.message:"";
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		res.render('movieadd',req.arevir.page);
	}
);

router.post('/',
	database.connect(dbname),
	database.addMovie,
	function(req,res,next){
		console.log(req.arevir.dbresult.movieitem);
		res.redirect('/moviepanel');
	}
);


module.exports = router;

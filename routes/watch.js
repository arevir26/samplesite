var express = require('express');
var fs = require('fs');

var router = express.Router();

var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";

router.get('/',

	function(req,res,next) {
		res.render('watch');

	}

);

router.get('/:movieid',
	database.connect(dbname),
	database.getMovie,
	function(req,res,next) {
		req.arevir.page.movie = req.arevir.dbresult.movie;
		if(true){
			var subtitle = req.arevir.page.movie.url;
			var extindex = subtitle.lastIndexOf(".");
			subtitle = subtitle.slice(0,extindex);
			subtitle+=".vtt";
			req.arevir.page.movie.subtitle = subtitle;

		}
		res.render('watch',req.arevir.page);
	}

);







module.exports = router;
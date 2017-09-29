var express = require('express');

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
		res.render('watch',req.arevir.page);
	}

);







module.exports = router;
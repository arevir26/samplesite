var express = require('express');

var router = express.Router();

var database = require('../SqliteDatabase');
var movieclass = require('./include/movie_class');
var checkSession = require('./include/checkSession');

var dbname = "webdb.sqlite3";


router.get('/',
	checkSession.restricted,
	database.connect(dbname),
	database.getCategories,
	//database.test,
	function(req,res,next){
		req.arevir.page.message = (req.query.message)?req.query.message:"";
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		res.render('movieadd',req.arevir.page);
	}
);

router.post('/',
	checkSession.restricted,
	database.connect(dbname),
	database.addMovie,
	function(req,res,next){
		console.log(req.arevir.dbresult.movieitem);
		res.redirect('/moviepanel');
	}
);

router.get('/remove/:movieid',
	checkSession.restricted,
	database.connect(dbname),
	database.removeMovie,
	function(req,res,next){
		var backurl = req.header('Referer');
		res.redirect(backurl);
	}
	);

router.post('/modify/:movieid',
	checkSession.restricted,
	database.connect(dbname),
	database.modifyMovie,
	function(req,res,next){
		console.log(req.body);
		var backurl = req.header('Referer');
		res.redirect(backurl);
	});

router.get('/test',
	database.connect(dbname),
	database.modifyMovie,
	function(req,res,next){
		var backurl = req.header('Referer');
		console.log(error);
	}
)


module.exports = router;

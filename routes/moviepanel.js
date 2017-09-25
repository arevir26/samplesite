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
		req.arevir.page.categorylist = req.sqlitedb.result;
		res.render('movieadd',req.arevir.page);
	}
);

router.post('/',
	database.connect(dbname),
	function(req,res,next){
		var movie_item = new movieclass();
		movie_item.update = false;
		movie_item.movie_name = req.body.movie_name;
		movie_item.released = parseInt(req.body.movie_released);
		movie_item.description = req.body.description;
		movie_item.url = req.body.movie_url;
		movie_item.categories = [];
		if(typeof(req.body.movie_category)==="string"){
			movie_item.categories.push(req.body.movie_category);
		}else{
			movie_item.categories = req.body.movie_category;
		}
		req.arevir.movieitem = movie_item;
		var addmovie = database.addMovie(movie_item);
		addmovie(req,res,next);
	},
	database.getMovieId,
	database.addToLookUp(),
	function(req,res,next){
		res.redirect('/moviepanel');
	}
);


module.exports = router;

var express = require('express');

var router = express.Router();
var database = require('../SqliteDatabase');
var dbname = "webdb.sqlite3";
var default_path = "all/1/asc";


var pagination = function(req,res,next){
	//var totalpages = Math.floor(req.arevir.dbresult.totalmovies/req.arevir.dbresult.movies.length);
	
	var total = req.arevir.dbresult.movies.length;
	var limit = 9;
	var pagination = [];
	var pagelink = function(name,pagenum){
		var newlink = `${req.arevir.page.host}/movies/${req.params.category}/${pagenum}/${req.params.order}`;
		return {pagename:name,link:newlink};
	};
	var pagenum = parseInt(req.params.page);
	var totalpages = 0;
	//dummy
	if(total!=0){
		totalpages = Math.floor(total/limit);
		if((total%limit)>0){
			totalpages++;
		};
		
		var currentpage = parseInt(req.params.page);

		//add 2 page before current page
		if((pagenum-1)>0 && pagenum<totalpages){
			pagination.push(pagelink("Previous", pagenum-2));
		}

		//add 2 page before current page
		if((pagenum-2)>0 && pagenum<totalpages){
			pagination.push(pagelink(`${pagenum-2}`,pagenum-2));
		}

		//add 1 page before current page
		if((pagenum-1)>0 && pagenum<totalpages){
			pagination.push(pagelink(`${pagenum-1}`,pagenum-1));
		}

		//add current page
		if(pagenum<=totalpages){
			pagination.push(pagelink(`${pagenum}`,pagenum));
		}
		
	
		//add  1 page ahead current page
		if((pagenum+1)<totalpages){
			pagination.push(pagelink(`${pagenum+1}`,pagenum+1));
		}

		//add 2 page ahead current page
		if((pagenum+2)<totalpages){
			pagination.push(pagelink(`${pagenum+2}`,pagenum+2));
		}

		//adding "Next" in pagination
		if(pagenum < totalpages){
			pagination.push(pagelink("Next",pagenum+1));
		}
	
	}
	req.arevir.page.pagination = pagination;
	next();
}


router.get('/',
	(req,res,next)=>{
		res.redirect(default_path);
	}
);

// todo make sure page is a number only
router.get('/:category/:page/:order',
	database.connect(dbname),
	database.getMoviesParams,
	database.getCategories,
	database.getMovies,
	pagination,
	(req,res,next)=>{
		req.arevir.page.categorylist = req.arevir.page.result.categorylist;
		req.arevir.page.movielist = req.arevir.dbresult.movies;
		req.arevir.page.links = {};
		req.arevir.page.links.page = req.params.page;
		req.arevir.page.links.order = req.params.order;
		req.arevir.page.title = "List of Movies";
		req.arevir.page.totalresult = req.arevir.dbresult.totalmovies;
		req.arevir.page.page_category = req.params.category;
		req.arevir.page.order = req.params.order;
		res.render('result',req.arevir.page);
	}
);

router.get('/all/1/:order',
	(req,res,next)=>{
		res.redirect(`all/1/${req.params.order}`);
	}
	);







module.exports = router;
var sqlite3 = require('sqlite3');
var movie = require('./routes/include/movie_class');

var database = {};

database.connect = function(dbname){

	return function(req,res,next){
		req.sqlitedb = new sqlite3.Database(dbname,function(err){
			req.sqlitedb.serialize(function(){
				req.sqlitedb.run(database.SQL[0]);
				req.sqlitedb.run(database.SQL[1]);
				req.sqlitedb.run(database.SQL[2]);
			}
			);

			next();
		});
	}
}

database.SQL = [
	"CREATE TABLE IF NOT EXISTS movie_tb(movie_id INTEGER,movie_name TEXT UNIQUE,description TEXT,released INT, url text,views INT,date_added INT, PRIMARY KEY(movie_id))",
	"CREATE TABLE IF NOT EXISTS category_tb(category_id INTEGER, category_name TEXT UNIQUE, PRIMARY KEY(category_id))",
	"CREATE TABLE IF NOT EXISTS movie_cat_lookup_tb(category_id INT, movie_id INT)"
];

database.fieldnames = {};

database.fieldnames.movie_tb = [
	"movie_id","movie_name","description","released","url","views","date_added"
];

database.fieldnames.category_tb = [
	"category_id","category_name"
];

database.fieldnames.movie_cat_lookup_tb = [
	"category_id","movie_id"
];

database

database.addCategory = function(category){
	return function(req,res,next){
		var sql = "INSERT INTO category_tb(category_name) VALUES('"+category+"')";
		req.sqlitedb.run(sql,function(err){
			console.log(category);
			next();
		});
	}
};

database.getCategories = function(req,res,next){
	var sql = "SELECT * FROM category_tb ORDER BY category_name;";
	req.sqlitedb.all(sql,function(err,res){
		if(err){
			console.log(err);
			req.arevir.page.result.categorylist = [];
		}else{
			req.arevir.page.result.categorylist = res;
		}
		next();
	});
}

database.getCategoriesWithCount = function(req,res,next){
	var test = "SELECT category_tb.category_id AS category_id,category_tb.category_name AS category_name,count(movie_cat_lookup_tb.category_id) AS category_count FROM category_tb LEFT JOIN movie_cat_lookup_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id GROUP BY category_tb.category_name "
	req.sqlitedb.all(test,function(err,res){
		if(err){
			console.log(err);
			req.arevir.page.result.categorylist = [];
		}else{
			req.arevir.page.result.categorylist = res;
		}
		next();
	});
}

database.deleteCategory = function(category_id){
	return function(req,res,next){
		var sql = "DELETE FROM category_tb WHERE category_id="+category_id+";";
		req.sqlitedb.run(sql,function(err){
			console.log(sql);
			console.log(err);
			next();
		});
	}
}

database.renameCategory = function(category_id,newname){
	return function(req,res,next){
		var sql = "UPDATE category_tb SET category_name='"+newname+"' WHERE category_id="+category_id+";";
		req.sqlitedb.run(sql,function(err){
			next();
		})
	}
}


//save results to req.arevir.dbresult.movieitem
database.addMovie =  function(req,res,next){
	var movieitem = new movie();
	req.sanitizeBody('movie_name').trim();
	req.sanitizeBody('movie_id').trim();
	req.sanitizeBody('movie_released').trim();
	req.sanitizeBody('movie_url').trim();
	req.sanitizeBody('description').trim();

	//initialize movie object
	movieitem.movie_name = req.body.movie_name;
	movieitem.released = req.body.movie_released;
	movieitem.url = req.body.movie_url;
	movieitem.description = req.body.description;
	movieitem.movie_id = req.body.movie_id;
	if(typeof(req.body.movie_category)=="string"){
		if(req.body.movie_category!=""){
		movieitem.categories.push(req.body.movie_category);
		};
	}else{movieitem.categories = req.body.movie_category};

	//save results to req.arevir.dbresult.movieitem
	req.arevir.dbresult.movieitem = movieitem;

	var sql1 = 'INSERT INTO movie_tb(movie_name,views,released,description,url,date_added) VALUES($name,$views,$released,$description,$url,$date_added)';
	req.sqlitedb.run(sql1,{$name:movieitem.movie_name,$views:movieitem.views,$released:movieitem.released,$description:movieitem.description,$url:movieitem.url,$date_added:movieitem.date_added},
		function(err){
			if(err){
				req.arevir.errors.database = "Unable to add: "+err.message;
				req.arevir.success.database = false;
				next()
			}else{
				req.arevir.success.database = `Success: ${movieitem.movie_name} was added to database.`;
				var sqlgetlastid = `SELECT * FROM movie_tb WHERE movie_name='${movieitem.movie_name}'`;
				req.sqlitedb.get(sqlgetlastid,function(err,result){
					if(err){
						req.arevir.errors.database = "Error Getting Last Id of added movie.";
						req.arevir.success.database = false;
					}else{
						req.arevir.errors.database = false;
					}
					if(result){
						req.arevir.dbresult.movieitem.movie_id = result.movie_id;
						var lookupsql = "INSERT INTO movie_cat_lookup_tb(movie_id,category_id) VALUES($id,$cat_id)";
						req.arevir.dbresult.movieitem.categories.forEach((category)=>{
							req.sqlitedb.run(lookupsql,
								{$id:req.arevir.dbresult.movieitem.movie_id,$cat_id:category},
								(err)={if(err){req.arevir.errors.database="Unable to add to lookup table.";console.log(err)}});

						});
					}
					next();
				})
			}
		}
	);
}
database.getMoviesParams = function(req,res,next){

	var param = {limit:9,offset:0,sort:{field:"movie_name",ascending:true},category:""};
	param.limit = (req.params.limit)? parseInt(req.params.limit) : param.limit;
	param.offset = (parseInt(req.params.page)-1)*parseInt(param.limit);
	param.sort.field = (req.params.sort)? "movie_name":param.sort.field ;
	param.category = req.params.category.toLowerCase();
	switch(req.params.order.toLowerCase()){
		case "asc":
			param.sort.ascending = true;
			break;
		case "desc":
			param.sort.ascending = false;
			break;
		default:
			param.sort.ascending = true;
	}
	req.arevir.movieparams = param;
	next();

}

// link movies/category/limit/page/sort/order
database.getMovies = function(req,res,next){
	//option
	//{limit:9,offset:0,sort:{field:"movie_name",ascending:true},category:''};
	var options = req.arevir.movieparams;

	//sql to get the results to be shown
	var sql = "SELECT DISTINCT * FROM movie_tb INNER JOIN movie_cat_lookup_tb ON movie_cat_lookup_tb.movie_id=movie_tb.movie_id INNER JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id ";
	//sql to get total result without limit
	var sqlcount = "SELECT count(*) AS total_result FROM movie_tb INNER JOIN movie_cat_lookup_tb ON movie_cat_lookup_tb.movie_id=movie_tb.movie_id INNER JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id ";

	//test sort parameter and set defaults
	if(!options.hasOwnProperty('sort')){
		options.sort = {field:"movie_name",order:true};
	};
	if(!options.sort.hasOwnProperty('field')){
		options.sort.field = "movie_name";
	}
	options.sort.ascending = (options.sort.ascending) ? true:false;

	//test limit
	if(!options.hasOwnProperty('limit')){
		options.limit = 9;
	}
	options.limit = (options.limit < 1) ? 9 : options.limit;

	//test offset
	if(!options.hasOwnProperty('offset')){
		options.offset = 0;
	}
	options.offset = (options.offset < 0) ? 0 : options.offset;

	//test category
	if(!options.hasOwnProperty('category')){
		options.category = '';
	}

	options.category = (options.category=='all') ?'':options.category;

	//add filter to sql
	if(options.category !== ''){
		sql += `WHERE category_tb.category_name LIKE '${options.category}' `;
		sqlcount += `WHERE category_tb.category_name LIKE '${options.category}' `;
	}
	
/// TODO - ADD TO SEARCH PAGE
//	if(options.category == 'search'){
//		sql += `WHERE movie_tb.movie_name LIKE '${options.category}' `;
//		sqlcount += `WHERE movie_tb.movie_name LIKE '${options.category}' `;
//	}



	//if All movies should be shown
	if(options.category == ''){
		sql = "SELECT * from movie_tb ";
		sqlcount = "SELECT COUNT(*) as total_result from movie_tb ";
	}

	//
	switch(options.sort.field){
		case "date_added":
			sql += 'ORDER BY date_added ';
			break;
		case "views":
			sql += 'ORDER BY views ';
			break;
		case "released":
			sql += 'ORDER BY released ';
			break;
		default:
			sql += 'ORDER BY movie_name ';
			break;
	}

	//save queries
	req.arevir.lastquery = sql;

	if(options.sort.ascending){
		sql += 'ASC ';
	}else{sql+= 'DESC '};

	sql += `LIMIT ${options.limit} `;
	sql += `OFFSET ${options.offset}`;

	req.sqlitedb.serialize(function(){
		req.sqlitedb.get(sqlcount,function(err,res){
			if(err){
				req.arevir.errors.database = err.message;
			}else{
				req.arevir.dbresult.totalmovies = res.total_result;
			}
		});
		req.sqlitedb.all(sql,function(err,result){
			if(err){
				req.arevir.dbresult.movies = [];
				req.arevir.errors.database = err.message;
			}else{
				req.arevir.dbresult.movies = result;
			}
			next();
		});


	});
}


database.getMovie = function(req,res,next){
	var movieid = parseInt(req.params.movieid);
	var sql = `SELECT * FROM movie_tb WHERE movie_id=${movieid}`;
	req.sqlitedb.serialize(function(){
		req.sqlitedb.get(sql, function(err,result){
			if(err){
				console.log(err);
				req.arevir.dbresult.movie = {};
				req.arevir.dbresult.movie.categories = [];
				next();
			}else{
				req.arevir.dbresult.movie = result;
				if(result){
					var sqlcategories = `SELECT * FROM movie_cat_lookup_tb LEFT JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id WHERE movie_id=${result.movie_id} `;
					req.sqlitedb.all(sqlcategories,function(err,categories){
						if(err){
							console.log(err);
							next();
						}else{
							req.arevir.dbresult.movie.categories = categories;
							var addviewsql = `UPDATE movie_tb SET views=views+1 WHERE movie_id=${req.arevir.dbresult.movie.movie_id}`;
							req.sqlitedb.run(addviewsql);
							next();
						}
					});

				}else{
					next()
				}
			}
		});
	});
}

database.removeMovie = function(req,res,next){
	var delete_id = 0;

	delete_id = parseInt(req.params.movieid);

	if(delete_id>0){

		var sqldeletemovie =`DELETE FROM movie_tb WHERE movie_id=${delete_id}`;
		req.sqlitedb.run(sqldeletemovie,function(err){
			var sqldeletelookup = `DELETE FROM movie_cat_lookup_tb WHERE movie_id=${delete_id}`;
			if(err){req.arevir.errors = "Removing movie failed.";next();}
			else{
				req.sqlitedb.run(sqldeletelookup,function(err){
					req.arevir.success = "Removing Entries in lookup table succeded."
					if(err){
						req.arevir.errors = "Removing Entries in lookup table failed.";
						next();
					}
					else{
						req.arevir.success = "Removed Entries from lookup table.";
						next();
					}
				});
			}
		});
	}else{next();};	
}


database.modifyMovie = function(req,res,next){

	req.sanitizeBody("newvalue").trim();
	var newvalue = (req.body.newvalue) ? req.body.newvalue : "";
	var fieldtomodify = (req.body.fieldname) ? req.body.fieldname : "";
	var movie_id = parseInt(req.params.movieid);

	//check if the entered field is allowed to modify
	var field = database.fieldnames.movie_tb.find((item)=>{
		var result = false;
		if(item == "movie_id"||item=="date_added"){
			result = false;
		}
		if(item==fieldtomodify){
			result = true;
		}
		return result;
	});


	if(field){
		var sql = `UPDATE movie_tb SET ${fieldtomodify}=? WHERE movie_id=${movie_id}`;
		if((field=="movie_name")&&newvalue.length<1){
			next();
		}
		else{
			req.sqlitedb.run(sql,[newvalue],function(err){
				console.log(sql);
				console.log(err);
				if(err){
					req.arevir.errors = `Updating ${field} to ${newvalue} failed. `;
				}else{
					req.arevir.success = "Update Successful";
				}
				next();
			});
		}
	}else{next();};
}




database.test = function(req,res,next){
	var testing ="SELECT * FROM movie_tb LEFT JOIN movie_cat_lookup_tb ON movie_cat_lookup_tb.movie_id=movie_tb.movie_id JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id WHERE category_tb.category_name LIKE 'action' ORDER BY movie_name ASC LIMIT 5 OFFSET 0";
	var sql = 'SELECT * FROM movie_tb LEFT JOIN movie_cat_lookup_tb ON movie_cat_lookup_tb.movie_id=movie_tb.movie_id INNER JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id';
	var testlookup = "SELECT count(*) FROM movie_cat_lookup_tb JOIN movie_tb ON movie_tb.movie_id=movie_cat_lookup_tb.movie_id WHERE movie_tb.movie_id IS NOT NULL"
	req.sqlitedb.all(testlookup,function(err,result){
		res.send(result);
		res.end();
	})
}


module.exports = database;
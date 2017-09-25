var sqlite3 = require('sqlite3');

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
			req.sqlitedb.result = {};
		}else{
			req.sqlitedb.result = res;
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

database.addMovie = function(movieitem){
	return function(req,res,next){
		console.log(movieitem);
		var movie_item = movieitem;
		var sql1 = 'INSERT INTO movie_tb(movie_name,description,url,views,date_added) VALUES($name,$description,$url,$views,$date_added)';
		if(movie_item.movie_name.length == 0){next();}
		else{
			req.sqlitedb.run(sql1,
				{
					$name : movie_item.movie_name,
					$description : movie_item.description,
					$url : movie_item.url,
					$views : movie_item.views,
					$date_added : movie_item.date_added
				}
				,
				function(err){
					next();
				}
			);
		}
	}
}

database.getMovieId = function(req,res,next){
		var sql = "SELECT * FROM movie_tb WHERE movie_name=$name";
		req.sqlitedb.get(sql,{$name:req.arevir.movieitem.movie_name},function(err,result){
			if(err){
				req.arevir.movieitem.movie_id = 0;
			}else{
				req.arevir.movieitem.movie_id = result.movie_id;
			}
			next();
		});
}

database.addToLookUp = function(){
	return function(req,res,next){
		var sql = 'INSERT INTO movie_cat_lookup_tb(category_id,movie_id) VALUES($catid,$movid)';
		if(typeof(req.arevir.movieitem.categories)!="undefined"){
			req.arevir.movieitem.categories.forEach(function(categoryid){
				req.sqlitedb.run(sql,{$catid:categoryid,$movid:req.arevir.movieitem.movie_id});
			});
		}
		next();
	}
}

database.getMovies = function(options={limit:10,offset:0,category:0}){
	return function(req,res,next){
	}
}



database.test = function(req,res,next){
	var sql = 'SELECT * FROM movie_tb LEFT JOIN movie_cat_lookup_tb ON movie_cat_lookup_tb.movie_id=movie_tb.movie_id INNER JOIN category_tb ON category_tb.category_id=movie_cat_lookup_tb.category_id';
	req.sqlitedb.all(sql,function(err,result){
		console.log(result);
		next();
	})
}


module.exports = database;
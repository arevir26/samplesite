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
	"CREATE TABLE IF NOT EXISTS movie_tb(movie_id INTEGER,movie_name TEXT UNIQUE,released INT, url text,views INT,date_added INT, PRIMARY KEY(movie_id))",
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
	var sql = "SELECT * FROM category_tb";
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


module.exports = database;
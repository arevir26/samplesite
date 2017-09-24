
var sqlite3 = require('sqlite3');

var database = {};

database.connect = function(dbname){
  return function(req,res,next){
    if(!req.hasOwnProperty('arevir')){req.arevir = {};};
    req.arevir.db = new sqlite3.Database(dbname);
    req.arevir.dbOk = true;
    next();
  }
}

database.addCategory = function(category_name){
  return function(req,res,next){
    var sql = `INSERT INTO category_tb(category_name) VALUES('${category_name.trim()}')`;
    if(!req.hasOwnProperty('arevir')){req.arevir = {};};
    if(category_name.trim().length >0&&req.arevir.dbOk){
      req.arevir.db.run(sql,function(err){
        if(err){
          req.arevir.error_add_category = "Error: Already Exists.";
        }else{
          req.arevir.success_add_category = "Item added to database.";
        }
        next();
        console.log(err);
      });
    }
    else{
      req.arevir.error_add_category = "Error: Empty Argument";
      next();
      };
  }
}

database.removeCategory = function(category_name){
  return function(req,res,next){
  
    ///////////////////////////////
    next();
  }
}

database.clearCategory = function(){
  return function(req,res,next){
    var sql = 'DELETE FROM category_tb';
    if(!req.hasOwnProperty('arevir')){req.arevir = {};};
    if(req.arevir.dbOk){
      req.arevir.db.run(sql,function(err){
        next();
      });
    }else{ next();};
  }
}

database.runQuery = function(sql){
  return function(req,res,next){
    if(!req.hasOwnProperty('arevir')){req.arevir = {};};
    if(req.arevir.dbOk){
      this.db.run(sql,next);
    }else{next();};
  }
}


module.exports = database;


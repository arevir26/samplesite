var express = require('express');

var app = express();

app.get('/admin',
	function(req,res,next){
		res.render('admin',{title: "Login"});
	}
);


module.exports = app;
var express = require('express');

var router = express.Router();

router.get('/:layout',function(req,res,next){
	res.render(req.params.layout);
});

module.exports = router;
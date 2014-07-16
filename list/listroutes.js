var express = require('express');
var multipart = require('connect-multiparty');
var list = require('./listroutehandler');

var router = express.Router();
var multipartMiddleware = multipart();

router.post('/list/upload', multipartMiddleware, function(req, res) {
  // File uploaded, let's create a stream and parse the data
	list.parseCsv(req, res);
});

router.post('/list/save', function(req, res){
  	list.save(req, res);
});

module.exports.router = router;
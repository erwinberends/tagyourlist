var express = require('express');
var multipart = require('connect-multiparty');
var fs = require('fs');
var parse = require('csv-parse');
require('./model/list');

var app = express();
var multipartMiddleware = multipart();

var port = process.env.PORT || 3000;

app.use('/client', express.static('client'));

app.get('/', function(req, res){
	res.sendfile('client/index.html');
});

app.post('/list/upload', multipartMiddleware, function(req, res) {
  // File uploaded, let's create a stream and parse the data
	rs = fs.createReadStream(req.files.datafile.path);
	parser = parse({columns: true, delimiter: ';'}, function(err, data){
		// When there's data, let's write it to the browser
  		if(data.length > 0){
  			var propertyNames = Object.getOwnPropertyNames(data[0]);
  			var list = new List(propertyNames, data);
  			res.send(list);
  		}
	});
	rs.pipe(parser);
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});


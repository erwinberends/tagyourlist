var parse = require('csv-parse');
var fs = require('fs');

var List = function list(columnNames, items){
	this.columnNames = columnNames;
	this.items = items;
}

exports.parseCsv = function(req, res){
	console.log('Calling parseCsv');
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
}

exports.save = function(req, res){
	console.log('Calling save');
	res.send('OK');
}
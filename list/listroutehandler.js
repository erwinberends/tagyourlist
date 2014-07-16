var parse = require('csv-parse');
var fs = require('fs');
var mongoose = require('mongoose');

var List = function list(columnNames, items){
	this.columnNames = columnNames;
	this.items = items;
}

var listItemSchema = mongoose.Schema({
	values: [],
	listId: String
});

var listMetadataSchema = mongoose.Schema({
	columnNames: [String]
});

var listSchema = mongoose.Schema({
	listMetaDataId: String,
});

var DbList = mongoose.model('List', listSchema);
var DbListItem = mongoose.model('ListItem', listItemSchema);
var DbListMetaData = mongoose.model('ListMetadata', listMetadataSchema);

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
	var dbListMetaData = new DbListMetaData({
		columnNames: ['Col1', 'Col2']
	});
	dbListMetaData.save();
	res.send('OK');
}
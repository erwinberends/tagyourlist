var parse = require('csv-parse');
var fs = require('fs');
var mongoose = require('mongoose');

var List = function list(columnNames, items, name){
	this.columnNames = columnNames;
	this.items = items;
	this.name = name;
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
	name: String
});

var DbList = mongoose.model('List', listSchema);
var DbListItem = mongoose.model('ListItem', listItemSchema);
var DbListMetaData = mongoose.model('ListMetadata', listMetadataSchema);

function saveListItems(listId, req){
	for(var i=0; i<req.body.items.length; i++){
		var item = req.body.items[i];
		var listItem = new DbListItem({
			listId: listId,
			values: req.body.items
		});
		listItem.save();
	}
}

function saveList(metaDataId, req){
	var list = new DbList({
	listMetaDataId: metaDataId,
		name: 'Testlist'
	});
	list.save(function(err, list){
		var listId = list.id;
		saveListItems(listId, req);
	});
}

function constructList(list, res){
	DbListMetaData.find({_id : list.listMetaDataId}, function(err, results){
		var columnNames = results[0].columnNames;
		DbListItem.find({listId : list._id}, function(err, results){
			var items = results;
			var mappedList = new List(columnNames, items, list.name);
			res.send(200, mappedList);
		});
	});
}

exports.parseCsv = function(req, res){
	rs = fs.createReadStream(req.files.datafile.path);
	parser = parse({columns: true, delimiter: ';'}, function(err, data){

		// When there's data, let's write it to the browser
  		if(data.length > 0){
  			var propertyNames = Object.getOwnPropertyNames(data[0]);
  			var list = new List(propertyNames, data);
  			res.send(200, list);
  		}
	});
	rs.pipe(parser);
}

exports.save = function(req, res){
	var dbListMetaData = new DbListMetaData({
		columnNames: req.body.columnNames
	});
	dbListMetaData.save(function(err, metadata){
		var metaDataId = metadata.id;
		saveList(metaDataId, req);
	});
	res.send(200);
}

exports.get = function(req, res){
	var lists = [];
	DbList.find({}, function(err, results){
		res.send(results);	
	});
}

exports.getListById = function(req, res){
	var listId = req.params.listid;
	DbList.find({_id : listId}, function(err, results){
		var list = results[0];
		constructList(list, res);
	});
}
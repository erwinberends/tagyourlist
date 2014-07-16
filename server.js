var express = require('express');
var routes = require('./list/listroutes');

var app = express();
var port = process.env.PORT || 3000;

app.use('/client', express.static('client'));

app.get('/', function(req, res){
	res.sendfile('client/index.html');
});


app.use('/', routes.router);


var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});


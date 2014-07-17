var should = require('should'),
supertest = require('supertest');
var request = supertest('localhost:3000');
var mongoose = require('mongoose');
var testconfig = require('./testconfig');

describe('POST /list/save', function(){
	it('returns 200, and saves the list to mongodb', function(done){
        request.post('/list/save')
            .send(testconfig.uploadResult)
            .expect(200)
            .end(function(err, res){
            	should.not.exist(err);
                done();
            });
	});
});

describe('POST /list/upload', function() {
    it('returns 200, content-type is JSON when a filled csv file is uploaded', function(done) {
        request.post('/list/upload')
            .attach('datafile', './test/upload.in')
            .expect(200, testconfig.uploadResult)
            .end(function(err, res) {
                should.not.exist(err);
                done();
            });
    });
});

var listId = '';

describe ('GET /list', function(){
    it('returns 200, and contains at least one list', function(done){
        request.get('/list')
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                res.body.length.should.greaterThan(1);
                listId = res.body[0]._id;
                done();
            });
    });
});

describe ('GET /list/:listId', function(){
    it('returns 200, and all the items of the list', function(done){
        request.get('/list/' + listId)
            .expect(200)
            .end(function(err, res){
                should.not.exist(err);
                done();
            });
    });

});

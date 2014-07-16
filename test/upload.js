var should = require('should'),
supertest = require('supertest');
var request = supertest('localhost:3000');

var uploadResult = {
	columnNames: ['Postcode', 'Woonplaats', 'Mobiel', 'Telefoon'],
	items:  [{ Postcode: '7218 NB', 
			   Woonplaats: 'ALMEN', 
			   Mobiel: '06-11111111', 
			   Telefoon: '0575-11111111' }]
};

describe('POST /list/upload', function() {
    it('returns 200, content-type is JSON when a filled csv file is uploaded', function(done) {
       request.post('/list/upload')
              .attach('datafile', './test/upload.in')
              .expect(200, uploadResult)
              .end(function(err, res) {
              		should.not.exist(err);
                	done();
              });
    });
});
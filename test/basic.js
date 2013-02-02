var assert = require("assert")
var decodeBzip = require('../');
var fs = require('fs');

describe('bzip2 basic decode', function(){
  it('should correctly decode our example file', function(){
      var compressedData = fs.readFileSync('test/sample0.bz2');
      var data = decodeBzip(compressedData);
      assert.equal(data, "This is a test\n");
  });
  ['sample0', 'sample1', 'sample2', 'sample3'].forEach(function(f) {
      it('should correctly decode '+f, function() {
          var compressedData = fs.readFileSync('test/'+f+'.bz2');
          var referenceData = fs.readFileSync('test/'+f+'.ref');
          var data = decodeBzip(compressedData, referenceData.length);
          assert.equal(data.toString('hex'), referenceData.toString('hex'));
      });
  });
});

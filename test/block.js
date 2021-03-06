var assert = require("assert");
var Bunzip = require('../');
var fs = require('fs');

describe('bzip2 block decode', function(){
  it('should correctly decode our example file', function(){
      var compressedData = fs.readFileSync('test/sample0.bz2');
      var data = Bunzip.decodeBlock(compressedData, 32);
      assert.equal(new Buffer(data).toString(), "This is a test\n");
  });
  [{file:'sample2',blocks:[544888]},
   {file:'sample4',blocks:[32,1596228,2342106]}].forEach(function(o) {
     var f = o.file;
     o.blocks.forEach(function(b) {
       it('should correctly decode the block starting at '+b+' of '+f,
          function() {
            var compressedData = fs.readFileSync('test/'+f+'.bz2');
            var referenceData = fs.readFileSync('test/'+f+'.'+b);
            var data = Bunzip.decodeBlock(compressedData, b,
                                          referenceData.length);
            var encoding = (f=='sample2')?'hex':'utf-8';
            assert.equal(new Buffer(data).toString(encoding),
                         new Buffer(referenceData).toString(encoding));
          });
     });
  });
});

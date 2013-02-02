var assert = require("assert")
var decodeBzip = require('../');
var fs = require('fs');

describe('bzip decode', function(){
  it('should correctly decode our example file', function(){
      var compressedData = fs.readFileSync('test/basic.txt.bz2');
      var data = decodeBzip(compressedData);
      assert.equal(data, "This is a test\n");
  });
});

var should = require('should');
var logger = require('../index');

describe("logdriver", function(){
  it ("creates a new instance of logger with default levels", function(){
    should.exist(logger.error);
    should.exist(logger.warn);
    should.exist(logger.info);
    should.exist(logger.debug);
    should.exist(logger.trace);
    logger.level.should.equal('trace');
  });
});

var should = require('should');
var logger = require('../index');
var defaultLogger = require('../index').logger;
var sinon = require('sinon-restore');
var oldConsoleLog = console.log;
var oldConsoleError = console.error;

/* NOTE: console.log is mocked in these tests, so any uses of it will be
 * appended to the variabled "logged".  This will include any calls you
 * make to console.log() for the purpose of debugging in these tests.
 *
 * use oldConsoleLog() instead if you need to console.log() for
 * debugging;
 */


describe("logdriver", function(){
  var logged;
  var errored;
  beforeEach(function(){
    logged = [];
    errored = [];
    sinon.stub(console, 'log', function(str){
      logged.push(str);
    });
    sinon.stub(console, 'error', function(str){
      errored.push(str);
    });
  });
  afterEach(function(){
    sinon.restoreAll();
    console.log = oldConsoleLog;
    console.error = oldConsoleError;
    logged = [];
    errored = [];
  });
  it ("provides a default instance of logger with default levels", function(){
    var mylogger = defaultLogger;
    should.exist(mylogger.error);
    should.exist(mylogger.warn);
    should.exist(mylogger.info);
    should.exist(mylogger.debug);
    should.exist(mylogger.trace);
    mylogger.level.should.equal('trace');
  });
  it ("allows log level possibilities to be specified", function(){
    var mylogger = logger({ levels : 
                              ['superimportant', 
                               'checkthisout', 
                               'whocares']});
    should.exist(mylogger.superimportant);
  });
  it ("allows you to specify a log level of false to suppress all output", function(){
    var mylogger = logger({ level : false});
    mylogger.info("info test"); 
    mylogger.warn("warn test"); 
    mylogger.error("error test"); 
    mylogger.trace("trace test"); 
    logged.should.have.lengthOf(0);
  });
  it ("allows log level to be specified, and doesn't log below that level", function(){
    var mylogger = logger({ level : 'info'});
    mylogger.info("info test"); 
    mylogger.warn("warn test"); 
    mylogger.error("error test"); 
    mylogger.trace("trace test"); 
    logged.should.have.lengthOf(3);
    logged[0].should.include('[info]');
    logged[1].should.include('[warn]');
    logged[2].should.include('[error]');
    logged[0].should.include('info test');
    logged[1].should.include('warn test');
    logged[2].should.include('error test');
  });
  it ("allows you to override the default format", function(){
    var mylogger = logger({
      format : function(){
        return JSON.stringify(arguments);
      }
    });
    mylogger.error("here's an error");
    JSON.parse(logged[0]).should.eql({"0":"error","1":"here's an error"});
  });

  it ("outputs all using console.log if errorLevel is not specified", function(){
    var mylogger = logger({
      // everything with level 'info' and below is logged
      level: 'info',
      levels: ['fatal', 'error', 'warn', 'info']});
    mylogger.fatal("fatal test");
    mylogger.error("error test");
    mylogger.warn("warn test");
    mylogger.info("info test");

    logged.should.have.lengthOf(4);
    errored.should.have.lengthOf(0);
  });

  it("outputs all using console.log if errorLevel is invalid", function() {
    var mylogger = logger({
      level: 'info',
      errorLevel: 'not in levels list',
      levels: ['fatal', 'error', 'warn', 'info']});
    mylogger.fatal("fatal test");
    mylogger.error("error test");
    mylogger.warn("warn test");
    mylogger.info("info test");

    logged.should.have.lengthOf(4);
    errored.should.have.lengthOf(0);
  });

  it ("will use console.error if errorLevel is specified", function(){
    var mylogger = logger({
      // everything with level 'info' and below is logged
      level: 'info',
      // everything with level 'error' and below is logged to standard error
      // everything with level above 'error' is logged to standard out
      errorLevel: 'error',
      levels: ['fatal', 'error', 'warn', 'info']});
    mylogger.fatal("fatal test");
    mylogger.error("error test");
    mylogger.warn("warn test");
    mylogger.info("info test");

    logged.should.have.lengthOf(2);
    logged[0].should.include("warn test");
    logged[1].should.include("info test");

    errored.should.have.lengthOf(2);
    errored[0].should.include("fatal test");
    errored[1].should.include("error test");
  });
});

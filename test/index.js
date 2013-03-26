var should = require('should');
var logger = require('../index');
var defaultLogger = require('../index').logger;
var sinon = require('sinon-restore');
var logged = "";
var oldConsoleLog = console.log;

/* NOTE: console.log is mocked in these tests, so any uses of it will be
 * appended to the variabled "logged".  This will include any calls you
 * make to console.log() for the purpose of debugging in these tests.
 *
 * use oldConsoleLog() instead if you need to console.log() for
 * debugging;
 */


describe("logdriver", function(){
  beforeEach(function(){
    logged = "";
    sinon.stub(console, 'log', function(str){
      logged += str + "\n";
    });
  });
  afterEach(function(){
    sinon.restoreAll();
    console.log = oldConsoleLog;
    logged = "";
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
  it ("allows log level to be specified, and doesn't log below that level", function(){
    var mylogger = logger({ level : 'info'});
    mylogger.info("info test"); 
    mylogger.warn("warn test"); 
    mylogger.error("error test"); 
    mylogger.trace("trace test"); 
    var lines = logged.split("\n");
    lines[0].should.include('[info]');
    lines[1].should.include('[warn]');
    lines[2].should.include('[error]');
    lines[0].should.include('info test');
    lines[1].should.include('warn test');
    lines[2].should.include('error test');
  });
  it ("allows you to override the default format", function(){
    var mylogger = logger({
      format : function(){
        return JSON.stringify(arguments);
      }
    });
    mylogger.error("here's an error");
    JSON.parse(logged).should.eql({"0":"error","1":"here's an error"});
  });
});

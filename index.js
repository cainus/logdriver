var util = require('util');

LogDriver = function(options){
  options = options || {};
  var logger = this;
  if (options.format){
    this.format = options.format;
  }
  this.levels = options.levels || ['error', 'warn', 'info', 'debug', 'trace'];
  this.level = options.level || this.levels[this.levels.length - 1];
  if (this.levels.indexOf(this.level) === -1){
    throw new Error("Log level '" +
                    this.level +
                    "' does not exist in level list '" + JSON.stringify() + "'");
  }
  this.levels.forEach(function(level){
    if (logger.levels.indexOf(level) <= logger.levels.indexOf(logger.level)){
      logger[level] = function(){
        var args = Array.prototype.slice.call(arguments);
        args.unshift(level);  // log level is added as the first parameter
        console.log(logger.format.apply(logger, args));
      };
    } else {
      logger[level] = function(){/* no-op, because this log level is ignored */};
    }
  });
};

LogDriver.prototype.format = function(){
  var args = Array.prototype.slice.call(arguments, [1]); // change arguments to an array, but
                                                         // drop the first item (log level)
  var out = "[" + arguments[0] + "] " + JSON.stringify(new Date()) + " ";
  args.forEach(function(arg){
    out += " " + util.inspect(arg);
  });
  return out;
};

logger = function(options){
  logger.logger = new LogDriver(options);
  return logger.logger;
};

module.exports = logger();

/*
var l = logger({"level" : "info"}); //, format : function(){return JSON.stringify(arguments);}});
l.error("something went horribly wrong");
l.info("FYI", {asdf:true});
l.debug("debug", {show:false});
*/

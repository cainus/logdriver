![Log Driver](https://raw.github.com/cainus/logdriver/master/logo.png)
=========
[![Build
Status](https://travis-ci.org/cainus/logdriver.png?branch=master)](https://travis-ci.org/cainus/logdriver)
[![Coverage Status](https://coveralls.io/repos/cainus/logdriver/badge.png?branch=master)](https://coveralls.io/r/cainus/logdriver)

Logdriver is a node.js logger that only logs to stdout.

####You're going to want to log the output of stdout and stderr anyway, so you might as well put all your logging through stdout.  Logging libraries that don't write to stdout or stderr are missing absolutely critical output like the stack trace if/when your app dies.  

##There are some other nice advantages:
* When working on your app locally, logs just show up in stdout just like if you'd used console.log().  That's a heck of a lot simpler than tailing a log file.
* Logging transports can be externalized from your app entirely, and completely decoupled.  This means if you want to log to irc, you write an irc client script that reads from stdin, and you just pipe your app's output to that script.

```console
node yourapp.js 2>&1 | node ircloggerbot.js 
```
* You can still easily log to a file on a production server by piping your stdout and stderr to a file like so when you initialize your app:

```console
node yourapp.js 2>&1 >> somefile.log 
```

NB: If you're logging to a file, [Logrotate](http://linuxcommand.org/man_pages/logrotate8.html) is probably going to be your best friend.
* You can still easily log to syslog by piping your stdout and stderr to the 'logger' command like so:

```console
node yourapp.js 2>&1 | logger
```

##Usage:
Coming soon

![Log Driver](https://raw.github.com/cainus/logdriver/master/waltz.jpg)

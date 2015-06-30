/* 
* @Author: mike
* @Date:   2015-05-18 17:40:03
* @Last Modified 2015-06-22
* @Last Modified time: 2015-06-22 10:25:04
*/

'use strict';

var util = require('util')
var Winston = require('winston')
require('winston-loggly')
var _ = require('underscore')
var DEFAULT_LOG_LEVEL = 'debug'

function getTransportsFor(app) {
  var transports = []
  var db = app.config.db

  transports.push(new Winston.transports.Console({
    level: DEFAULT_LOG_LEVEL,
    timestamp: true,
    prettyPrint: true,
    colorize: 'all',
    label: app.config.isWorker ? "worker" : "http",
    depth: 6
  }))
  
  return transports
}

module.exports = function (app) {

  app.log = Logger // convenience

  function Logger() {
    Logger.log.apply(Logger, arguments)
  }

  Logger.init = function () {

    var logger = new Winston.Logger({
      exitOnError: false,
      transports: getTransportsFor(app)
    })

    logger.on('logging', function (transport, level, msg, meta) {
      if(level != 'error') return
      app.emit('event.track', 'log.'+level, {msg: msg, data: meta})
    });

    _.extend(this, logger)

    Logger.log = Logger[DEFAULT_LOG_LEVEL]

    _.each(
      logger,
      function (f, k) {
        if (_.isFunction(f))
          app.on("log." + k, Logger[k])
      }
    )
  }

  Logger.init()

  return Logger

}
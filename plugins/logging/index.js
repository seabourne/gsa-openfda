/* 
* @Author: mike
* @Date:   2015-05-18 17:38:32
* @Last Modified 2015-06-22
* @Last Modified time: 2015-06-22 10:51:25
*/

'use strict';

var fs = require('fs')

class LoggingPlugin {

  constructor (app, loaded) {
    var responseLogger = require('./lib/middleware/responseLogger')
    var logService = require('./lib/services/logService')

    app.on('app.init', function () {
      logService(app)
      app.log('logger initialized')
    })

    app.on('router.gatherMiddleware', function (gather) {
      gather(responseLogger(app))
    })
    
    loaded()
  }
}

module.exports = function(app, loaded) {
  new LoggingPlugin(app, loaded)
} 
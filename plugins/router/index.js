/* 
* @Author: Mike Reich
* @Date:   2015-07-01 02:25:14
* @Last Modified 2015-07-01
*/

'use strict';

var util = require('util')
var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser');
var compression = require('compression');

function Router(app, loaded) {
  this.app = app;
  this.routeTable = {}
  
  var self = this  
  var expressApp = express()
  
  var _setRoute = function(route, handler, method) {
    method = method || 'use'
    
    if(_.isString(route)) {
      self.routeTable[route] = handler
      expressApp[method](route, handler);
    } else {
      expressApp[method](route);
    }
      
  }

  var _setStatic = function(path, subPrefix) {
    app.log.debug('setting-static', subPrefix)
    var prefix = "/assets"
    if(subPrefix)
      prefix += subPrefix
    console.log('prefix', prefix)
    console.log('path', path)
    expressApp.use(prefix, express.static(path, {maxAge: (15*60*1000)}))
  }
  
  //Setup express app
  expressApp.use(compression())
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());
  expressApp.use(function(req, res, next) {
    res.set('Connection', 'close'); //need to turn this off on production environments
    next();
  })
  /* 
   * Gatherers
   */

  app.on('app.startup.before', function () {
    app.emit('router.gatherMiddleware', _setRoute);
    app.emit('router.gatherStatic', _setStatic);
  })

  app.on('app.startup', function () {
    app.emit('router.gatherRoutes', function(method, route, callback) {
      if(!callback || _.isFunction(route)) {
        callback = route
        route = method
        method = "get"
      }
      _setRoute(route, callback, method)
    });
  })

  if (process.env.NODE_ENV == "production") {
    app.on('app.startup.after', function () {
      expressApp.use(function errorHandler(err, req, res, next) {
        app.log.error(
          'HTTP 500 error serving request\n\n',
          "Error:\n\n" + err.toString ? err.toString() : "N/A",
          "Error Stack:\n\n" + err.stack ? err.stack : "N/A",
          "User:\n\n" + util.inspect(req.user, {depth: 3}),
          "\n\n\nRequest:\n\n" + util.inspect(req, {depth: 1}),
          err
        )
        res.status(500)
        res.send(err)
        //res.redirect('/error')
      })
    })
  }

  /*
   * Getters
   */

  app.on('router.getRoutes', function (handler) {
    handler(self.routeTable);
  })

  app.on('router.getExpressApp', function (handler) {
    handler(expressApp);
  })

  /*
   * Setters
   */

  app.on('router.setStatic', _setStatic);

  app.on('router.setRoute', _setRoute);

  app.on('router.setRoute.get', function (route, handler) {
    _setRoute(route, handler, 'get');
  })

  app.on('router.setRoute.post', function (route, handler) {
    _setRoute(route, handler, 'post');
  })

  /*
   * Plugin Methods
   */

  app.on('app.startup.after', function () {
      app.log('Starting app on port:', process.env.PORT || 3001);
      self.server = expressApp.listen(process.env.PORT || 3001);
  })

  app.on('app.stop', function () {
    if (self.server) {
      app.log('Shutting down app on port:', process.env.PORT || 3001);
      self.server.close();
    }
  })


  loaded();
  
  return this;
}

exports = module.exports = function(app, loaded) {
  new Router(app, loaded)
}
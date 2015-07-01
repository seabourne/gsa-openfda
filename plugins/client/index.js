/* 
* @Author: Mike Reich
* @Date:   2015-07-01 02:37:39
* @Last Modified 2015-07-01
*/

'use strict';

var Client = require('./lib/Client')
var API = require('./lib/API')

module.exports = function(app, loaded) {
  new API(app, loaded)
  return new Client(app, loaded)
}
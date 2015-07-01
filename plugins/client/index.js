/* 
* @Author: Mike Reich
* @Date:   2015-07-01 02:37:39
* @Last Modified 2015-07-01 @Last Modified time: 2015-07-01 02:37:39
*/

'use strict';

var Client = require('./lib/Client')

module.exports = function(app, loaded) {
  return new Client(app, loaded)
}
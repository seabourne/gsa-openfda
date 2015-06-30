/* 
* @Author: Mike Reich
* @Date:   2015-06-30 07:04:05
* @Last Modified 2015-06-30
*/

'use strict';

var EntityExtractor = require('./lib/EntityExtractor')

module.exports = function(app, loaded) {
  return new EntityExtractor(app, loaded)
}
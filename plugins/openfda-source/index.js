/* 
* @Author: Mike Reich
* @Date:   2015-06-22 11:23:51
* @Last Modified 2015-06-22 @Last Modified time: 2015-06-22 11:23:51
*/

'use strict';


var OpenFDAAPI = require('./lib/OpenFDAAPI')

module.exports = function(app, loaded) {
  return new OpenFDAAPI(app, loaded)
}
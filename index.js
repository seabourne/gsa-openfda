/* 
* @Author: Mike Reich
* @Date:   2015-06-22 09:46:04
* @Last Modified 2015-06-22
*/

'use strict';

var forever = require('forever-monitor')

require("babel/register")({
  stage: 0,
  // this will ensure that only modules are transpiled
  ignore: new RegExp("^(.*node_modules/(?!@topicly).*)")
})

var application = require('./plugins/core')

var startupBanner = function() {
  var role = []
  console.log(' --- GSA-OpenFDA ' + role.join('/') + ' Started at ', new Date())
}

/* 
    The try-catch block is here because uncaught exceptions sometimes result in zombie processes that do not exit, do 
    not respond, and do not exit. This means `forever` won't restart the application because it doesn't exit. This block
    forces the process to exit if an exception makes it all the way up.
 */

try {
  startupBanner()

  var app = module.exports = new application({})
  
} catch (e) {
  console.log('Uncaught exception:', e.stack)
  console.log('Restarting...')
  process.exit(1)
}  
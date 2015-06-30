/* 
* @Author: Mike Reich
* @Date:   2015-06-30 07:28:55
* @Last Modified 2015-06-30
*/

'use strict';

module.exports = function(plugin, app) {
  app.on('storage.gatherSchemas', function(gather) {
    gather(
      'Action',
      function(mongoose) {
        var schema = new mongoose.Schema({
          keywords: {type: [String], index: true},
          topics: {type: [String], index: true}
        }, {strict: false})

        return schema
      },
      { addBaseFields: true}
    )
  })
}
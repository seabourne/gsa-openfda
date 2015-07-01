/* 
* @Author: Mike Reich
* @Date:   2015-06-30 07:28:22
* @Last Modified 2015-07-01
*/

'use strict';

function ActionManager(app, loaded) {
  
  require("./lib/Action")(this, app)

  app.on('entity.record', (entity) => {
    app.emit('storage.getModel', 'Action', (err, Action) => {
      Action.create(entity)
    })
  })

  app.on('action.new', (cb) => {
    app.emit('storage.getModel', 'Action', cb)
  })

  loaded()
}

module.exports = function(app, loaded) {
  return new ActionManager(app, loaded)
}
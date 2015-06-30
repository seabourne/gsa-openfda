/* 
* @Author: Mike Reich
* @Date:   2015-06-30 07:28:22
* @Last Modified 2015-06-30
*/

'use strict';

function ActionManager(app, loaded) {
  app._bootAwait['app.startup'].push('actions.ready')
  
  require("./lib/Action")(this, app)

  app.on('app.startup', () => {
    if(app.config.RESET_CONTENT) {
      app.emit('storage.getModel', 'Action', (err, A) => {
        A.remove({}, (err, n) => {
          app.log.debug(n+" actions removed")
          app.emit('actions.ready')
        })
      })
    } //else
      //app.emit('actions.ready')
  })

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
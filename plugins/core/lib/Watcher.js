/* 
* @Author: Mike Reich
* @Date:   2015-05-23 09:36:21
* @Last Modified 2015-06-22
*/

var moment = require('moment')

class Watcher {
  constructor(app, watchPath, watchEvent, ignore) {
    var chokidar = require('chokidar')
    
    var parsePluginNameFromChangePath = (path) => {
      var pathPortions = path.split('/')
      return pathPortions[pathPortions.indexOf('lib') + 1]
    }
    
    var watchOptions = {
      ignored: ignore ? ignore.concat([new RegExp("^(.*node_modules/.*)")]) : new RegExp("^(.*node_modules/.*)"),
      ignoreInitial: true,
      persistent: true
    }
    var watch = watchPath || process.cwd() + '/lib'
    this.watch = chokidar.watch(watch,watchOptions)
    this.watch.on('all', (event, path) => {
        app.log.warn('changes for', watchEvent, path) 
        app.emit(watchEvent || 'change.detected', path)
      }
    ) 

    app.on('change.app', (path) => {
      this.watch.close();
      var start = moment()
      app.restart(() => {
        var end = moment()
        app.log.info(`Restart took ${end.diff(start, 'seconds')} seconds`)
        app.emit('app.run.tests', path)
      })
    })
  }
  
  close() {
    this.watch.close()
  }
}

module.exports = Watcher
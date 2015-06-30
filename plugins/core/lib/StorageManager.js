/* 
* @Author: mike
* @Date:   2015-05-18 17:06:08
* @Last Modified 2015-05-18eich
* @Last Modified time: 2015-05-18 17:06:21
*/

'use strict';

class StorageManager {

  constructor(app) {
    app._bootAwait['app.init'].push('storage.ready')

    app.on('app.init', () => {
      app.emit('storage.set', this, app)
    })
  }

}

module.exports = StorageManager

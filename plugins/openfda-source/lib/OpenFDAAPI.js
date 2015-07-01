/* 
* @Author: Mike Reich
* @Date:   2015-06-22 11:24:19
* @Last Modified 2015-07-01
*/

'use strict';

var request = require('request')

class OpenFDAAPI {

  constructor(app, loaded) {

    this.app = app

    this.url = 'https://api.fda.gov/food/enforcement.json?search=%22%22&limit=100'

    //app._bootAwait['app.startup'].push('openFDA.ready')
    app.on('app.startup.after', () => {
      app.emit('storage.getModel', 'Action', (err, A) => {
        if(!app.config.RESET_ACTIONS) {
          A.find({}, function(err, as) {
            if(err || !as || as.length == 0) console.log('getting data')//_getData()
            app.emit('openFDA.ready')
          })
        } else {
          A.remove({}, (err, n) => {
            app.log.debug(n+" actions removed")
            _getData()
            app.emit('openFDA.ready')
          })
        }
      })
    })

    loaded()
  }

  _getData () {
    // iterate over API
    var skip = 0
    this._queryAPI(skip, (err, results) => {
      if(err) this.app.log.error('Error getting openFDA data', err)
      results.forEach((r) => {
        this.app.emit('fda.record', r)
      })
    })
  }

  _queryAPI (skip, cb) {
    request(this.url, (err, res) => {
      if(err) return cb(err)
      var data = JSON.parse(res.body)
      if(data && data.results) cb(null, data.results)
      if(skip+100 < data.meta.results.total) {
        setTimeout(() => {
          this._queryAPI(skip+100, cb)
        }, 1500)
      }
      return cb(err, [])
    })
  }
}

module.exports = OpenFDAAPI
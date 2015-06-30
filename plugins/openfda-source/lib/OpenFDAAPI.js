/* 
* @Author: Mike Reich
* @Date:   2015-06-22 11:24:19
* @Last Modified 2015-06-30
*/

'use strict';

var request = require('request')

class OpenFDAAPI {

  constructor(app, loaded) {

    this.app = app

    this.url = 'https://api.fda.gov/food/enforcement.json?search=%22%22&limit=100'

    app.on('app.startup.after', () => {
      app.log('getting openFDAAPI')
      this._getData()
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
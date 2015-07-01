/* 
* @Author: Mike Reich
* @Date:   2015-07-01 02:38:02
* @Last Modified 2015-07-01
*/

'use strict';

var ejs = require('ejs')
var _ = require('underscore')
var fs = require('fs')

class Client {

  constructor(app, loaded) {
    this.app = app

    this._setupRoutes()

    app.on('app.startup.before', () => {
      app.emit('router.setStatic', __dirname+"/../theme/assets", '/theme')
    })

    loaded()
  }

  _setupRoutes() {
    this.app.on('router.gatherRoutes', (gather) => {
      gather('/', (req, res) => {
        this._getAnalytics((err, analytics) => {
          if(err) return res.status(500).send(err)
          var content = this._render(__dirname+"/../views/viz_1.ejs", {analytics: analytics})
          res.send(this._render(__dirname+"/../theme/index.ejs", {content: content}))
        })
      })

      gather('/about', (req, res) => {
        var content = this._render(__dirname+"/../views/about.ejs")
        res.send(this._render(__dirname+"/../theme/index.ejs", {content: content}))
      })
    })
  }


  _getAnalytics (cb) {
    var analytics = {}
    this._getTotalTags ((err, tags) => {
      if(err) return cb(err)
      this._getTopTags ((err, toptags) => {
        if(err) return cb(err)
        analytics.total = tags
        analytics.toptags = toptags
        cb(null, analytics)
      })
    })
  }

  _getTotalTags (cb) {
    this.app.emit('storage.getModel', 'Action', (err, Action) => {
      if(err) return this.app.log.error('error')
      Action.aggregate({$match: {}})
        .unwind('keywords')
        .group({ _id: "keyword", count: { '$sum': 1 }})
        .exec(function(err, res) {
          console.log('got aggregation', res)
          if(err) return cb(err, null)
          return cb(null, res[0].count)
        })
    })
  }

  _getTopTags (cb) {
    this.app.emit('storage.getModel', 'Action', (err, Action) => {
      if(err) return this.app.log.error('error')
      Action.aggregate({$match: {}})
        .unwind('keywords')
        .group({ _id: "$keywords", count: { '$sum': 1 }})
        .exec(function(err, res) {
          if(err) return cb(err, null)
          res = _.sortBy(res, function(r) { return -r.count })
          res = res.slice(0, 3)
          return cb(null, res)
        })
    })
  }

  _render (filename,  args) {
    return ejs.render(fs.readFileSync(filename, {encoding: 'utf8'}), args)
  }
}

module.exports = Client
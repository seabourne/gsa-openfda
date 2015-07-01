/* 
* @Author: Mike Reich
* @Date:   2015-07-01 05:58:21
* @Last Modified 2015-07-01
*/

'use strict';

var _ = require('underscore')

class API {
  constructor(app, loaded) {
    this.app = app

    this.matrix = []
    this.keys = {}

    app.on('router.gatherRoutes', (gather) =>{
      gather("/api/matrix.json", (req, res) => {
        res.send(this.matrix)
      })

      gather("/api/keywords.json", (req, res) => {
        if(_.keys(this.keys).length == 0) {
          this._processMatrix((matrix) => {
            res.send(_.keys(this.keys))
          })
        } else
          res.send(_.keys(this.keys))
      })

      gather("/api/generate", (req, res) => {
        this._processMatrix((matrix) => {
          //if(err) return res.status(500).send(err)
          res.send(matrix)
        })
      })
    })
  }

  _processMatrix (cb) {
    this._getKeywords((err, keywords) => {
      keywords.forEach((word, i) => {
        this.keys[word._id] = i
        keywords.forEach((word, index) => {
          if(!this.matrix[i]) this.matrix[i] = [0]
          this.matrix[i][index] = 0
        })
      })
      this.app.emit('storage.getModel', 'Action', (err, Action) => {
        Action.find({}, (err, res) => {
          res.forEach((action) => {
            action.keywords.forEach((keyword) => {
              var otherWords = _.without(action.keywords, keyword)
              otherWords.forEach((w) => {
                if(!this.keys[w] || !this.keys[keyword]) return
                this.matrix[this.keys[keyword]][this.keys[w]] += 1
              })
            })
          })
          cb(this.matrix)
        })
      })
      
    })
  }

  _getKeywords (cb) {
    this.app.emit('storage.getModel', 'Action', (err, Action) => {
      if(err) return this.app.log.error('error')
      Action.aggregate({$match: {}})
        .unwind('keywords')
        .group({ _id: "$keywords", count: { '$sum': 1 }})
        .exec(function(err, res) {
          console.log('got aggregation', res)
          if(err) return cb(err, null)
          res = _.sortBy(res, function(r) { return -r.count })
          res = res.slice(0, 30)
          return cb(null, res)
        })
    })
  }
}

module.exports = API
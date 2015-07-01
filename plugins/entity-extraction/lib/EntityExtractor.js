/* 
* @Author: Mike Reich
* @Date:   2015-06-30 07:04:33
* @Last Modified 2015-07-01
*/

'use strict';

var request = require('request')
var _ = require('underscore')

class EntityExtractor {
  constructor(app, loaded) {

    this.queue = []
    this.running = false
    this.app = app

    app.on('fda.record', this._processRecord.bind(this))

    setInterval(() => {
      if(!this.running && this.queue.length > 0) this._processYQL(this.queue.shift()) 
    }, 50)

    loaded()  
  }

  _processRecord (record) {
    this.app.log.debug('entity processing record')
    this.queue.push([record, () => {
      this.running = false
      process.nextTick(() => {
        this._processYQL(this.queue.shift())
      })
    }])
  }

  _processYQL (q) {
    if(!q) return
    this.running = true
    var record = q[0]
    var next = q[1]
    var query = "select * from contentanalysis.analyze where text='" 
    query += this._cleanContent(record.reason_for_recall)+". "
    //query += this._cleanContent(record.product_description)+". "
    //query += this._cleanContent(record.distribution_pattern)+"';"
    query += "';"
    var qstring = "https://query.yahooapis.com/v1/public/yql"
    var opts = {q: query, format: 'json'}
    
    request.post({url: qstring, form: opts}, (err, response, data) => {
      try {
        var data = JSON.parse(data)
      } catch (e) {
        next()
        return this.app.log.error('Error parsing return', e)
      }
      
      if(err) {
        next()
        return this.app.log.error('Error requesting YQL', err)
      }
      
      if(data.error) {
        next()
        return this.app.log.warn("YQL returned an error", data.error)
      }
      
      if(!data.query && !data.query.results) {
        next()
        return this.app.log.warn('YQL didnt return any results')
      }
      
      var categories = []
      var entities = []
      
      if(data.query.results && data.query.results.yctCategories && data.query.results.yctCategories.yctCategory)
        categories = this._extractCategories(data.query.results.yctCategories.yctCategory)

      if(data.query.results && data.query.results.entities && data.query.results.entities.entity)
        entities = data.query.results.entities.entity
            
      record.topics = categories
      record.keywords = this._extractEntities(entities)

      this.app.emit('entity.record', record)

      next()
    })
  }


  _extractCategories (categories) {
    return _.compact(_.map(categories, (c) => {
      if(c.content)
        return c.content.toLowerCase()
      else
        return null
    }))
  }

  _extractEntities (entities) {
    return _.compact(_.map(entities, (entity) => {
      if(entity.text && entity.text.content)
        return entity.text.content.toLowerCase()
    }))
  }

  _cleanContent (text) {
    return text.replace(/\'/g, "\\'");
  }
}

module.exports = EntityExtractor



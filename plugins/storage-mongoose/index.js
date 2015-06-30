/* 
* @Author: Mike Reich
* @Date:   2015-06-22 10:50:46
* @Last Modified 2015-06-22
*/

'use strict';

var mongoose = require('mongoose')
var _ = require('underscore')

var Base = require('./lib/Base')

var app

class MongooseStorage {

  constructor(a, loaded) {

    app = a

    this.models = {}

    this.schemas = {}

    this.dbConfig = app.config.db

    app.on('storage.set', this.connect.bind(this))
  }

  /*
    `_gatherSchema` is emitted with `storage.gatherSchemas` to allow
     plugins to register their schemas
   */
  _gatherSchema (collection, schema, options) {
    var compiledSchema = schema(mongoose)
    this.schemas[collection] = compiledSchema

    if (options && options.addBaseFields) {
      this.schemas[collection] = Base(this.schemas[collection], options)
    }
  }

  /*
    `_loadModels` gathers schemas using `_gatherSchema` and then loads
    them as mongoose models by key
   */
  _loadModels () {
    app.emit('storage.gatherSchemas', this._gatherSchema.bind(this))

    _.each(this.schemas, function (schema, collection) {
      if (!this.models[collection]) this.models[collection] = mongoose.model(collection, schema)
    }, this)

    app.models = this.models
  }

  /*
    `_captureConnection` captures the mongoose connection on this
    storage object for convenience
   */
  _captureConnection () {
    this.conn = mongoose.connection
  }

    /*
      `_initialize` is called on a successfull connection to setup models
      and register event handlers
     */
  _initialize (storage) {
    this._captureConnection()
    this._loadModels()
    this._registerEvents()
  }

    /*
      `_registerEvents` is called to register this plugin's event handlers
     */
  _registerEvents () {
    /*
      The `storage.getModel` event takes a `name` and `callback` parameter
      and attempts to return the given model by name
     */
    app.on('storage.getModel', (function(name, callback) {
      if (!this.models[name]) {
        return callback(new Error('No model with name `' + name + '` found'))
      }

      callback(null, this.models[name])
    }).bind(this))

    /*
       The `storage.getModels` event takes a `names` and `callback` parameter
       and attempts to return the given models by name in the `names` array parameter
     */
    app.on('storage.getModels', (function(names, callback) {
      if (!_.isArray(names)) {
        return callback(new Error('storage.getModels takes an array of modelNames as its first parameter'))
      }

      callback(null, _.reduce(names, function(models, modelName) {
        models[modelName] = this.models[modelName]
        return models
      }, {}, this))
    }).bind(this))
    
    /*
      The `storage.multiQuery` event takes an `queries` parameter which is an 
      object keyed by model name where each value is the query to execute on 
      the keyed model e.g.
      
        {
          DataSet: { _id: 1231289mnasldkn123 },
          Report: { _id: 123kasdasd908234rwf }
        }
      
      It also takes a single `callback` parameter which will be called with
      `error` and `results` parameters on completion of the queries
     */
    app.on('storage.multiQuery', (queries, callback) => {
      var modelNames = _.keys(queries)
      
      app.emit('storage.getModels', modelNames, (err, models) => {
        var queryTasks = _.reduce(queries, (tasks, q, modelName) => {
          tasks[modelName] = (cb) => {
            models[modelName].find(q).exec((err, result) => {
              cb(err, result)
            })  
          }
          return tasks
        }, {})
        
        async.parallel(queryTasks, callback)
      })
    })
  }

    /*
      `connect` is the only public method on this plugin and is called below
      in the exported function on the `storage.set` event
     */
  connect (storage) {
    mongoose.connection.on('error', function (err) {
      console.error(err)
      app.log.error('Mongoose connection error: ', err)
    })

    mongoose.connection.once('open', (function () {
      app.log.info('Mongoose connection successful:', mongoose.connection.host + ":" + mongoose.connection.port)
      this._initialize(storage)
      app.emit('storage.ready')

      app.on('app.stop', function() {
        mongoose.disconnect()
      })
    }).bind(this))
    mongoose.connect(this.dbConfig)
  }

}

module.exports = function(app, loaded) {

  var newStore = new MongooseStorage(app, loaded)

}
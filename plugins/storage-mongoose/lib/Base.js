/* 
* @Author: Mike Reich
* @Date:   2015-06-22 10:53:20
* @Last Modified 2015-06-22 @Last Modified time: 2015-06-22 10:53:20
*/

'use strict';

var mongoose = require('mongoose')

module.exports = function Base(schema, options) {

  schema.add({
    createdAt: Date,
    updatedAt: Date
  })

  schema.pre('save', function(next) {
    if (!this.__v) {
      this.createdAt = Date.now()
    }
    this.updatedAt = Date.now()
    next()
  })

  return schema

}

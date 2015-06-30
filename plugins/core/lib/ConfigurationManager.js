/* 
* @Author: mike
* @Date:   2015-05-18 17:04:13
* @Last Modified 2015-06-22
* @Last Modified time: 2015-06-22 11:04:37
*/

'use strict';

var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var appDir = path.dirname(require.main.filename)

class ConfigurationManager {

  getNodeEnv() {
    return process.env.NODE_ENV || 'local'
  }

  getPackageJSONConfig() {
    var jsonPath = path.resolve(appDir + '/package.json')
    var jsonParsed = JSON.parse(fs.readFileSync(jsonPath))
    if(jsonParsed.config)
      return jsonParsed.config[this.getNodeEnv()]
    else
      return {}
  }

  getEnvironmentVariables() {
    // alias the MONGO_URI variable as `db`
    if (process.env.MONGO_URI) {
      process.env.db = process.env.MONGO_URI
    }
    // default port for HTTP
    if (!process.env.PORT) {
      process.env.PORT = 3000
    }
    return process.env
  }

  getConfig() {
    return _.extend(
      // Read the config in the app's package.json
      this.getPackageJSONConfig() || {},
      // Environment variables take precedence
      this.getEnvironmentVariables(),
      // but NODE_ENV must be present so, ensure it
      {NODE_ENV: this.getNodeEnv()}
    )
  }
}

module.exports = new ConfigurationManager()
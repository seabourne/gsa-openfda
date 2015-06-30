/* 
* @Author: mike
* @Date:   2015-05-18 17:05:09
* @Last Modified 2015-06-22
* @Last Modified time: 2015-06-22 10:19:40
*/

'use strict';

var findup = require('findup-sync')
var multimatch = require('multimatch')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

class PluginManager {

  get(options) {
    options = options || {}

    var packages = []

    this.loadCustomPlugins(options, packages)

    return packages
  }

  arrayify(el) {
    return Array.isArray(el) ? el : [el]
  }

  getPluginPackageJson(path) {
    return JSON.parse(fs.readFileSync(path + "/package.json", "utf8"))
  }

  loadCustomPlugins(options, packages) {
    if (!fs.existsSync('./plugins')) return

    var customPluginDirs = fs.readdirSync('./plugins')
    
    customPluginDirs.forEach((name) => {
      if(name == 'core') return
      var pkg = require(path.resolve('./plugins/' + name))
      pkg._packageJson = this.getPluginPackageJson('./plugins/' + name)
      packages.push(pkg)
    })
  }
}

module.exports = new PluginManager()
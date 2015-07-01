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
        var content = this._render(__dirname+"/../views/viz_1.ejs")
        res.send(this._render(__dirname+"/../theme/index.ejs", {content: content}))
      })
    })
  }

  _render (filename,  args) {
    return ejs.render(fs.readFileSync(filename, {encoding: 'utf8'}), args)
  }
}

module.exports = Client
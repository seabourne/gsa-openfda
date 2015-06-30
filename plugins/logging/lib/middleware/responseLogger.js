/* 
* @Author: mike
* @Date:   2015-05-18 17:42:32
* @Last Modified 2015-05-18eich
* @Last Modified time: 2015-05-18 17:42:34
*/

'use strict';

var requestMetadata = require('../util/requestMetadata');

module.exports = function(app) {
    return function(req, res, next) {
        var end = res.end;

        res.end = function (chunk, encoding) {
            res.end = end;
            /*var metadata = requestMetadata.getMetadata(req);*/
            var user = 'not authenticated';
            if (req.user != null) {
                user = req.user.email;
            }
            app.log(req.method, req.url, res.statusCode, user);
            res.end(chunk, encoding);
        };

        next();
    };
};
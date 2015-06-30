/* 
* @Author: mike
* @Date:   2015-05-18 17:44:12
* @Last Modified 2015-05-18eich
* @Last Modified time: 2015-05-18 17:44:18
*/

'use strict';

module.exports = {
    getMetadata: function(req) {
        var metadata = {};
        if (req != null) {
            metadata.params = req.params;
            metadata.url = req.path;
        }
        if (req.user != null) {
            metadata.user = {
                email: req.user.email,
                name: req.user.name,
                _id: req.user._id
            };
        }
        return metadata;
    }
};
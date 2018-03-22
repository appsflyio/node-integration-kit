/**
 * Created by mohitbhansali on 22/03/18.
 */
"use strict";

var jsonwebtoken = require("jsonwebtoken");
var _ = require("underscore");

module.exports.IntegrationKit = {
    generateChecksum: function(data, key, cb) {
        jsonwebtoken.sign(data, key, function(error, token) {
            cb(undefined, token)
        });
    },
    verifyChecksum: function(data, key, token) {
        try {
            return jsonwebtoken.verify(token, key, function (error, response) {
                if(!error) {
                    if(response) {
                        return _.isMatch(response,data);
                    }
                }
                return false;
            });
        } catch(error) {
            return false;
        }
    }
};
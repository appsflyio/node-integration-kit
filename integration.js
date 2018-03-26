/**
 * Created by mohitbhansali on 22/03/18.
 */
"use strict";

var jsonwebtoken = require("jsonwebtoken");

module.exports.IntegrationKit = {
    generateChecksum: function(data, key, cb) {
        let payload = {"af_claim": data};
        jsonwebtoken.sign(payload, key, function(error, token) {
            cb(undefined, {"af_data":token})
        });
    },
    verifyChecksum: function(token, key, cb) {
        try {
            jsonwebtoken.verify(token.af_data, key, function (error, response) {
                if(!error) {
                    if(response) {
                        cb(undefined,response.af_claim);
                    }
                } else {
                    cb(error);
                }
            });
        } catch(error) {
            cb(error);
        }
    }
};
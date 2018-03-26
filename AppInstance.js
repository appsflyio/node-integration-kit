/**
 * Created by mohitbhansali on 26/03/18.
 */
"use strict";

let request = require("request");
let IntegrationKit = require("./integration").IntegrationKit;


let AppInstance = function (config) {
    this.config = config;
    if(!this.config.repoUrl) {
        this.config.repoUrl = 'https://hub.appsfly.io';
    }
    return this;
};

AppInstance.prototype.exec = function(module_handle, intent, payload, userID) {
    userID = userID || "generic";
    payload = payload || {};
    return new Promise((resolve, reject) => {
        let body = {
            intent: intent,
            data: payload
        };
        IntegrationKit.generateChecksum(payload, this.config.secret, (err, checksum) => {
            if(!err){
                request.post({
                    url:this.config.repoUrl + "/executor/exec",
                    method:"POST",
                    json:{"af_data":checksum},
                    headers:{
                        "X-Module-Handle":module_handle,
                        "X-App-Key":this.config.appKey,
                        "X-UUID":userID
                    }
                }, (err, resp, body) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        IntegrationKit.verifyChecksum(body, this.config.secret, (err, response) => {
                            if(!err) {
                                resolve(response);
                            }
                        });
                    }
                });
            }
            else{
                reject(err);
            }
        })
    });
};

module.exports.AppInstance = AppInstance;
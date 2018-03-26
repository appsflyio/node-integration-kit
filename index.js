/**
 * Created by mohitbhansali on 26/03/18.
 */
"use strict";

let request = require("request");
let IntegrationKit = require("./integration").IntegrationKit;

class AppInstance {
    constructor(config) {
        this.config = config;
        if(!this.config.repoUrl) {
            this.config.repoUrl = 'https://hub.appsfly.io';
        }
    }

    exec(module_handle, intent, payload, userID) {
        userID = userID || "generic";
        payload = payload || {};
        return new Promise((resolve, reject) => {
            let body = {
                intent: intent,
                data: payload
            };
            IntegrationKit.generateChecksum(body, this.config.secret, (err, checksum) => {
                if(!err){
                    request.post({
                        url:this.config.repoUrl + "/executor/exec",
                        method:"POST",
                        json:checksum,
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
    }
}

module.exports.AppInstance = AppInstance;
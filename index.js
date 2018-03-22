"use strict";

let request = require("request");
let IntegrationKit = require("./integration").IntegrationKit;


let AppInstance = function (config) {
    this.config = config;
    return this;
};

AppInstance.prototype.exec = function(module_handle, intent, payload, userID) {
    userID = userID || "generic";
    return new Promise(function(resolve, reject) {
        let body = {
            intent: intent,
            data: payload
        };
        let payload = JSON.stringify(body) + "|" + module_handle + "|" + this.config.appKey + "|" + userID;
        IntegrationKit.generateChecksum(payload, this.config.secret, (err, checksum) => {
            if(!err){
                request.post({
                    url:this.config.repoUrl + "/executor/exec",
                    method:"POST",
                    json:body,
                    headers:{
                        "X-Module-Handle":module_handle,
                        "X-App-Key":this.config.appKey,
                        "X-Checksum":checksum,
                        "X-UUID":userID
                    }
                }, (err, resp, body) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        if(IntegrationKit.verifyChecksum(body, this.config.secret, resp.headers["X-Checksum"])) {
                            resolve(JSON.parse(body));
                        }
                        else{
                            reject({message:"Checksum Validation Failed"});
                        }
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


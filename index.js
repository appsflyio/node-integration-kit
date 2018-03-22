"use strict";

var request = require("request");
var IntegrationKit = require("./integration").IntegrationKit;


var AppInstance = function (config) {
    this.config = config;
    return this;
};

AppInstance.prototype.exec = function(module_handle, intent, payload, userID) {
    userID = userID || "generic";
    return new Promise(function(resolve, reject) {
        var body = {
            intent: intent,
            data: payload
        };
        var payload = JSON.stringify(body) + "|" + module_handle + "|" + this.config.appKey + "|" + userID;
        IntegrationKit.generateChecksum(payload, this.config.secret, function (err, checksum) {
            if(!err){
                request.post({
                    url:this.config.executorUrl + "/executor/exec",
                    method:"POST",
                    json:body,
                    headers:{
                        "X-Module-Handle":module_handle,
                        "X-App-Key":this.config.appKey,
                        "X-Checksum":checksum,
                        "X-UUID":userID
                    }
                }, function (err, resp, body) {
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


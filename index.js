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
            if(!this.config.secret){
	            request.post({
		            url:this.config.repoUrl + "/executor/exec",
		            method:"POST",
		            json:body,
		            headers:{
			            "X-Module-Handle":module_handle,
			            "X-App-Key":this.config.appKey,
			            "X-UUID":userID
		            }
	            }, function(error, response, body){
	                if(response.statusCode >=400){
		                reject(body.error);
                    }
                    else{
		                resolve(body);
                    }
	            })

            }
            else{
	            IntegrationKit.generateChecksum(body, this.config.secret, (err, data) => {
		            if(!err){
			            request({
				            url:this.config.repoUrl + "/executor/exec",
				            method:"POST",
                            body:data,
				            headers:{
					            "X-Module-Handle":module_handle,
					            "X-App-Key":this.config.appKey,
					            "X-UUID":userID,
					            "X-Encrypted":true
				            }
			            }, (err, response, body) => {
				            if(response.statusCode >=400){
					            reject(body);
				            }
				            else{
					            IntegrationKit.verifyChecksum(body, this.config.secret, (err, response) => {
						            if(!err) {
							            resolve(response);
						            }
						            else{
						                var checksumError = new Error();
							            checksumError.message = "Checksum not verified";
							            checksumError.code = 403;
						                reject(checksumError);
                                    }
					            });
				            }
			            });
		            }
		            else{
			            reject(err);
		            }
	            })

            }
        });
    }
}

module.exports = AppInstance
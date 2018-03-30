# About Nodejs Integration Kit
This library contains resources to help communicate with appsfly.io execution server.
For all communications with execution server, your application should be registered and a secret key needs to be generated. 

Please contact integrations@appsfly.io for your credientials.

#  Get Started
 <a name="SECRET_KEY"></a><a name="APP_KEY"></a><a name="EXECUTOR_URL"></a>
#### Application Params
| Key | Description |
| --- | --- |
| SECRET_KEY   | Secret Key is required for encryption. Secret Key should be generated on the Appsfly publisher dashboard |
| APP_KEY  | Application key to identify the publisher instance |

**NOTE:** Above params are needed for checksum generation. Please refer to the methods mention below.

 <a name="MODULE_HANDLE"></a> <a name="UUID"></a>
#### Micro Module Params

| Key | Description |
| --- | --- |
| MODULE_HANDLE  | Each micromodule of a service provider is identified by MODULE_HANDLE |
| UUID  | UniqueID to identify user session|

 <a name="INTENT"></a> <a name="PAYLOAD"></a>
#### Intent Params
| Key | Description |
| --- | --- |
| INTENT | Intent is like an endpoint you are accessing to send message |
| PAYLOAD | Data payload |

# Integration options  

### Option 1: SDK
The SDK can be included to handle authorization. There is no need for you to handle checksum generation and verification.

##### Install

`npm i node-integration-kit --save`

OR

`npm install node-integration-kit --save`


##### Configuration
```
var nodeIntegrationKit = require("node-integration-kit");
var app = new nodeIntegrationKit.AppInstance({secret:"SECRET_KEY", appKey:"APP_KEY"});
```  
##### Execution
```
app.exec("MODULE_HANDLE", "INTENT", JSON.parse(PAYLOAD), UUID).then(function(result){
 //Handle Result
}).else(function(error){
 //Handle Error
});
```

### Option 2: API Endpoint
appsfly.io exposes a single API endpoint to access Microservices directly.

##### Endpoint
[EXECUTOR_URL](#EXECUTOR_URL)/executor/exec

##### Method
POST

##### Headers
| Header | Description |
| --- | --- |
| X-UUID | [UUID](#UUID) |
| X-App-Key | [APP_KEY](#APP_KEY)|
| X-Module-Handle | [MODULE_HANDLE](#MODULE_HANDLE)|
| X-Encrypted | BOOLEAN |
| Content-Type | Must be "text/plain" |

#### Body
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZl9jbGFpbSI6IntcImludGVudFwiOlwiSU5URU5UXCIsXCJkYXRhXCI6XCJQQVlMT0FEXCJ9In0.ZPUfElCCO2FiSQwtur6t80kHFTOzsvnJGQ-j_70WZ0k
```
Body must have the encrypted checksum for the following JSON. Please use [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) to generate and verify checksum.
[INTENT](#INTENT), [PAYLOAD](#PAYLOAD)
``` 
{
  "intent":"INTENT",
  "data":"PAYLOAD"
} 
 ```
Covert the above JSON to string and append it to key "af_claim" as follows:
``` 
{"af_claim": "{\"intent\":\"INTENT\", \"data\":\"PAYLOAD\"}"}
 ```

----------------------------------------

### Micro Service Response
The response of the microservices is encrypted and you will be needing JWT decode or verify with the secret key to decode the response. After decode, the response is in "af_claim" key. Please go through [this documentation](https://github.com/appsflyio/micro-module-documentations) for different microservices.

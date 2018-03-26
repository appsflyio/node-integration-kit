/**
 * Created by mohitbhansali on 22/03/18.
 */
/*
let AppInstance = require("./index");


let repoUrl = "https://microapps.appsfly.io/executor/exec";
let secretKey = "";
let appKey = "";
AppInstance = new AppInstance({repoUrl:repoUrl, secretKey:secretKey, appKey:appKey});


let module_handle = "";
let intent = "";
let payload = "";
let userID = "";
let response = AppInstance.exec(module_handle, intent, payload, userID);
console.log(response);*/

//let IntegrationKit = require("./index").IntegrationKit;

let appKey = "abb3f71c-a8cc-4f2a-90aa-23ac3771f5f7";
let moduleHandle = "io.appsfly.msctpactivities";
let secretKey = "3384354330428323";

let AppInstance = require("./index");

const normalInstance = new AppInstance({
    appKey:appKey,
    repoUrl:"https://microapps.appsfly.io"
});

const secureInstance = new AppInstance({
	appKey:appKey,
	secret:secretKey,
	repoUrl:"https://microapps.appsfly.io"
})

let response = secureInstance.exec(moduleHandle, "fetch_cities", {});

response.then(function(data){
    console.log(data);
},function(error){
	console.log(error);
})



//console.log(IntegrationKit.verifyChecksum(payload,secretKey,"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZl9jbGFpbSI6IntcImRhdGFcIjp7fSxcImludGVudFwiOlwiZmV0Y2hfY2l0aWVzXCJ9fGlvLmFwcHNmbHkubXNjdHBhY3Rpdml0aWVzfGFiYjNmNzFjLWE4Y2MtNGYyYS05MGFhLTIzYWMzNzcxZjVmN3xnZW5lcmljIn0.535iymBLmADaREsT520IoUWfBOtrl9eWATK00rXCQws"));
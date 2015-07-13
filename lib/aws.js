var AWS = require('aws-sdk');
var Promise = require('Promise');
require('dotenv').load();

var sqs = new AWS.SQS({region:'us-east-1'});
var queueUrl;

function fetchQueueUrl(){
	return Promise.denodeify(sqs.getQueueUrl.bind(sqs))({QueueName:'milight'})
		.then(function fulfilled(resp){
			queueUrl = resp.QueueUrl;
			return queueUrl;
		},
		function rejected(err){
			console.error("Error getting queue url:",err.stack);
		}
	);
}

var getQueueUrl = function(){
	return new Promise(function(resolve,reject){
		if (typeof queueUrl == 'string') {
			console.log("Already have url:",queueUrl);
			resolve(queueUrl);
		} else if (queueUrl instanceof Promise){
			console.log("Another queue URL request already in progress...");
			queueUrl.then(function(){
				console.log("OK, got URL:",queueUrl);
				resolve(queueUrl);
			});
		} else {
			console.log("Need to fetch URL");
			queueUrl = fetchQueueUrl().then(
				function(url){
					queueUrl = url;
					resolve(url);
				},
				function(err){reject(err);}
			);
		}
	});
};

var sendMessage = function(message){
	return getQueueUrl()
		.then(function(url){
			return Promise.denodeify(sqs.sendMessage.bind(sqs))({
				QueueUrl:url,
				MessageBody:(typeof message == 'string')? message : JSON.stringify(message)
			}).then(function fulfilled(resp){
				return resp;
			},function rejected(err){
				console.error(err);
			});
		},function failedGetQueueUrl(err){
			throw err;
		});
};

module.exports.getQueueUrl = getQueueUrl;
module.exports.sendMessage = sendMessage;

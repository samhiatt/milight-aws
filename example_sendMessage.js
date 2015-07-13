var aws = require('./lib/aws');

//aws.getQueueUrl().then(function(url){console.log("url:",url)});

aws.sendMessage({foo:"bar"})
	.then(function(resp){
		console.log("RESP:",resp);
	}).catch(function(err){
		console.error("ERROR:",err);
	});

aws.sendMessage({foo:"baz"})
	.then(function(resp){
		console.log("RESP:",resp);
	}).catch(function(err){
		console.error("ERROR:",err);
	});



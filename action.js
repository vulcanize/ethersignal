var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider());

document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('openPane').addEventListener('click', function(evt) {
	    chrome.tabs.create({windowId: window.id, url:chrome.extension.getURL('standalone.html')});
	}, false);
	var latest = web3.eth.filter('latest');
	latest.watch(function(err,blockHash){
		web3.eth.getBlock(blockHash, false, function(err, block) {
			console.log(block);
		});
	});	
}, false);

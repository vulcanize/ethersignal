document.addEventListener('DOMContentLoaded', function(){

	var Web3 = require('web3');
	var web3 = new Web3();
	
	web3.setProvider(new web3.providers.HttpProvider());

	console.log(web3.eth.accounts);	

}, false);

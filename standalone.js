var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider());
var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "proposals", "outputs": [ { "name": "name", "type": "string", "value": "Do you support the hard fork?" }, { "name": "description", "type": "string", "value": "\"Decentralization without decentralized social responsibility is terrifying\"\\n-Vlad Zamfir" }, { "name": "creator", "type": "address", "value": "0xb2445f120a5a4fe73c4ca9b3a73f415371b5656b" }, { "name": "active", "type": "bool", "value": true } ], "type": "function" }, { "constant": true, "inputs": [], "name": "numberOfProposals", "outputs": [ { "name": "_numberOfProposals", "type": "uint256" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalID", "type": "uint256" }, { "name": "position", "type": "bool" } ], "name": "vote", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalName", "type": "string" }, { "name": "proposalDescription", "type": "string" } ], "name": "newProposal", "outputs": [], "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "position", "type": "bool" }, { "indexed": false, "name": "voter", "type": "address" } ], "name": "userVotedEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalName", "type": "string" }, { "indexed": false, "name": "proposalDescription", "type": "string" }, { "indexed": false, "name": "creator", "type": "address" } ], "name": "proposalCreatedEvent", "type": "event" } ];
var ethSignal = web3.eth.contract(abi).at('0xC02Ea113dA1B827eF74d1F8d40A7B03545DB1a4d');
document.addEventListener('DOMContentLoaded', function(){
	var blockNumber = document.getElementById("blockNumber");
	var blockTime = document.getElementById("blockTime");
	var counter = document.getElementById("counter");
	var count = 0;
	var latest = web3.eth.filter('latest');
	setInterval(function(){ count += 1; counter.innerHTML = count + " seconds"}, 1000);
	latest.watch(function(err,blockHash){
		web3.eth.getBlock(blockHash, false, function(err, block) {
			//console.log(block);
			blockNumber.innerHTML = block.number;
			var date = new Date(0);
			date.setUTCSeconds(block.timestamp);
			blockTime.innerHTML = date.toString();
			count = 0;
			counter.innerHTML = count + " seconds";
		});
	});	
}, false);

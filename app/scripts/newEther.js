console.log("newether");
var isMist = typeof web3 !== 'undefined';

if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
    // If there's a web3 library loaded, then make your own web3
    web3 = new Web3(web3.currentProvider);
} else if (typeof Web3 !== 'undefined') {
    // If there isn't then set a provider
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
} else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
    var Web3 = require('web3');
    web3 = new Web3(new Web3.providers.HttpProvider("htts://signal.ether.ai/proxy"));
    // If there is neither then this isn't an ethereum browser
}


var ethersignalContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"endSignal","outputs":[],"type":"function"},{"inputs":[{"name":"rAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"},{"anonymous":false,"inputs":[],"name":"EndSignal","type":"event"}]);
var positionregistryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"}],"name":"registerPosition","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regAddr","type":"address"},{"indexed":true,"name":"sigAddr","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"text","type":"string"}],"name":"LogPosition","type":"event"}]);
var positionregistry = positionregistryContract.at('0x0265a5b822625ca506c474912662617c394bbb66')


var to = '0x0265a5b822625ca506c474912662617c394bbb66';

var connected = web3.isConnected();
// var connected = true;
// console.log("connected: ", connected);


app.directive('networkStats', ['ethereum', '$interval','$rootScope',  function(ethereum, $interval, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'new-networkstats.html',
		link: function(scope) {
			$interval(function() {
			
				if ($rootScope.pending)
					return;	
				else if (scope.sinceLastBlock <= 20)
					scope.syncState = 'good';
				else if (scope.sinceLastBlock > 20 && scope.sinceLastBlock < 60)
					scope.syncState = 'warning';
				else 
					scope.syncState = 'bad';
				scope.sinceLastBlock += 1;
			}, 1000);
			
		}
	}
}]);

app.directive('accountSelector', ['ethereum','ethSignalContract','$rootScope', function(ethereum, ethSignalContract, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'new-accountselector.html',
		link: function(scope) {
			var contract = ethSignalContract;
			scope.accounts = ethereum.accounts;
			scope.user = {defaultAccount:'coinbase'};
			scope.$watch('user.defaultAccount', function(newVal, oldVal) {
				console.log(contract);
				if(oldVal == newVal)
					return;
				console.log("Setting defaultAccount to: ", newVal);
				ethereum.web3.eth.defaultAccount = newVal;
			});

			scope.newProposal = function() {
				if ($rootScope.newProposals.length != 0)
					return;
				$rootScope.newProposals.push({name:"", description:""});
			};
		}
	}	
}]);

app.directive('proposalsList', ['proposalService','ethereum','$rootScope', function(proposalService, ethereum, $rootScope) {

	return {
		restrict: 'E',
		templateUrl: 'new-proposalslist.html',
		link: function(scope) {
			scope.proposals = proposalService.proposals; 	
			scope.newProposals = $rootScope.newProposals;
			scope.percentage = function(a, b){
				return a + b;
			}

			scope.cancel = function() {
				$rootScope.newProposals = [];
			}
			scope.vote = function(proposalId, position) {
				if(angular.isUndefined(ethereum.web3.eth.defaultAccount)){
					alert("Please select an account to from the \"Select Account\" dropdown.");
					return
				}
				proposalService.vote(proposalId, position);
			};
			
			scope.createProposal = function(proposal) {
				if(angular.isUndefined(ethereum.web3.eth.defaultAccount)){
					alert("Cannot find an account.");
					return
				}
				proposalService.newProposal(proposal);
			};
		}
	}
}]);

app.service('ethereum', function($rootScope, $interval) {
	// TODO graceful connection handling

	// convert block timestamps into human readable strings
	function utcSecondsToString(timestamp) {
		var date = new Date(0);
		date.setUTCSeconds(timestamp);
		return date.toString();
	}
	function getCurrentNetwork(networkId) {
		if (networkId == 1)
			return 'Main-Net';
		if (networkId == 2)
			return 'Test-Net';
	}
	function getConnectionStatus(connected) {
		if (connected)
			return 'connected';
		return 'disconnected';
	}

	function getEtherscanUrl(networkId) {
		if(networkId == 1)
			return 'https://etherscan.io/tx';
		if (networkId == 2)
			return 'https://testnet.etherscan.io/tx';
	}

	// TODO improve
	web3.eth.defaultAccount = web3.eth.accounts[0];

	$rootScope.pending = true;	
	$rootScope.syncState = 'warning';
	$rootScope.currentBlock = 'SYNCING';
	$rootScope.currentBlockTime = 'SYNCING';
	$rootScope.sinceLastBlock = 0;
	if(connected) {
		$rootScope.ethereumNetwork = getCurrentNetwork(web3.version.network); 
		$rootScope.etherscanUrl = getEtherscanUrl(web3.version.network); 
	}
	var state = web3.isConnected();
	$rootScope.connectionStateDisplay = getConnectionStatus(state);
	$rootScope.connectionState = state;
	$interval(function() {
		newState = web3.isConnected();
		if (newState != state){
            location.reload();
        }
	}, 7500);

	//subscribe to all new blocks from the Ethereum blockchain
	//update global network statistics on $rootScope
	var accounts = null;
	if(connected) {
		(function pollNetworkStats() {
			var latest = web3.eth.filter('latest');
			latest.watch(function(err,blockHash){
				web3.eth.getBlock(blockHash, false, function(err, block) {
					$rootScope.pending = false;
					$rootScope.currentBlock = block.number;
					$rootScope.currentBlockTime = utcSecondsToString(block.timestamp);
					$rootScope.sinceLastBlock = -1;
				});
			});
		})();
		accounts = web3.eth.accounts[0];
	}
	var accounts = web3.eth.accounts[0];
	return {
		//make web3 available as a property of this service
		web3: web3,
		accounts: accounts
	};
});


app.service('ethSignalContract',['ethereum', function(ethereum) {
	var web3 = ethereum.web3;
	var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "proposals", "outputs": [ { "name": "name", "type": "string", "value": "Do you support the hard fork?" }, { "name": "description", "type": "string", "value": "\"Decentralization without decentralized social responsibility is terrifying\"\\n-Vlad Zamfir" }, { "name": "creator", "type": "address", "value": "0xb2445f120a5a4fe73c4ca9b3a73f415371b5656b" }, { "name": "active", "type": "bool", "value": true } ], "type": "function" }, { "constant": true, "inputs": [], "name": "numberOfProposals", "outputs": [ { "name": "_numberOfProposals", "type": "uint256" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalID", "type": "uint256" }, { "name": "position", "type": "bool" } ], "name": "vote", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "proposalName", "type": "string" }, { "name": "proposalDescription", "type": "string" } ], "name": "newProposal", "outputs": [], "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "position", "type": "bool" }, { "indexed": false, "name": "voter", "type": "address" } ], "name": "userVotedEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "proposalName", "type": "string" }, { "indexed": false, "name": "proposalDescription", "type": "string" }, { "indexed": false, "name": "creator", "type": "address" } ], "name": "proposalCreatedEvent", "type": "event" } ];
	return web3.eth.contract(abi).at(to);
}]);



var allThings = {};

app.service('proposalService', ['ethSignalContract', '$q','ethereum','$rootScope',  function(ethSignalContract, $q, ethereum, $rootScope) {
	// get all the questions
	// console.log("proposalService");
	// $('#loadingModal').modal('show');

	var positions = []
	$rootScope.newProposals = [];

	positionregistry.LogPosition({}, {fromBlock:1200000}).get(function(err,evt) {
		if (err) console.warn()

		for (obj in evt) {
			// console.log(evt[obj]);
			getSigList(evt[obj])
		}
	})

	function getSigList(input){
		var address = input.args.sigAddr
		allThings[address] = {}
		allThings[address].raw = input

		// console.log("getSigList", address);
		var etherSig = ethersignalContract.at(address)
		etherSig.LogSignal({}, {fromBlock:1200000}).get(function(err,evt) {
			if (err) console.warn("warning")

			// $('#loadingModal').modal('hide')
			allThings[address].sigList = evt

			var proMap = {};
			var antiMap = {};

			for (obj in evt){
				if (evt[obj].args.pro) {
					proMap[evt[obj].args.addr] = 1;
					antiMap[evt[obj].args.addr] = 0;
				} else {
					proMap[evt[obj].args.addr] = 0;
					antiMap[evt[obj].args.addr] = 1;
				}
			}
			CalcSignal(proMap, antiMap, input)	
		})	
	}

	function calcPercent(A, B){
		var res = []
		res[0] = Math.round(A * 100.0 / (A + B))
		res[1] = Math.round(B * 100.0 / (A + B))
		return res 
	}	

	function CalcSignal(proMap, antiMap, input) {
		var totalPro = 0;
		var totalAgainst = 0;		
		// call getBalance just once per address
		Object.keys(proMap).map(function(a) {
			var bal = web3.fromWei(web3.eth.getBalance(a));
			proMap[a] = proMap[a] * bal;
			antiMap[a] = antiMap[a] * bal;
		});

		// sum the pro and anti account values
		Object.keys(proMap).map(function(a) { totalPro += parseFloat(proMap[a]); });
		Object.keys(antiMap).map(function(a) { totalAgainst += parseFloat(antiMap[a]); });

		// console.log(totalPro);
		// console.log(totalAgainst);
		var percent = calcPercent( totalPro, totalAgainst );	

		positions.push({title: input.args.title, desc: input.args.text, regAddr: input.args.regAddr, pro: Math.round(totalPro), against: Math.round(totalAgainst), percent: percent, sigAddr: input.args.sigAddr})
		console.log(positions);
	}

	return {
		proposals: positions,
		// votes: votes,
		percentage: function(inP){
			console.log(out);
		},
		vote: function(posSigAddr, proBool) {
			console.log(posSigAddr, proBool);
			var from = ethereum.web3.eth.defaultAccount;
			var etherSig = ethersignalContract.at(posSigAddr)
			try {
				$rootScope.lastTx = etherSig.setSignal(proBool, {from: from});
			}
			catch(e) {
				console.log("Error submitting signal");
				console.log(e);
				alert("Error submitting signal")
				// var passphrase = prompt("Please enter your passphrase: ");
				// console.log(from);
				// console.log(passphrase);
				// var unlocked = ethereum.web3.personal.unlockAccount(from, passphrase);
				// if (unlocked) {
				// 	console.log(from, " unlocked.");
				// 	$rootScope.lastTx = ethSignalContract.vote(proposalId, position)
				// 	console.log($rootScope.lastTx);
				// 	ethereum.web3.personal.lockAccount(from);
				// 	console.log(from, " locked.");
				// 	console.log("Voted ", position, " on proposal: ", proposalId);
				// }	
				// else {
				// 	alert("Incorrect passphrase");
				// 	throw(e);
				// }
			}
		},
		newProposal: function(proposal) {

			console.log(ethereum.web3.eth.defaultAccount);
			from = ethereum.web3.eth.defaultAccount;
			// var data = ethSignalContract.newProposal.getData(proposal.name, proposal.description);
			var data = positionregistry.registerPosition.getData(proposal.name, proposal.description);
			console.log("data ", data);
			var gas = ethereum.web3.eth.estimateGas({from:from, to:to, data:data});

			console.log("gas: ", gas);
			try {
				$rootScope.lastTx = positionregistry.registerPosition.sendTransaction(proposal.name, proposal.description, {from:from, to:to, gas:gas});
			}
			catch(e) {
				console.log("Error submitting position");
				console.log(e);
				alert("Error submitting position")
				// console.log(ethereum);
				// $rootScope.lastTx = positionregistry.registerPosition.sendTransaction(proposal.name, proposal.description, {from:from, to:to, gas:gas});
				
				// var passphrase = prompt("Please enter your passphrase: ");
				// console.log(from);
				// console.log(passphrase);
				// console.log(ethereum.web3.personal.unlockAccount(from, passphrase));
				// var unlocked = ethereum.web3.personal.unlockAccount(from, passphrase);
				// if (unlocked) {
				// 	console.log(from, " unlocked.");
				// 	console.log($rootScope.lastTx);
				// 	ethereum.web3.personal.lockAccount(from);
				// 	console.log(from, " locked.");
				// }	
				// else {
				// 	alert("Incorrect passphrase");
				// 	throw(e);
				// }
			}
			$rootScope.newProposals = [];
		}		
	}

}]);


function registerPosition(){

}


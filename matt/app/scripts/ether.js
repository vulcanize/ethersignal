var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider());

// var ethersignalContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"endSignal","outputs":[],"type":"function"},{"inputs":[{"name":"rAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"},{"anonymous":false,"inputs":[],"name":"EndSignal","type":"event"}]);

// var positionregistryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"}],"name":"registerPosition","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regAddr","type":"address"},{"indexed":true,"name":"sigAddr","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"text","type":"string"}],"name":"LogPosition","type":"event"}]);

// function ListPositions() {
// 	var posMap = {};

// 	positionregistry.LogPosition({}, {fromBlock: 1200000}, function(error, result){
// 		if (!error)
// 		{
// 			posMap[result.args.sigAddr] = [result.args.title, result.args.text, result.args.regAddr];
// 		}
// 	})

// 	Object.keys(posMap).map(function(k) { console.log(k + ": " + posMap[k]); });
// }

// TODO move this out of global scope
// var to = positionregistry.address;
// console.log(positionregistry);
var to = '0x3B0C2BA7A03725E0f9aC5a55CB813823053d5eBE';

var connected = web3.isConnected();
console.log("connected " + connected);

var getBalance = web3.eth.getBalance(web3.eth.accounts[0])


app.directive('networkStats', ['ethereum', '$interval','$rootScope',  function(ethereum, $interval, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: '/views/directives/networkStats.html',
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
		templateUrl: '/views/directives/accountSelector.html',
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
		templateUrl: '/views/directives/proposalsList.html',
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
					alert("Please select an account to from the \"Select Account\" dropdown.");
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
		
		accounts = web3.eth.accounts;
	}
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

app.service('proposalService', ['ethSignalContract', '$q','ethereum','$rootScope',  function(ethSignalContract, $q, ethereum, $rootScope) {
	if(connected) {
		var proposals = [];
		$rootScope.newProposals = [];
		for (var x = 0; x < ethSignalContract.numberOfProposals(); x++){
			var p = ethSignalContract.proposals.call(x);
			// add an aray to keep track of true votes
			p.push([]);
			// and array to keep track of valse votes
			p.push([]);
			// eth balance for
			p.push(0);
			// eth balance against
			p.push(0);
			proposals.push(p);
		}
		var votes;
		// store fromBlock as global
		ethSignalContract.userVotedEvent({}, {fromBlock:1187201,toBlock:'latest'}).get(function(err,evt) {
			console.log(evt);
			votes = evt;
			// store each vote with its associated proposal
			for (var v in votes) {
				var vote = votes[v];
				var proposalId = vote.args.proposalID.c[0];
				// tally Ether of votes
				var balance = parseInt(web3.fromWei(ethereum.web3.eth.getBalance(vote.args.voter).toNumber(), 'ether'), 10);
				if (vote.args.position) {
					proposals[proposalId][4].push(vote);
					proposals[proposalId][6] += balance;
				}
				else{
					proposals[proposalId][5].push(vote);
					proposals[proposalId][7] += balance;
				}
				var percent = calcPercent( proposals[proposalId][6], proposals[proposalId][7] );
				proposals[proposalId][10] = percent

				// console.log(proposalId,balance, vote.args.position, vote.args.voter, vote.blockNumber);
			}	
		});
		
		function mergeData(proposals, votes) {
			//combine votes and proposals to display results
		}
		function calcPercent(A, B){
			var res = []
			res[0] = Math.round(A * 100.0 / (A + B))
			res[1] = Math.round(B * 100.0 / (A + B))
			return res 
		}
		return {
			proposals: proposals,
			votes: votes,
			percentage: function(inP){
				console.log(out);
			},
			vote: function(proposalId, position) {
				// make this async return promise
				var deferred = $q.defer();
				var from = ethereum.web3.eth.defaultAccount;
				try {
					$rootScope.lastTx = ethSignalContract.vote(proposalId, position)
				}
				catch(e) {
					var passphrase = prompt("Please enter your passphrase: ");
					// console.log(from);
					// console.log(passphrase);
					var unlocked = ethereum.web3.personal.unlockAccount(from, passphrase);
					if (unlocked) {
						console.log(from, " unlocked.");
						$rootScope.lastTx = ethSignalContract.vote(proposalId, position)
						console.log($rootScope.lastTx);
						ethereum.web3.personal.lockAccount(from);
						console.log(from, " locked.");
						console.log("Voted ", position, " on proposal: ", proposalId);
					}	
					else {
						alert("Incorrect passphrase");
						throw(e);
					}
				}
			},
			newProposal: function(proposal) {
				// do wallet locking and unlocking here	
				from = ethereum.web3.eth.defaultAccount;
				var data = ethSignalContract.newProposal.getData(proposal.name, proposal.description);
				var gas = ethereum.web3.eth.estimateGas({from:from, to:to, data:data});
				try {
					$rootScope.lastTx = proposalService.contract.newProposal.sendTransaction(proposal.name, proposal.description, {from:from, to:to, gas:gas});
				}
				catch(e) {
					// console.log(ethereum);
					var passphrase = prompt("Please enter your passphrase: ");
					console.log(from);
					console.log(passphrase);
					console.log(ethereum.web3.personal.unlockAccount(from, passphrase));
					var unlocked = ethereum.web3.personal.unlockAccount(from, passphrase);
					if (unlocked) {
						console.log(from, " unlocked.");
						$rootScope.lastTx = ethSignalContract.newProposal.sendTransaction(proposal.name, proposal.description, {from:from, to:to, gas:gas});
						console.log($rootScope.lastTx);
						ethereum.web3.personal.lockAccount(from);
						console.log(from, " locked.");
					}	
					else {
						alert("Incorrect passphrase");
						throw(e);
					}
				}
				$rootScope.newProposals = [];
			}
		};
	}
	return null;
}]);


var isMist = typeof web3 !== 'undefined';
var obj = obj || "";
var web3;
if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
    // If there's a web3 library loaded, then make your own web3
    web3 = new Web3(web3.currentProvider);
} else if (typeof Web3 !== 'undefined') {
    // If there isn't then set a provider
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    if(!web3.isConnected()){
      var Web3 = require('web3');
      web3 = new Web3(new Web3.providers.HttpProvider("https://signal.ether.ai/proxy"));
    }
}

var ethersignalContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"endSignal","outputs":[],"type":"function"},{"inputs":[{"name":"rAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"},{"anonymous":false,"inputs":[],"name":"EndSignal","type":"event"}]);

var positionregistryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"}],"name":"registerPosition","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regAddr","type":"address"},{"indexed":true,"name":"sigAddr","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"text","type":"string"}],"name":"LogPosition","type":"event"}]);
var to = '0x9e75993a7a9b9f92a1978bcc15c30cbcb967bc81';
var positionregistry = positionregistryContract.at(to);


var connected = false;


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
				//console.log(contract);
				if(oldVal == newVal)
					return;
				//console.log("Setting defaultAccount to: ", newVal);
				ethereum.web3.eth.defaultAccount = newVal;
			});

			scope.newProposal = function() {
				console.log("newProposal");
				$rootScope.newProposals = []
				$('#submitPositionModal').modal('show')
				$rootScope.newProposals.push({name:"", description:""});
			};
		}
	}
}]);

app.directive('proposalsList', ['proposalService','ethereum','$uibModal','$rootScope', function(proposalService, ethereum, $uibModal, $rootScope) {

	return {
		restrict: 'E',
		templateUrl: 'new-proposalslist.html',
		link: function(scope) {
			scope.proposals = proposalService.proposals;
			scope.percentage = function(a, b){
				return a + b;
			}
			scope.cancel = function() {
				$('#submitPositionModal').modal('hide')
				// $rootScope.newProposals = [];
			}
			scope.vote = function(proposalId, position) {
				if(angular.isUndefined(ethereum.web3.eth.defaultAccount)){
					$rootScope.alerts = [{ type: 'danger', msg: 'Please select an account' },];
					// alert("Please select an account to from the \"Select Account\" dropdown.");
					return
				}
				proposalService.vote(proposalId, position);
			};

			scope.createProposal = function(proposal) {
				if(angular.isUndefined(ethereum.web3.eth.defaultAccount)){
					$rootScope.alerts = [{ type: 'danger', msg: 'Cannot find an account.' },];
					return
				}
				if (proposal.name == ""){
					scope.invalidForm = true;
					return
				}

				scope.invalidForm = false;
				proposalService.newProposal(proposal);
			};
		}
	}
}]);

app.directive('showErrors', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        el.bind('blur', function() {
          var valid = // is valid logic
          el.toggleClass('has-error', valid);
        });
      }
    }
});

app.service('ethereum', function($rootScope, $interval, $timeout) {
	// TODO graceful connection handling
  $rootScope.isMist = isMist;
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
	// get blockchain stats to display to the user
        function watchNetworkStats() {
		var latest = web3.eth.filter('latest');
		latest.watch(function(err,blockHash){
			web3.eth.getBlock(blockHash, false, function(err, block) {
				$rootScope.pending = false;
				$rootScope.currentBlock = block.number;
				$rootScope.currentBlockTime = utcSecondsToString(block.timestamp);
				$rootScope.sinceLastBlock = -1;
			});
		});
	}

	$rootScope.pending = true;
	$rootScope.syncState = 'warning';
	$rootScope.currentBlock = 'SYNCING';
	$rootScope.currentBlockTime = 'SYNCING';
	$rootScope.sinceLastBlock = 0;
	$rootScope.minDeposit = 0;
	$interval(function() {
		var newState = web3.isConnected();
		if (newState != connected){
			$rootScope.$emit('connectionStateChanged', newState);
			if(newState){
				if(!$rootScope.isMist) watchNetworkStats();
				web3.eth.defaultAccount = web3.eth.accounts[0];
				$rootScope.ethereumNetwork = getCurrentNetwork(web3.version.network);
				$rootScope.etherscanUrl = getEtherscanUrl(web3.version.network);
		      	}
			$rootScope.connectionStateDisplay = getConnectionStatus(newState);
			$rootScope.connectionState = newState;
			connected = newState;
		}
	}, 1000);

	var accounts = null;
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


app.service('proposalService', ['ethSignalContract', '$q','ethereum','$rootScope', function(ethSignalContract, $q, ethereum, $rootScope) {
	// get all the questions

	$rootScope.animateElementIn = function($el) {
	    $el.removeClass('not-visible');
	    $el.addClass('animated fadeIn'); // this example leverages animate.css classes
	}
	$rootScope.animateElementOut = function($el) {
		// $el.addClass('not-visible');
		// $el.removeClass('fadeIn');
	}
	var positions = [];
	$rootScope.newProposals = [];
	$rootScope.$on('connectionStateChanged', function(evt, connected){
		if(connected) getPositions();
	})

	$rootScope.minDepositChanged = function(minDeposit) {
		if (typeof minDeposit !== undefined)
		{
			$rootScope.minDeposit = minDeposit;
			if(connected) getPositions();
		} else {
			$rootScope.minDeposit = 0;
		}
	}

	function getPositions() {
		while (positions.pop());
		positionregistry.LogPosition({}, {fromBlock:1200000}).get(function(err,evt) {
			if (err) console.warn()

			var obj;
			var dep;
			for (obj in evt) {
				var block = web3.eth.getBlock(evt[obj].blockNumber);
				dep = Number(web3.fromWei(web3.eth.getBalance(evt[obj].args.sigAddr), "finney"));
				if (dep >= $rootScope.minDeposit) {
					//console.log(evt[obj]);
					getSigList(evt[obj], dep, block)
				}
			}
		});
	}

	function getSigList(input, dep, block){
		var address = input.args.sigAddr
		// console.log("getSigList", address);
		var etherSig = ethersignalContract.at(address)
		etherSig.LogSignal({}, {fromBlock:input.blockNumber}).get(function(err,evt) {
			if (err) console.warn("warning")

			var proMap = {};
			var antiMap = {};

			var obj;
			for (obj in evt){
				if (evt[obj].args.pro) {
					proMap[evt[obj].args.addr] = 1;
					antiMap[evt[obj].args.addr] = 0;
				} else {
					proMap[evt[obj].args.addr] = 0;
					antiMap[evt[obj].args.addr] = 1;
				}
			}
			CalcSignal(proMap, antiMap, input, dep, block)
		})
	}

	function calcPercent(A, B){
		var res = []
		res[0] = Math.round(A * 100.0 / (A + B))
		res[1] = Math.round(B * 100.0 / (A + B))
		return res
	}

	function CalcSignal(proMap, antiMap, input, dep, block) {
		var totalPro = 0;
		var totalAgainst = 0;
		var isMine = false;
		var iHaveSignaled = false;
		// call getBalance just once per address
		Object.keys(proMap).map(function(a) {
			var bal = web3.fromWei(web3.eth.getBalance(a));
			proMap[a] = proMap[a] * bal;
			antiMap[a] = antiMap[a] * bal;

			for (idx in web3.eth.accounts) {
				if (web3.eth.accounts[idx] === a) { iHaveSignaled = true; }
			}
		});
		for (idx in web3.eth.accounts) {
			if (web3.eth.accounts[idx] === input.args.regAddr) { isMine = true; }
		}

		// sum the pro and anti account values
		Object.keys(proMap).map(function(a) { totalPro += parseFloat(proMap[a]); });
		Object.keys(antiMap).map(function(a) { totalAgainst += parseFloat(antiMap[a]); });

		// console.log(totalPro);
		// console.log(totalAgainst);
		var percent = calcPercent( totalPro, totalAgainst );

		positions.push({title: input.args.title, desc: input.args.text, regAddr: input.args.regAddr, pro: Math.round(totalPro), against: Math.round(totalAgainst), percent: percent, sigAddr: input.args.sigAddr, deposit: dep, time: block.timestamp, iHaveSignaled: iHaveSignaled, isMine: isMine})
		console.log(positions);
	}

	return {
		proposals: positions,
		// votes: votes,
		percentage: function(inP){
			//console.log(out);
		},
		vote: function(posSigAddr, proBool) {
			//console.log(posSigAddr, proBool);
			var etherSig = ethersignalContract.at(posSigAddr)
			for (idx in web3.eth.accounts)
			{
				var from = web3.eth.accounts[idx];
				try {
					$rootScope.lastTx = etherSig.setSignal(proBool, {from: from});
				}
				catch(e) {
					console.log("Error submitting signal");
					console.log(e);
					$rootScope.alerts.push({ type: 'danger', msg: 'Error sending signal' });
				}
				$rootScope.alerts.push({ type: 'success', msg: 'Signal sent!' });
			}
		},
		newProposal: function(proposal) {
			console.log("newProposal proposalService");

			//console.log(ethereum.web3.eth.defaultAccount);
			from = ethereum.web3.eth.defaultAccount;
			// var data = ethSignalContract.newProposal.getData(proposal.name, proposal.description);
			var data = positionregistry.registerPosition.getData(proposal.name, proposal.description);
			//console.log("data ", data);
			var gas = ethereum.web3.eth.estimateGas({from:from, to:to, data:data});

			//console.log("gas: ", gas);
			try {
				$rootScope.lastTx = positionregistry.registerPosition.sendTransaction(proposal.name, proposal.description, {from:from, to:to, gas:gas});
			}
			catch(e) {
				console.log("Error submitting position");
				console.log(e);
				$rootScope.alerts.push({ type: 'danger', msg: 'Error sending position' });
			}
			$rootScope.alerts.push({ type: 'success', msg: 'Position sent!' });
			$('#submitPositionModal').modal('hide')
			$rootScope.newProposals = [];
		}
	}

}]);


// Global search filter
app.filter('searchFilter',function($filter) {
        return function(items,searchfilter) {
             var isSearchFilterEmpty = true;
              angular.forEach(searchfilter, function(searchstring) {   
                  if(searchstring !=null && searchstring !=""){
                      isSearchFilterEmpty= false;
                  }
              });
        if(!isSearchFilterEmpty){
                var result = [];  
                angular.forEach(items, function(item) {  
                    var isFound = false;
                     angular.forEach(item, function(term,key) {                         
                         if(term != null &&  !isFound){
                             term = term.toString();
                             term = term.toLowerCase();
                                angular.forEach(searchfilter, function(searchstring) {      
                                    searchstring = searchstring.toLowerCase();
                                    if(searchstring !="" && term.indexOf(searchstring) !=-1 && !isFound){
                                       result.push(item);
                                        isFound = true;
                                    }
                                });
                         }
                            });
                       });
            return result;
        }else{
        return items;
        }
    }
});

app.directive('networkStats', ['ethereum', '$interval','$rootScope',  function(ethereum, $interval, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'directives/networkStats.html',
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
		templateUrl: 'directives/accountSelector.html',
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
		templateUrl: 'directives/proposalsList.html',
		link: function(scope) {
			scope.proposals = proposalService.proposals;
			scope.newProposals = $rootScope.newProposals;
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

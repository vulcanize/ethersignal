var esContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"proposalHash","type":"bytes32"},{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalHash","type":"bytes32"},{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"}]);
var ethersignal = esContract.at('0x88d97abc052ae9ac3f2d034590265ec381f70a9b')

function CalcSignal(proposalHash) {
	var proMap = {};
	var antiMap = {};

	ethersignal.LogSignal({proposalHash: proposalHash}, {fromBlock: 1200000}, function(error, result){
		if (!error)
		{
			if (result.args.pro) {
				proMap[result.args.addr] = 1;
				antiMap[result.args.addr] = 0;
			} else {
				proMap[result.args.addr] = 0;
				antiMap[result.args.addr] = 1;
			}
		}
	})

	var totalPro = 0;
	var totalAgainst = 0;

	Object.keys(proMap).map(function(a) {
		var bal = web3.fromWei(web3.eth.getBalance(a));
		proMap[a] = proMap[a] * bal;
		antiMap[a] = antiMap[a] * bal;
	});

	Object.keys(proMap).map(function(a) { totalPro += parseFloat(proMap[a]); });
	Object.keys(antiMap).map(function(a) { totalAgainst += parseFloat(antiMap[a]); });

	return {pro: totalPro, against: totalAgainst}
}

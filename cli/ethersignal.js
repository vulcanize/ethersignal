/* 4096 iters gas burn */
var esContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"positionHash","type":"bytes32"},{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"positionHash","type":"bytes32"},{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"}]);
var ethersignal = esContract.at('0x851a78f09511bf510ad27036f5ff7c8901fdd2e2')


function CalcSignal(positionHash) {
	var proMap = {};
	var antiMap = {};

	ethersignal.LogSignal({positionHash: positionHash}, {fromBlock: 1200000}, function(error, result){
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

	// call getBalance just once per address
	Object.keys(proMap).map(function(a) {
		var bal = web3.fromWei(web3.eth.getBalance(a));
		proMap[a] = proMap[a] * bal;
		antiMap[a] = antiMap[a] * bal;
	});

	// sum the pro and anti account values
	Object.keys(proMap).map(function(a) { totalPro += parseFloat(proMap[a]); });
	Object.keys(antiMap).map(function(a) { totalAgainst += parseFloat(antiMap[a]); });

	return {pro: totalPro, against: totalAgainst}
}

var ethersignalContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"pro","type":"bool"}],"name":"setSignal","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"endSignal","outputs":[],"type":"function"},{"inputs":[{"name":"rAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogSignal","type":"event"},{"anonymous":false,"inputs":[],"name":"EndSignal","type":"event"}]);

var positionregistryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"text","type":"string"}],"name":"registerPosition","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regAddr","type":"address"},{"indexed":true,"name":"sigAddr","type":"address"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"text","type":"string"}],"name":"LogPosition","type":"event"}]);
var positionregistry = positionregistryContract.at('0x0265a5b822625ca506c474912662617c394bbb66')

function WithdrawPosition(sigAddr) {
	var ethersignal = ethersignalContract.at(sigAddr);

	ethersignal.endSignal();

	return true;
}


function SetSignal(sigAddr, pro) {
	var ethersignal = ethersignalContract.at(sigAddr);

	ethersignal.setSignal(pro, {from: web3.eth.accounts[0], gas: 300000});

	return true;
}

function ListPositions(minDeposit) {
	var posMap = {};
	var minDeposit = typeof minDeposit !== 'undefined' ? minDeposit : 0;

	positionregistry.LogPosition({}, {fromBlock: 1200000}, function(error, result){
		if (!error)
		{
			posMap[result.args.sigAddr] = [result.args.title, result.args.text, result.args.regAddr];
		}
	})

	console.log("[Positions: cut & paste the CalcSignal(); portion to see current signal levels]");

	var numFiltered = 0;
	Object.keys(posMap).map(function(k) {
		var deposit = web3.fromWei(web3.eth.getBalance(k));

		if (deposit >= minDeposit)
		{
			console.log("\nPosition CalcSignal(\"" + k + "\");");
			console.log(" registered by " + posMap[k][2]);
			console.log(" eth deposit: " + deposit);
			console.log("Title: " + posMap[k][0]);
			console.log("Text: " + posMap[k][1]);
		} else {
			numFiltered++;
		}
	});

	console.log("Positions filtered for being under the minDeposit of " + minDeposit + ": " + numFiltered);

	return true;
}

function CalcSignal(posAddr) {
	var proMap = {};
	var antiMap = {};

	var ethersignal = ethersignalContract.at(posAddr);

	ethersignal.LogSignal({}, {fromBlock: 1200000}, function(error, result){
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

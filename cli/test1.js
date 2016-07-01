function test1_voteSpam() {
	for (i = 0; i < 100; i++) {
		ethersignal.setSignal(0, ((i % 2) == 0) ? true : false, {from:  web3.eth.accounts[0], gas: 300000});
	}
}

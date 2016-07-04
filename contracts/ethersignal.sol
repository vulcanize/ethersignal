contract EtherSignal {
	event LogSignal(bytes32 indexed positionHash, bool pro, address addr);
	function setSignal(bytes32 positionHash, bool pro) {
		for (uint i = 0; i < 4096; i++) { } // burn some gas to increase DOS cost
		LogSignal(positionHash, pro, msg.sender);
		if(!msg.sender.send(this.balance)){ throw; }
    	}
    	
    	function () {
		throw;
    	}
}

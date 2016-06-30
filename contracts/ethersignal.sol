contract EtherSignal {
	event LogSignal(bytes32 indexed proposalHash, bool pro, address addr);
	function setSignal(bytes32 proposalHash, bool pro) {
		for (uint i = 0; i < 1024; i++) { } // burn some gas to avoid event spamming
		LogSignal(proposalHash, pro, msg.sender);
    }
}

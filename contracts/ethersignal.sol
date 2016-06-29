contract EtherSignal {
	event LogSignal(bytes32 indexed proposalHash, bool pro, address addr);
	function setSignal(bytes32 proposalHash, bool pro) {
		LogSignal(proposalHash, pro, msg.sender);
    }
}

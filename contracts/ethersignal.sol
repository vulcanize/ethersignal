contract EtherSignal {
	event LogSignal(byte32 indexed proposalHash, bool pro, address addr);
	function SetSignal(byte32 proposalHash, bool pro) {
		LogSignal(proposalHash, pro, msg.sender);
    }
}

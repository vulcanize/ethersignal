contract EtherSignal {
	address regAddr;

	function EtherSignal(address rAddr) {
		regAddr = rAddr;
	}

	event LogSignal(bool pro, address addr);
	event EndSignal();

	function setSignal(bool pro) {
		LogSignal(pro, msg.sender);
    }

	function endSignal() {
		if (msg.sender != regAddr) { throw; }
		if (!msg.sender.send(this.balance)) { throw; }
		EndSignal();
	}

	function () {
		if (msg.sender != regAddr) { throw; }
		// accept deposit only from the address which registered the position
	}
}

contract PositionRegistry {
	event LogPosition(address indexed regAddr, address indexed sigAddr, string title, string text);

	function registerPosition(string title, string text) {
		address conAddr = new EtherSignal(msg.sender);
		if (conAddr == 0x0) { throw; }
		LogPosition(msg.sender, conAddr, title, text);
	}

	function () {
		throw; // do not accept ether
	}
}

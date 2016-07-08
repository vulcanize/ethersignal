EtherSignal CLI

Quick Start.

1) Launch a geth node if it is not already running.
geth

2) Attach via the geth command line client
geth attach

3) Load the ethersignal script.
> loadScript("ethersignal.js")
true

Now you can either signal on a position or tally the current signal levels
for a position.

To Vote on position "0xba32c71348cf21e808067890691aa790486e3a99e628b68cd2bfeb51381bfec1":
> ethersignal.setSignal("0xba32c71348cf21e808067890691aa790486e3a99e628b68cd2bfeb51381bfec1",true, {from: web3.eth.accounts[0], gas: 300000});

To Tally the signal level for position "0xba32c71348cf21e808067890691aa790486e3a99e628b68cd2bfeb51381bfec1":
> CalcSignal("0xba32c71348cf21e808067890691aa790486e3a99e628b68cd2bfeb51381bfec1")
{
  against: 0,
  pro: 92.37653959643757
}

Enjoy.

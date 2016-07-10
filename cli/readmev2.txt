EtherSignal CLI

Quick Start.

1) Launch a geth node if it is not already running.
geth

2) Attach via the geth command line client
geth attach

3) Load the ethersignal script.
> loadScript("ethersignal2.js")
true

Now you can either signal on a position, tally the current signal levels
for a position, list the registered positions, or register a position:

=== To list the registered positions run the following:
> ListPositions()
[Positions: cut & paste the CalcSignal(); portion to see current signal levels]

Position CalcSignal("0x953521cfe06b48d65b64ae864abb4c808312885e");
 registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78
 eth deposit: 0
Title: will this work
Text: will this contract factory work

Position CalcSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f");
 registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78
 eth deposit: 0
Title: title
Text: text
Positions filtered for being under the minDeposit of 0: 0
true

=== If you would like to filter based on the position desposit, pass a
parameter to ListPositions) as follows:
> ListPositions(1)
[Positions: cut & paste the CalcSignal(); portion to see current signal levels]
Positions filtered for being under the minDeposit of 1: 2
true

=== As you can see above, in order to get the current signal levels for a position
you can simply cut and paste the CalcSignal(); portion of the output from
ListPositions():
> CalcSignal("0x953521cfe06b48d65b64ae864abb4c808312885e");
{
  against: 0,
  pro: 167.12471268213704
}

=== In order to register a position you can use the following contract method:
> positionregistry.registerPosition("title", "text", {from: web3.eth.accounts[0], gas: 300000});

=== If you would like to optionally submit a deposit into your position
in order to distinguish it from others you can do the following (note
your deposit will be returned when you withdraw the position):
> web3.eth.sendTransaction({from: web3.eth.accounts[0], to:"0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", value: web3.toWei(0.1, "ether")})

=== You may withdraw you position and reclaim your deposit as follows
> WithdrawPosition("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f");

=== In order to vote on a position, you will need to use the positions
signal address. Take the following signal as an example:
Position CalcSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f");
 registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78
 eth deposit: 0
Title: title
Text: text

The signal address is what is within CalcSignal(); so above it is
"0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f". To vote simply run the
following command, where true means to vote for the signal, and false
would mean to vote against the signal:
> SetSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", true);

Enjoy.

import React, { Component } from 'react'

class CliQuickstart extends Component {

  render() {
    return (
      <article>
        <h1>EtherSignal CLI</h1>
        <h3>Quick Start.</h3>

        <br />
        <p>
          1. Launch a geth node if it is not already running.
          <pre>geth</pre>
        </p>

        <p>
          2. Attach via the geth command line client
          <pre>geth attach</pre>
        </p>

        <p>
          3. Load the ethersignal script.
          <pre>
            > loadScript("ethersignal2.js"){'\n'}
            true
          </pre>
        </p>

        <br />

        <p>
          Now you can either signal on a position, tally the current signal levels
          for a position, list the registered positions, or register a position:
        </p>

        <p>To list the registered positions run the following:
          <pre>
            > ListPositions() {'\n'}
            [Positions: cut & paste the CalcSignal(); portion to see current signal levels]{'\n'}
            {'\n'}
            {'\n'}
            Position CalcSignal("0x953521cfe06b48d65b64ae864abb4c808312885e", 1290010);{'\n'}
            registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78{'\n'}
            eth deposit: 0{'\n'}
            Title: will this work{'\n'}
            Text: will this contract factory work{'\n'}
            {'\n'}
            Position CalcSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", 1290020);{'\n'}
            registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78{'\n'}
            eth deposit: 0{'\n'}
            Title: title{'\n'}
            Text: text{'\n'}
            Positions filtered for being under the minDeposit of 0: 0{'\n'}
            true{'\n'}
          </pre>
        </p>

        <br />
        <p>
          If you would like to filter based on the position desposit, pass a
          parameter to <code>ListPositions()</code> as follows:
          <pre>
            > ListPositions(1){'\n'}
            [Positions: cut & paste the CalcSignal(); portion to see current signal levels]{'\n'}
            Positions filtered for being under the minDeposit of 1: 2{'\n'}
            true{'\n'}
          </pre>
        </p>

        <br />
        <p>
          As you can see above, in order to get the current signal levels for a position
          you can simply cut and paste the <code>CalcSignal();</code> portion of the output from:
          <pre>
            ListPositions():{'\n'}
            > CalcSignal("0x953521cfe06b48d65b64ae864abb4c808312885e", 1290010);{'\n'}
            {'{'}{'\n'}
            {'  '}against: 0,{'\n'}
            {'  '}pro: 167.12471268213704{'\n'}
            {'}'}{'\n'}
          </pre>
        </p>
        <br />

        <p>
          In order to register a position you can use the following contract method:
          <pre>
            > positionregistry.registerPosition("title", "text",
            {'{'}from: web3.eth.accounts[0], gas: 300000{'}'});
          </pre>
        </p>

        <br />
        <p>
          If you would like to optionally submit a deposit into your position
          in order to distinguish it from others you can do the following (note
          your deposit will be returned when you withdraw the position):
          <pre>
            > web3.eth.sendTransaction({'{'}from: web3.eth.accounts[0],
            to:"0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", value: web3.toWei(0.1, "ether"){'}'})
          </pre>
        </p>
        <br />

        <p>You may withdraw you position and reclaim your deposit as follows:
          <pre>> WithdrawPosition("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f");</pre>
        </p>

        <br />
        <p>In order to vote on a position, you will need to use the positions
        signal address. Take the following signal as an example:
          <pre>
            Position CalcSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", 1290020);{'\n'}
            registered by 0x8c2741b9bebd3c27feb7bb3356f7b04652977b78{'\n'}
            eth deposit: 0{'\n'}
            Title: title{'\n'}
            Text: text{'\n'}
          </pre>
        </p>

        <br />
        <p>The signal address is what is within <code>CalcSignal();</code> so above it is
        <code>"0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f"</code>. To vote simply run the
        following command, where true means to vote for the signal, and false
        would mean to vote against the signal:
          <pre>> SetSignal("0xcdda0a8fe9a7a844c9d8611b2cadfe36b4bb438f", true);</pre>
        </p>

        <p>Enjoy.</p>

      </article>
    )
  }

}

CliQuickstart.propTypes = {}

export default CliQuickstart

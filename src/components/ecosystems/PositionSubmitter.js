import React, { Component } from 'react'
import './../../styles/ecosystems/PositionSubmitter.css'

import {
  Jumbotron,
  Button
} from 'react-bootstrap'

import logo from './../../images/logo.svg'

class PositionSubmitter extends Component {

  render() {
    return (
      <Jumbotron className="position-submitter">
        <header>
          <h1 className="position-submitter-heading">
            <img className="position-submitter-logo" src={logo} alt="EtherSignal logo" />
            EtherSignal
          </h1>
        </header>
        <p>Letting ether holders signal their positions.</p>
        <hr />
        <p><Button bsStyle="primary" bsSize="large">Submit a Position</Button></p>
      </Jumbotron>
    )
  }

}

PositionSubmitter.propTypes = {

}

export default PositionSubmitter

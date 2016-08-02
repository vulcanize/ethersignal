import React, { Component, PropTypes } from 'react'
import './../../styles/ecosystems/PositionSubmitter.css'

import {
  Jumbotron,
  Button
} from 'react-bootstrap'

import PositionSubmitterModal from './../ecosystems/PositionSubmitterModal'

import {
  showNewPositionModal
} from './../../redux/actions/position-actions'

import logo from './../../images/logo.svg'

class PositionSubmitter extends Component {

  showModal() {
    this.props.dispatch(showNewPositionModal())
  }

  render() {
    return (
      <div>

        <Jumbotron className="position-submitter">
          <header>
            <h1 className="position-submitter-heading animated pulse">
              <img className="position-submitter-logo" src={logo} alt="EtherSignal logo" />
              EtherSignal
            </h1>
          </header>
          <p>Letting ether holders signal their positions.</p>
          <hr />
          <p><Button
            onClick={this.showModal.bind(this)}
            bsStyle="primary"
            bsSize="large">Submit a Position</Button></p>
        </Jumbotron>

        <PositionSubmitterModal
          dispatch={this.props.dispatch}
          showModal={this.props.positions.showModal}
          title={this.props.positions.newPosition.title}
          titleValidationError={this.props.positions.newPosition.titleValidationError}
          description={this.props.positions.newPosition.description} />

      </div>
    )
  }

}

PositionSubmitter.propTypes = {
  positions: PropTypes.object,
  connection: PropTypes.object
}

export default PositionSubmitter

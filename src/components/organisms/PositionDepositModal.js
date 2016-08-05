import React, { PropTypes, Component } from 'react'

import {
  Modal,
  Button
} from 'react-bootstrap'

import {
  addPositionDeposit,
  hidePositionDepositModal,
  setPositionDepositValidationError
} from './../../redux/actions/position-actions'

import PositionDepositInput from './../molecules/PositionDepositInput'

class PositionDepositModal extends Component {

  makeDeposit() {

    if (!this.props.value) {
      this.props.dispatch(setPositionDepositValidationError('This value shouldn\'t be blank'))
      return
    }

    this.props.dispatch(addPositionDeposit(
      this.props.value,
      this.props.denomination,
      this.props.senderAddr,
      this.props.recipientAddr
    ))
  }

  hideModal() {
    this.props.dispatch(hidePositionDepositModal())
  }

  render() {

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.hideModal.bind(this)}
        bsSize="small">

        <Modal.Header closeButton>
          <Modal.Title>How Much?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <PositionDepositInput
            value={this.props.value}
            valueValidationError={this.props.valueValidationError}
            denomination={this.props.denomination}
            dispatch={this.props.dispatch} />
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={this.makeDeposit.bind(this)}
            bsStyle="primary">Deposit</Button>{' '}
          <Button
            onClick={this.hideModal.bind(this)}
            bsStyle="default">Cancel</Button>
        </Modal.Footer>

      </Modal>
    )

  }

}

PositionDepositModal.propTypes = {
  showModal: PropTypes.bool,
  senderAddr: PropTypes.string,
  recipientAddr: PropTypes.string,
  value: PropTypes.string,
  valueValidationError: PropTypes.string,
  denomination: PropTypes.string,
  dispatch: PropTypes.func
}

export default PositionDepositModal

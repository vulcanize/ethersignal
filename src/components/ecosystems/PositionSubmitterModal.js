import React, { PropTypes, Component } from 'react'

import {
  Modal,
  Button
} from 'react-bootstrap'

import {
  hideNewPositionModal,
  submitNewPosition,
  setNewPositionTitleValidationError
} from './../../redux/actions/position-actions'

import PositionSubmitterForm from './../organisms/PositionSubmitterForm'
import AccountSelector from './../organisms/AccountSelector'

class PositionSubmitterModal extends Component {

  hideModal() {
    this.props.dispatch(hideNewPositionModal())
  }

  submitPosition() {

    if (!this.props.title || this.props.title.length < 2) {
      this.props.dispatch(
        setNewPositionTitleValidationError('The title should be longer than one character.')
      )
      return
    }

    this.props.dispatch(submitNewPosition(
      this.props.title,
      this.props.description,
      this.props.connection.account.selectedAccount
    ))

  }

  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.hideModal.bind(this)}>

        <Modal.Header closeButton>
          <h1>Create New Position</h1>
        </Modal.Header>

        <Modal.Body>
          <PositionSubmitterForm
            dispatch={this.props.dispatch}
            title={this.props.title}
            description={this.props.description}
            titleValidationError={this.props.titleValidationError} />
          <AccountSelector
            selectedAccount={this.props.connection.account.selectedAccount}
            accounts={this.props.connection.account.items}
            dispatch={this.props.dispatch} />
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={this.submitPosition.bind(this)}
            bsStyle="primary">Submit</Button>{' '}
          <Button
            onClick={this.hideModal.bind(this)}
            bsStyle="default">Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}

PositionSubmitterModal.propTypes = {
  showModal: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  titleValidationError: PropTypes.string,
  connection: PropTypes.object,
  dispatch: PropTypes.func
}

export default PositionSubmitterModal

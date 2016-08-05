import React, { PropTypes, Component } from 'react'

import {
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
  MenuItem,
  DropdownButton,
  HelpBlock
} from 'react-bootstrap'

import {
  setPositionDepositValue,
  setPositionDepositDenomination
} from './../../redux/actions/position-actions'

class PositionDepositInput extends Component {

  setValue(event) {
    const value = event.target.value
    this.props.dispatch(setPositionDepositValue(value))
  }

  setDenomination(denomination) {
    this.props.dispatch(setPositionDepositDenomination(denomination))
  }

  getValidationState() {
    return this.props.valueValidationError ? 'error' : ''
  }

  render() {
    return (
      <FormGroup
        validationState={this.getValidationState.call(this)}
        controlId="depositValue" >
        <ControlLabel>Value of Deposit</ControlLabel>
        <InputGroup>
          <FormControl
            type="text"
            onChange={this.setValue.bind(this)}
            value={this.props.value} />
          <DropdownButton
            onSelect={this.setDenomination.bind(this)}
            componentClass={InputGroup.Button}
            id="depositDenomination"
            title={this.props.denomination}>
            <MenuItem eventKey="Ether">Ether</MenuItem>
            <MenuItem eventKey="Finney">Finney</MenuItem>
            <MenuItem eventKey="Wei">Wei</MenuItem>
          </DropdownButton>
        </InputGroup>
        <HelpBlock>{ this.props.valueValidationError }</HelpBlock>
      </FormGroup>
    )
  }

}

PositionDepositInput.propTypes = {
  dispatch: PropTypes.func,
  denomination: PropTypes.string,
  value: PropTypes.string,
  valueValidationError: PropTypes.string
}

export default PositionDepositInput

import React, { PropTypes, Component } from 'react'

import './../../styles/organisms/PositionFilter.css'

import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

import {
  setPositionOrderBy,
  setPositionMinimumValueFilter,
  setPositionMiniumValueDenomination,
} from './../../redux/actions/position-actions'

class PositionFilter extends Component {

  setSort(event) {
    const value = event.target.value.split('.')
    const orderBy = value[0]
    const direction = value[1]
    this.props.dispatch(setPositionOrderBy(orderBy, direction))
  }

  setDenomination(denomination) {
    this.props.dispatch(setPositionMiniumValueDenomination(denomination))
  }

  setMinimumValue(event) {
    const minimumValue = event.target.value
    this.props.dispatch(setPositionMinimumValueFilter(minimumValue))
  }

  onSubmitForm(event) {
    event.preventDefault()
  }

  render() {
    return (
      <Form inline className="position-filter" onSubmit={this.onSubmitForm.bind(this)}>

        <FormGroup controlId="sortType">
          <ControlLabel>Sort by</ControlLabel>
          <FormControl
            value={`${this.props.sort.orderBy}.${this.props.sort.direction}`}
            componentClass="select"
            onChange={this.setSort.bind(this)}>
            <option value="absoluteSignal.desc">Absolute Signal (Highest First)</option>
            <option value="absoluteSignal.asc">Absolute Signal (Lowest First)</option>
            <option value="creationDate.desc">Creation Date (Newest First)</option>
            <option value="creationDate.asc">Creation Date (Oldest First)</option>
            <option value="deposit.desc">Amplitude (Highest First)</option>
            <option value="deposit.asc">Amplitude (Lowest First)</option>
          </FormControl>
        </FormGroup>

        <FormGroup controlId="minimumValue">
          <ControlLabel>Minimum Value</ControlLabel>
          <InputGroup>
            <FormControl
              value={this.props.filter.minimumValue}
              onChange={this.setMinimumValue.bind(this)}
              type="number" />
            <DropdownButton
              onSelect={this.setDenomination.bind(this)}
              componentClass={InputGroup.Button}
              id="minimumCostCurrency"
              title={this.props.filter.denomination}>
              <MenuItem eventKey="Ether">Ether</MenuItem>
              <MenuItem eventKey="Wei">Wei</MenuItem>
            </DropdownButton>
          </InputGroup>
        </FormGroup>

      </Form>
    )
  }

}

PositionFilter.propTypes = {
  sort: PropTypes.object,
  filter: PropTypes.object,
  dispatch: PropTypes.func
}

export default PositionFilter

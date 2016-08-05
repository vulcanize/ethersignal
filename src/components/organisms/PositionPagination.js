import React, { PropTypes, Component } from 'react'

import {
  Form,
  Pagination,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

import {
  setPositionPaginationItemsToDisplay,
  setPositionPaginationCurrentPage
} from './../../redux/actions/position-actions'

import './../../styles/organisms/PositionPagination.css'

class PositionPagination extends Component {

  setItemsToDisplay(event) {
    const itemsToDisplay = event.target.value
    this.props.dispatch(setPositionPaginationItemsToDisplay(itemsToDisplay))
  }

  setCurrentPage(currentPage) {
    this.props.dispatch(setPositionPaginationCurrentPage(currentPage))
  }

  render() {
    return (
      <Form inline className="position-pagination">

        {
          Boolean(this.props.numberOfPages) &&
          <Pagination
            first
            last
            onSelect={this.setCurrentPage.bind(this)}
            activePage={this.props.pagination.currentPage}
            items={this.props.numberOfPages} />
        }

        <FormGroup controlId="positionsToDisplay">
          <ControlLabel>Positions to Display</ControlLabel>
          <FormControl
            componentClass="select"
            onChange={this.setItemsToDisplay.bind(this)}
            value={this.props.pagination.itemsToDisplay}>
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
          </FormControl>
        </FormGroup>

      </Form>
    )
  }

}

PositionPagination.propTypes = {
  pagination: PropTypes.object,
  numberOfPages: PropTypes.number,
  dispatch: PropTypes.func
}

export default PositionPagination

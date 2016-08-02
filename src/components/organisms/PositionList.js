import React, { PropTypes, Component } from 'react'

import PositionListItem from './../molecules/PositionListItem'
import LoadingAnimation from './../atoms/LoadingAnimation'

import {
  ListGroup
} from 'react-bootstrap'

class PositionList extends Component {

  render() {

    return (
      <ListGroup>
        {
          this.props.fetching &&
          this.props.items.length === 0 &&
          <LoadingAnimation />
        }
        {
          this.props.items.map((position, index) => {
            return (
              <PositionListItem
                dispatch={this.props.dispatch}
                position={position}
                key={index} />
            )
          })
        }
      </ListGroup>
    )
  }

}

PositionList.propTypes = {
  fetching: PropTypes.bool,
  dispatch: PropTypes.func,
  items: PropTypes.object
}

export default PositionList

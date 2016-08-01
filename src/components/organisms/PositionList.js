import React, { PropTypes, Component } from 'react'

import PositionListItem from './../molecules/PositionListItem'

import {
  ListGroup
} from 'react-bootstrap'

class PositionList extends Component {

  render() {

    return (
      <ListGroup>
        {
          this.props.positions.items.map((position, index) => {
            return (
              <PositionListItem
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
  positions: PropTypes.object
}

export default PositionList

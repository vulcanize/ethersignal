import React, { PropTypes, Component } from 'react'

import {
  ListGroup
} from 'react-bootstrap'

class PositionList extends Component {

  render() {
    return (
      <ListGroup>
        {
          this.props.positions.items.map((position, index) => {
            return <pre key={index}>Position</pre>
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

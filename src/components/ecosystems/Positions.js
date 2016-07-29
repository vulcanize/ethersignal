import React, { PropTypes, Component } from 'react'

import NetworkStatus from './../organisms/NetworkStatus'
import PositionFilter from './../organisms/PositionFilter'
import PositionList from './../organisms/PositionList'

import {
  Panel
} from 'react-bootstrap'

class Positions extends Component {

  render() {
    return (
      <Panel header={[
        <NetworkStatus
          dispatch={this.props.dispatch}
          connection={this.props.connection} />,
        <PositionFilter />
      ]}>
        <PositionList
          dispatch={this.props.dispatch}
          positions={this.props.positions} />
      </Panel>
    )
  }

}

Positions.propTypes = {
  connection: PropTypes.object,
  positions: PropTypes.object
}

export default Positions

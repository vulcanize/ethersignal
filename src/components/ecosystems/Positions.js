import React, { PropTypes, Component } from 'react'

import NetworkStatus from './../organisms/NetworkStatus'
import PositionFilter from './../organisms/PositionFilter'
import PositionList from './../organisms/PositionList'
import PositionPagination from './../organisms/PositionPagination'

import _ from 'lodash'

import {
  Panel
} from 'react-bootstrap'

class Positions extends Component {

  processPositions(positions) {

    const itemsToDisplay = this.props.positions.pagination.itemsToDisplay
    const orderBy = this.props.positions.sort.orderBy
    const direction = this.props.positions.sort.direction
    const minimumValue = this.props.positions.filter.minimumValue
    const denomination = this.props.positions.filter.denomination

    function filterPositions(positions) {

      if (minimumValue === '') return positions
      let multiplier = 1

      switch (denomination) {

      case 'Wei':
        multiplier = Math.pow(10, 18)
        break

      case 'Ether':
      default:
        break
      }

      return positions.filter(position => {
        return position.amplitudeSignal * multiplier > minimumValue * multiplier
      })

    }

    function sortPositions(positions) {
      return _.orderBy(positions, [orderBy], [direction])
    }

    function chunkPositions(positions) {
      return _.chunk(positions, itemsToDisplay)
    }

    return chunkPositions(sortPositions(filterPositions(positions)))

  }

  render() {

    const positions = this.processPositions(this.props.positions.items)
    const index = this.props.positions.pagination.currentPage - 1

    return (
      <Panel header={[
        <NetworkStatus
          key={0}
          dispatch={this.props.dispatch}
          connection={this.props.connection} />,
        <PositionFilter
          key={1}
          sort={this.props.positions.sort}
          filter={this.props.positions.filter}
          dispatch={this.props.dispatch} />
      ]}
      footer={
        <PositionPagination
          numberOfPages={positions.length}
          pagination={this.props.positions.pagination}
          dispatch={this.props.dispatch} />
      }>
        <PositionList
          fetching={this.props.positions.fetching}
          items={positions.length ? positions[index] : []}
          dispatch={this.props.dispatch} />

      </Panel>
    )
  }

}

Positions.propTypes = {
  dispatch: PropTypes.func,
  connection: PropTypes.object,
  positions: PropTypes.object
}

export default Positions

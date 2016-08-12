import React, { Component, PropTypes } from 'react'

import _ from 'lodash'
import {
  Chart,
  BarStack
} from 'react-d3-shape'

class SignalChart extends Component {

  render() {

    const chartSeries = [
      {
        field: 'pro',
        name: 'Pro',
        style: {
          fill: '#5CB85C',
          strokeWidth: 5,
          strokeOpacity: 1,
          fillOpacity: 1
        }
      },
      {
        field: 'against',
        name: 'Against',
        style: {
          fill: '#D9534F',
          strokeWidth: 5,
          strokeOpacity: 1,
          fillOpacity: 1
        }
      },
    ]

    function getX(block) {
      return block.blockNumber
    }

    function getY(value) {
      return +value
    }

    function getYDomain(input) {
      const maxPro = _.get(_.maxBy(input, 'pro'), 'pro') || 0
      const maxAgainst = _.get(_.maxBy(input, 'against'), 'against') || 0

      const max = _.max([maxPro, Math.abs(maxAgainst)])
      return [-max, max]
    }

    return (
      <Chart
        width={300}
        height={150}
        data={this.props.data}
        margins={{top: 0, left: 0, right: 15, bottom: 0}}
        chartSeries={chartSeries}
        x={getX}
        xScale="ordinal"
        y={getY}
        yDomain={getYDomain(this.props.data)}
        stack>
          <line x1="0" y1="76" x2="300" y2="76" stroke="#999999" strokeWidth="2" />
          <line x1="290" x2="290" y1="20" y2="30" stroke="#5CB85C" strokeWidth="3" />
          <line x1="285" x2="295" y1="25" y2="25" stroke="#5CB85C" strokeWidth="3" />
          <line x1="285" x2="295" y1="125" y2="125" stroke="#D9534F" strokeWidth="3" />
          <BarStack chartSeries={chartSeries} />

      </Chart>
    )
  }

}

SignalChart.propTypes = {
  data: PropTypes.array
}

export default SignalChart

import React, { PropTypes, Component } from 'react'

import { connect } from 'react-redux'

import PositionSubmitter from './../ecosystems/PositionSubmitter'
import Positions from './../ecosystems/Positions'

import './../../styles/environments/Home.css'

class Home extends Component {

  render() {
    return (
      <article>
        <PositionSubmitter
          dispatch={this.props.dispatch}
          positions={this.props.positions}
          connection={this.props.connection} />
        <Positions
          dispatch={this.props.dispatch}
          connection={this.props.connection}
          positions={this.props.positions} />
      </article>
    )
  }
}

Home.propTypes = {
  dispatch: PropTypes.func,
  positions: PropTypes.object,
  connection: PropTypes.object
}

export default connect(
  state => ({
    positions: state.positions,
    connection: state.connection
  })
)(Home)

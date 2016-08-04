import React, { PropTypes, Component } from 'react'

import './../../styles/organisms/NetworkStatus.css'

import {
  watchNetworkStatus,
} from './../../redux/actions/connection-actions'

class NetworkStatus extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.setState({
      secondsSinceLastBlock: 0,
      syncState: 'Pending'
    })
    this.props.dispatch(watchNetworkStatus())
    this.polling = setInterval(this.updateSyncStatus.bind(this), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.polling)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.connection.secondsSinceLastBlock !== this.state.secondsSinceLastBlock) {
      this.setState({
        secondsSinceLastBlock: newProps.connection.secondsSinceLastBlock
      })
    }
  }

  updateSyncStatus() {

    const connected = this.props.connection.connected
    function getSyncStatusText(timeSinceLastBlock) {

      if (!connected) return 'Pending'

      if (timeSinceLastBlock < 20) {
        return 'Good'
      }
      else if (timeSinceLastBlock > 20 && timeSinceLastBlock < 60) {
        return 'Warning'
      }
      else {
        return 'Bad'
      }
    }

    this.setState({
      syncState: getSyncStatusText(this.state.secondsSinceLastBlock),
      secondsSinceLastBlock: this.state.secondsSinceLastBlock + 1
    })

  }

  render() {

    return (
      <samp className="network-status">

        <label>Status</label>{' '}
        {
          this.props.connection.connected ?
            <span>Connected</span> :
            <span>Disconnected</span>
        }{' '}
        <span>{this.state.syncState}</span>{' '}
        <span>()</span><br />

        <label>Current Block</label>{' '}
        <span>{this.props.connection.currentBlock}</span><br />

        <label>Current Block Time</label>{' '}
        <span>{this.props.connection.currentBlockTime}</span><br />

        {
          this.props.connection.connected &&
          <div>
            <label>Since Last Block</label>{' '}
            <span>{this.state.secondsSinceLastBlock} seconds</span>
          </div>
        }

      </samp>
    )
  }

}

NetworkStatus.propTypes = {
  dispatch: PropTypes.func,
  connection: PropTypes.object
}

export default NetworkStatus

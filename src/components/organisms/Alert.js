import React, { PropTypes, Component } from 'react'

import './../../styles/organisms/Alert.css'

import {
  Alert as BsAlert
} from 'react-bootstrap'

class Alert extends Component {

  render() {
    return (
      <BsAlert
        onDismiss={this.props.onClick}
        bsStyle={this.props.severity}>
        <span>{this.props.text}</span>
      </BsAlert>
    )
  }

}

Alert.propTypes = {}

export default Alert

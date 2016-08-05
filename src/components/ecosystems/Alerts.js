import React, { PropTypes, Component } from 'react'

import { connect } from 'react-redux'
import Alert from './../organisms/Alert'
import './../../styles/ecosystems/Alerts.css'

import {
  removeAlert
} from './../../redux/actions/alert-actions'

class Alerts extends Component {

  dismiss(id) {
    this.props.dispatch(removeAlert(id))
  }

  render() {
    return (
      <div className="alerts">
        {
          this.props.alerts.map(alert => {
            return (
              <Alert
                onClick={this.dismiss.bind(this, alert.id)}
                text={alert.text}
                severity={alert.severity} />
            )
          })
        }
      </div>
    )
  }

}

Alerts.propTypes = {
  alerts: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(
  state => ({
    alerts: state.alerts
  })
)(Alerts)

import React, { PropTypes, Component } from 'react'

import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

import {
  getAccounts,
  setSelectedAccount
} from './../../redux/actions/connection-actions'

import './../../styles/organisms/AccountSelector.css'

class AccountSelector extends Component {

  componentWillMount() {
    this.props.dispatch(getAccounts())
  }

  setAddress(event) {
    const account = event.target.value
    this.props.dispatch(setSelectedAccount(account))
  }

  render() {
    return (
      <Form className="account-selector">
        <FormGroup>
          <ControlLabel>Registration Address</ControlLabel>
          <FormControl
            onChange={this.setAddress.bind(this)}
            componentClass="select"
            placeholder="select">
            {
              this.props.accounts.map((account, index) => {
                return <option key={index} value={account}>{account}</option>
              })
            }
          </FormControl>
        </FormGroup>
      </Form>
    )
  }

}

AccountSelector.propTypes = {
  dispatch: PropTypes.func,
  accounts: PropTypes.array,
  defaultAccount: PropTypes.string
}

export default AccountSelector

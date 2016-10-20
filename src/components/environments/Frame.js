import React, { PropTypes, Component } from 'react'
import './../../styles/environments/Frame.css'

import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap'

import Alerts from './../ecosystems/Alerts'

import logo from './../../images/logo.svg'
import { routes } from './../../index'

class Frame extends Component {

  handleSelect(selectedKey) {
    this.props.history.push(routes[selectedKey].path)
  }

  getActiveRouteIndex() {
    let hash = window.location.hash
    hash = hash.substring(hash.indexOf('#') + 1, hash.indexOf('?'))
    return routes.findIndex(route => {
      return hash === route.path
    })
  }

  render() {

    return (
      <div>

        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <img className="app-header-logo" src={logo} />
              <a onClick={this.handleSelect.bind(this, 0)}>EtherSignal</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav activeKey={this.getActiveRouteIndex.call(this)}
               onSelect={this.handleSelect.bind(this)}>
            {
              routes.map((route, index) => {
                return (
                  <NavItem
                    key={index}
                    eventKey={index}
                    href={route.path}>{route.name}</NavItem>
                )
              })
            }
          </Nav>
        </Navbar>

        <div className="container">
          {this.props.children}
        </div>

        <Alerts />

      </div>
    )

  }

}

Frame.propTypes = {
  children: PropTypes.node
}

export default Frame

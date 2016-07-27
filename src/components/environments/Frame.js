import React, { PropTypes, Component } from 'react'
import './../../styles/environments/Frame.css'
import { browserHistory } from 'react-router'

import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap'

import logo from './../../images/logo.svg'
import { routes } from './../../index'

class Frame extends Component {

  handleSelect(selectedKey) {
    browserHistory.push(routes[selectedKey].path)
  }

  getActiveRouteIndex() {
    const path = window.location.pathname
    return routes.findIndex(route => {
      return route.path === path
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
          <Nav activeKey={this.getActiveRouteIndex.call(this)} onSelect={this.handleSelect.bind(this)}>
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

        {this.props.children}

      </div>
    )

  }

}

Frame.propTypes = {
  children: PropTypes.node
}

export default Frame

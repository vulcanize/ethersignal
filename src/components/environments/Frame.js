import React, { PropTypes, Component } from 'react'
import './../../styles/environments/Frame.css'

import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap'

import logo from './../../images/logo.svg'

class Frame extends Component {

  render() {

    return (
      <div>

        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <img className="app-header-logo" src={logo} />
              <a href="#">EtherSignal</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href="#">Home</NavItem>
            <NavItem href="#">About</NavItem>
            <NavItem href="#">CLI Quickstart</NavItem>
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

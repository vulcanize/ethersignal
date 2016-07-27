import React, { Component } from 'react'

import './../../styles/environments/Home.css'

import PositionSubmitter from './../ecosystems/PositionSubmitter'

class Home extends Component {
  render() {
    return (
      <article>
        <PositionSubmitter />
      </article>
    )
  }
}

export default Home

import React, { Component } from 'react'
import loading from './../../images/ajax.gif'

import './../../styles/atoms/LoadingAnimation.css'

class LoadingAnimation extends Component {

  render() {
    return (
      <div className="loading-animation">
        <img src={loading} alt="loading" />
      </div>
    )
  }

}

export default LoadingAnimation

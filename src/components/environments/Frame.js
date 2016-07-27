import React, { PropTypes, Component } from 'react'

class Frame extends Component {

  render() {

    return (
      <div>
        <pre>Topbar</pre>
        {this.props.children}
      </div>
    )

  }

}

Frame.propTypes = {
  children: PropTypes.node
}

export default Frame

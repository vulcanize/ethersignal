import React, { PropTypes, Component } from 'react'
import './../../styles/molecules/PositionListItem.css'

import {
  Button,
  Glyphicon
} from 'react-bootstrap'

import {
  voteOnPosition
} from './../../redux/actions/position-actions'

class PositionListItem extends Component {

  vote(proposalId, vote) {
    this.props.dispatch(voteOnPosition(proposalId, vote))
  }

  render() {

    return (
      <section className="position-list-item">

        <div className="statistics">

          <h3>{this.props.position.title}</h3>
          <p>{this.props.position.desc}</p>

          <div>
            <label>Submitted by:</label>
            <div>{this.props.position.regAddr}</div>
          </div>

          <div>
            <label>Deposit (finney)</label>
            <div>{this.props.position.deposit}</div>
          </div>

        </div>

        <div className="histogram">
          <div className="baseline"></div>
        </div>

        <div className="voting">

          <div className="voting-row">
            <Button
              onClick={this.vote.bind(this, this.props.position.sigAddr, true)}
              bsStyle="success">
              <Glyphicon glyph="thumbs-up" />
            </Button>
            <div className="voting-count">
              <label>In Favor</label>
              <span className="voting-number">{this.props.position.pro}</span>
            </div>
          </div>

          <div className="voting-row">
            <Button
              onClick={this.vote.bind(this, this.props.position.sigAddr, false)}
              bsStyle="danger">
              <Glyphicon glyph="thumbs-down" />
            </Button>
            <div className="voting-count">
              <label>Against</label>
              <span className="voting-number">{this.props.position.against}</span>
            </div>
          </div>

        </div>

      </section>
    )
  }

}

PositionListItem.propTypes = {
  dispatch: PropTypes.func,
  position: PropTypes.object
}

export default PositionListItem

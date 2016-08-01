import React, { PropTypes, Component } from 'react'
import './../../styles/molecules/PositionListItem.css'

import moment from 'moment'

import {
  Button,
  Glyphicon,
  ProgressBar
} from 'react-bootstrap'

import {
  voteOnPosition
} from './../../redux/actions/position-actions'

class PositionListItem extends Component {

  vote(proposalId, vote) {
    // If a selected account is not available, alert the user.
    this.props.dispatch(voteOnPosition(proposalId, vote))
  }

  render() {

    const totalVotes = this.props.position.pro + this.props.position.against
    const percentageInFavor = Math.round(this.props.position.pro / totalVotes * 100)
    const percentageAgainst = Math.round(this.props.position.against / totalVotes * 100)

    function formatTime(timestamp) {
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss Z')
    }

    return (
      <section className="position-list-item">

        <h3>{this.props.position.title}</h3>
        <p>{this.props.position.desc}</p>
        <p>{formatTime(this.props.position.time)}</p>

        <div className="voting-butons" style={{marginBottom: '1em'}}>
          <Button
            onClick={this.vote.bind(this, this.props.position.sigAddr, true)}
            bsStyle="success">
            <Glyphicon glyph="thumbs-up" />{' '}
            {this.props.position.pro}{' '}
            Yay</Button>
          {' '}
          <Button
            onClick={this.vote.bind(this, this.props.position.sigAddr, false)}
            bsStyle="danger">
            <Glyphicon glyph="thumbs-down" />{' '}
            {this.props.position.against}{' '}
            Nay
          </Button>
        </div>

        <div className="sentiment">
          <ProgressBar>
            <ProgressBar
              bsStyle="success"
              label={`${percentageInFavor}% in Favor`}
              now={percentageInFavor}
              key={1} />
            <ProgressBar
              bsStyle="danger"
              label={`${percentageAgainst}% Against`}
              now={percentageAgainst}
              key={2} />
          </ProgressBar>
        </div>

        <div className="statistics">
          <label>Submitted by: </label>{' '}<span>{this.props.position.regAddr}</span>{' '}
          <label>Deposit (finney): </label>{' '}<span>{this.props.position.deposit}</span>
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

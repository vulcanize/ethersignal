import React, { PropTypes, Component } from 'react'
import './../../styles/molecules/PositionListItem.css'

import moment from 'moment'

import {
  Button,
  Glyphicon,
  ProgressBar
} from 'react-bootstrap'

class PositionListItem extends Component {

  vote(proposalId, position) {
    // If a selected account is not available, alert the user.

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
          <Button bsStyle="success">
            <Glyphicon glyph="thumbs-up" />{' '}
            {this.props.position.pro}{' '}
            Yay</Button>
          {' '}
          <Button bsStyle="danger">
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
  position: PropTypes.object
}

export default PositionListItem

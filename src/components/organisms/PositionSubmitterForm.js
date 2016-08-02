import React, { PropTypes, Component } from 'react'
import _ from 'lodash'

import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'

import {
  setNewPositionTitle,
  setNewPositionDescription
} from './../../redux/actions/position-actions'

class PositionSubmitterForm extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.setDescription = _.debounce(this.setDescription, 300)
    this.setTitle = _.debounce(this.setTitle, 300)
  }

  componentWillMount() {
    this.setState({
      title: this.props.title,
      description: this.props.description
    })
  }

  onSetTitle(event) {
    const title = event.target.value
    this.setState({
      title
    }, this.setTitle.bind(this, title))
  }

  setTitle(title) {
    this.props.dispatch(setNewPositionTitle(title))
  }

  onSetDescription(event) {
    const description = event.target.value
    this.setState({
      description
    }, this.setDescription.bind(this, description))
  }

  setDescription(description) {
    this.props.dispatch(setNewPositionDescription(description))
  }

  getValidationState() {
    if (this.props.titleValidationError) return 'error'
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.getValidationState.call(this)}
          controlId="formBasicText">
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            value={this.state.title}
            onChange={this.onSetTitle.bind(this)}
            placeholder="Title of the new position" />
          <FormControl.Feedback />
          {
            this.props.titleValidationError &&
            <HelpBlock>{this.props.titleValidationError}</HelpBlock>
          }
        </FormGroup>

        <FormGroup controlId="formBasicText">
          <ControlLabel>Description</ControlLabel>
          <FormControl
            value={this.state.description}
            componentClass="textarea"
            onChange={this.onSetDescription.bind(this)}
            placeholder="Description of the new position" />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    )
  }

}

PositionSubmitterForm.propTypes = {
  titleValidationError: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  dispatch: PropTypes.func
}

export default PositionSubmitterForm

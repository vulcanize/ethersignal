import {
  FETCH_POSITIONS_REQUEST,
  FETCH_POSITIONS_SUCCESS,
  FETCH_POSITIONS_FAILURE,
  SHOW_NEW_POSITION_MODAL,
  HIDE_NEW_POSITION_MODAL,
  SET_NEW_POSITION_TITLE,
  SET_NEW_POSITION_DESCRIPTION,
  SET_NEW_POSITION_TITLE_VALIDATION_ERROR,
  SUBMIT_NEW_POSITION_SUCCESS,
  SUBMIT_NEW_POSITION_FAILURE
} from './../actions/position-actions'

const initialState = {
  showModal: false,
  fetching: false,
  error: '',
  items: [],
  newPosition: {
    title: '',
    description: '',
    titleValidationError: ''
  }
}

export default function positionReducer(state = initialState, action) {

  switch (action.type) {

  case FETCH_POSITIONS_REQUEST:
    return Object.assign({}, state, {
      fetching: true,
      error: ''
    })

  case FETCH_POSITIONS_SUCCESS:
    return Object.assign({}, state, {
      fetching: false,
      error: '',
      items: [
        ...action.response
      ]
    })

  case FETCH_POSITIONS_FAILURE:
    return Object.assign({}, state, {
      fetching: false,
      error: ''
    })

  case SHOW_NEW_POSITION_MODAL:
    return Object.assign({}, state, {
      showModal: true
    })

  case SET_NEW_POSITION_TITLE:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        title: action.title,
        titleValidationError: ''
      })
    })

  case SET_NEW_POSITION_DESCRIPTION:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        description: action.description
      })
    })

  case HIDE_NEW_POSITION_MODAL:
  case SUBMIT_NEW_POSITION_FAILURE:
  case SUBMIT_NEW_POSITION_SUCCESS:
    return Object.assign({}, state, {
      showModal: false,
      newPosition: Object.assign({}, initialState.newPosition)
    })

  case SET_NEW_POSITION_TITLE_VALIDATION_ERROR:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        titleValidationError: action.error
      })
    })

  default:
    return state

  }

}

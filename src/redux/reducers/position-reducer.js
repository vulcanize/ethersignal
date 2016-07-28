import {
  FETCH_POSITIONS_REQUEST,
  FETCH_POSITIONS_SUCCESS,
  FETCH_POSITIONS_FAILURE
} from './../actions/position-actions'

const initialState = {
  fetching: false,
  error: '',
  positions: []
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
      positions: [
        ...action.response
      ]
    })

  case FETCH_POSITIONS_FAILURE:
    return Object.assign({}, state, {
      fetching: false,
      error: ''
    })

  default:
    return state

  }

}

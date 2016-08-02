import {
  ADD_ALERT,
  REMOVE_ALERT,
  REMOVE_TIMED_ALERT
} from './../actions/alert-actions'

const initialState = []

export default function(state = initialState, action) {

  switch (action.type) {

  case ADD_ALERT:
    return [
      ...state,
      {
        text: action.text,
        severity: action.severity,
        id: state.length
      }
    ]

  case REMOVE_ALERT:
    return state.filter(item => item.id !== action.id)

  case REMOVE_TIMED_ALERT:
    return state.filter(item => {
      return item.text !== action.text &&
             item.severity !== action.severity
    })

  default:
    return state

  }

}

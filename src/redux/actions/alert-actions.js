export const ADD_ALERT = 'ADD_ALERT'
export const REMOVE_ALERT = 'REMOVE_ALERT'


export function addAlert(text, severity) {
  return {
    type: ADD_ALERT,
    text,
    severity
  }
}

export function removeAlert(id) {
  return {
    type: REMOVE_ALERT,
    id
  }
}

export const REMOVE_TIMED_ALERT = 'REMOVE_TIMED_ALERT'

export function removeTimedAlert(text, severity) {
  return {
    type: REMOVE_TIMED_ALERT,
    text,
    severity
  }
}

export function addTimedAlert(text, severity) {
  return dispatch => {
    dispatch(addAlert(text, severity))
    setTimeout(() => {
      dispatch(removeTimedAlert(text, severity))
    }, 3000)
  }
}

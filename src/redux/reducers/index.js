import { combineReducers } from 'redux'

import positions from './position-reducer'
import connection from './connection-reducer'
import alerts from './alert-reducer'

export default combineReducers({
  positions,
  connection,
  alerts
})

import { combineReducers } from 'redux'

import positions from './position-reducer'
import connection from './connection-reducer'

export default combineReducers({
  positions,
  connection
})

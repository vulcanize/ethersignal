import {
  FETCH_NETWORK_STATUS_SUCCESS
} from './../actions/connection-actions'

const initialState = {
  connected: false,
  currentBlock: 'SYNCING',
  currentBlockTime: 'SYNCING',
  secondsSinceLastBlock: 0
}

export default function connectionReducer(state = initialState, action) {

  switch (action.type) {

  case FETCH_NETWORK_STATUS_SUCCESS:
    return Object.assign({}, state, {
      connected: action.response.connected,
      currentBlock: action.response.currentBlock,
      currentBlockTime: action.response.currentBlockTime,
      secondsSinceLastBlock: action.response.secondsSinceLastBlock
    })

  default:
    return state

  }

}

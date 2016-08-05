import {
  FETCH_NETWORK_STATUS_SUCCESS,
  GET_ACCOUNTS,
  SET_SELECTED_ACCOUNT
} from './../actions/connection-actions'

const initialState = {
  connected: false,
  currentBlock: 'SYNCING',
  currentBlockTime: 'SYNCING',
  secondsSinceLastBlock: 0,
  account: {
    items: [],
    selectedAccount: ''
  }
}

export default function connectionReducer(state = initialState, action) {

  switch (action.type) {

  case GET_ACCOUNTS:
    return Object.assign({}, state, {
      account: Object.assign({}, state.account, {
        items: action.accounts,
        selectedAccount: !state.account.selectedAccount ?
                         action.accounts[0] :
                         state.account.selectedAccount
      })
    })

  case SET_SELECTED_ACCOUNT:
    return Object.assign({}, state, {
      account: Object.assign({}, state.account, {
        selectedAccount: action.selectedAccount
      })
    })

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

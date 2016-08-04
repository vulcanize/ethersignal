/* global Web3, web3 */

if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
}
else if (typeof Web3 !== 'undefined') {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  if (!web3.isConnected()) {
    const Web3 = require('web3')
    web3 = new Web3(new Web3.providers.HttpProvider('https://signal.ether.ai/proxy'))
  }
}

import {
  fetchPositions
} from './../actions/position-actions'

import moment from 'moment'

export const GET_ACCOUNTS = 'GET_ACCOUNTS'
export const SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT'

export function getAccounts() {
  return {
    type: GET_ACCOUNTS,
    accounts: web3.eth.accounts
  }
}

export function setSelectedAccount(selectedAccount) {
  return {
    type: SET_SELECTED_ACCOUNT,
    selectedAccount
  }
}

export const FETCH_NETWORK_STATUS_REQUEST = 'FETCH_NETWORK_STATUS_REQUEST'
export const FETCH_NETWORK_STATUS_SUCCESS = 'FETCH_NETWORK_STATUS_SUCCESS'
export const FETCH_NETWORK_STATUS_FAILURE = 'FETCH_NETWORK_STATUS_FAILURE'

export function fetchNetworkStatusRequest() {
  return {
    type: FETCH_NETWORK_STATUS_REQUEST
  }
}

export function fetchNetworkStatusSuccess(response) {
  return {
    type: FETCH_NETWORK_STATUS_SUCCESS,
    response
  }
}

export function fetchNetworkStatusFailure(error) {
  return {
    type: FETCH_NETWORK_STATUS_FAILURE,
    error
  }
}

export function watchNetworkStatus() {

  function utcSecondsToString(timestamp) {
    return moment(timestamp * 1000).toDate().toString()
  }

  function getTimeSinceLastBlock(timestamp) {
    return Math.floor(moment().diff(moment(timestamp * 1000)) / 1000)
  }

  return dispatch => {
    const latestStatus = web3.eth.filter('latest')

    latestStatus.watch((err, blockHash) => {

      dispatch(fetchPositions())

      return new Promise((resolve, reject) => {
        web3.eth.getBlock(blockHash, false, function(err, block) {
          if (err) reject(err)
          resolve(block)
        })
      })
      .then(response => {
        dispatch(fetchNetworkStatusSuccess({
          connected: true,
          currentBlock: response.number,
          currentBlockTime: utcSecondsToString(response.timestamp),
          secondsSinceLastBlock: getTimeSinceLastBlock(response.timestamp)
        }))
      })
      .catch(error => {
        dispatch(fetchNetworkStatusFailure(error))
      })
    })
  }

}

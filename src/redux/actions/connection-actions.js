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
    const date = new Date(0)
    date.setUTCSeconds(timestamp)
    return date.toString()
  }

  return dispatch => {
    const latestStatus = web3.eth.filter('latest')

    latestStatus.watch((err, blockHash) => {
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
          secondsSinceLastBlock: 0
        }))
      })
      .catch(error => {
        dispatch(fetchNetworkStatusFailure(error))
      })
    })
  }

}

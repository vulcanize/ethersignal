import querystring from 'querystring'
import fetch from 'isomorphic-fetch'
import getSignalPerBlock from './utils/getSignalPerBlock'

/*
 * connection to local blockchain node.
 */

/* global Web3, web3 */

import etherSignalAbi from './abi/etherSignalAbi'
import positionRegistryAbi from './abi/positionRegistryAbi'

if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
}
else if (typeof Web3 !== 'undefined') {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  if (!web3.isConnected()) {
    const Web3 = require('web3')
    web3 = new Web3(new Web3.providers.HttpProvider('http://rpc.ethapi.org:8545'))
  }
}

import {
  addTimedAlert
} from './alert-actions'

/*
* What contracts are we interested in?
 */

const etherSignalContract = web3.eth.contract(etherSignalAbi)
const positionRegistryContract = web3.eth.contract(positionRegistryAbi)

const address = '0x9e75993a7a9b9f92a1978bcc15c30cbcb967bc81'
const positionRegistry = positionRegistryContract.at(address)

/*
 * Begin Redux actions
 */

export const FETCH_POSITIONS_REQUEST = 'FETCH_POSITIONS_REQUEST'
export const FETCH_POSITIONS_SUCCESS = 'FETCH_POSITIONS_SUCCESS'
export const FETCH_POSITIONS_FAILURE = 'FETCH_POSITIONS_FAILURE'

export function fetchPositionsRequest() {
  return {
    type: FETCH_POSITIONS_REQUEST
  }
}

export function fetchPositionsSuccess(response) {
  return {
    type: FETCH_POSITIONS_SUCCESS,
    response
  }
}

export function fetchPositionsFailure(error) {
  return {
    type: FETCH_POSITIONS_FAILURE,
    error
  }
}

/*
 * @name getPositions
 * @param {number} fromBlock
 * @param {number} endBlock
 * @description
 * Makes a call to the positionRegistry ABI and returns positions contained in
 * blocks ranging from ${fromBlock} to ${endBlock}
 */

function getPositions(fromBlock, endBlock) {
  return new Promise((resolve, reject) => {
    positionRegistry.LogPosition({}, {fromBlock, endBlock})
    .get((err, positions) => {
      if (err) reject(err)
      resolve(positions)
    })
  })
}

/*
 * @name getPositionDeposit
 * @param {object} position
 * A position returned by #getPositions
 * @description
 * Calculates the current deposit (or amplitude) held at the signal address for
 * a given position
 */

function getPositionDeposit(position) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(position.blockNumber, (err, block) => {
      web3.eth.getBalance(position.args.sigAddr, (err, balance) => {
        const deposit = Number(web3.fromWei(balance, 'finney'))
        resolve(Object.assign({}, position, {block, deposit}))
      })
    })
  })
}

/*
 * @name getPositionVoteMaps
 * @description
 * Accepts a position object and collects signal transactions starting from
 * the positions block number.
 * @returns
 * Position object with proMap and againstMap properties, which describe which
 * accounts voted for and against the position.
 */

function getPositionVoteMaps(position) {

  const address = position.args.sigAddr
  const etherSignal = etherSignalContract.at(address)

  return new Promise((resolve, reject) => {

    etherSignal.LogSignal({}, {fromBlock: position.blockNumber})
    .get((error, signals) => {

      if (error) {
        reject(error)
      }

      const proMap = {}
      const againstMap = {}

      signals.forEach(signal => {
        if (signal.args.pro) {
          proMap[signal.args.addr] = 1
          againstMap[signal.args.addr] = 0
        }
        else {
          proMap[signal.args.addr] = 0
          againstMap[signal.args.addr] = 1
        }
      })

      resolve(Object.assign({}, position, {proMap, againstMap}))

    })
  })
}

/*
 * @name calculateCurrentSignal
 * @param {object} position
 * A position object with properties proMap and againstMap, which are provided by
 * #getPositionVoteMaps
 * @description
 * Iterates over addresses in proMap and againstMap and calculates their current
 * account balance.
 */

function calculateCurrentSignal(position) {
  return new Promise((resolve, reject) => {

    position.totalPro = 0
    position.totalAgainst = 0
    position.isMine = false
    position.iHaveSignalled = false
    position.myVote

    // Call getBalance once per address
    for (const address in position.proMap) {

      const balance = web3.fromWei(web3.eth.getBalance(address))

      position.proMap[address] = position.proMap[address] * balance
      position.againstMap[address] = position.againstMap[address] * balance

      position.totalPro += parseFloat(position.proMap[address])
      position.totalAgainst += parseFloat(position.againstMap[address])

      web3.eth.accounts.find(account => {
        if (address === account) {
          position.iHaveSignalled = true
          if (position.proMap[address]) {
            position.myVote = 'pro'
          }
          else if (position.againstMap[address]) {
            position.myVote = 'against'
          }
        }
      })

    }

    for (const index in web3.eth.accounts) {
      if (web3.eth.accounts[index] === position.args.regAddr) {
        position.isMine = true
      }
    }

    resolve(position)

  })
}

/*
 * @name #formatPosition
 * @param {object} position
 * @description
 * Formats a position object after all the operations responsible for adding
 * data have been completed.
 */

function formatPosition(position) {
  return {
    title: position.args.title,
    desc: position.args.text,
    regAddr: position.args.regAddr,
    pro: Math.round(position.totalPro),
    against: Math.round(position.totalAgainst),
    absoluteSignal: position.totalPro + Math.abs(position.totalAgainst),
    sigAddr: position.args.sigAddr,
    deposit: position.deposit,
    creationDate: position.block.timestamp,
    iHaveSignalled: position.iHaveSignalled,
    isMine: position.isMine,
    myVote: position.myVote,
    history: position.history
  }
}

export function fetchPositions(fromBlock = 1200000, endBlock) {
  return dispatch => {
    dispatch(fetchPositionsRequest())
    getPositions(fromBlock, endBlock)
    .then(positions => {
      return Promise.all(positions.map(position => getPositionDeposit(position)))
    })
    .then(positions => {
      return Promise.all(positions.map(position => getPositionVoteMaps(position)))
    })
    .then(positions => {
      return Promise.all(positions.map(position => calculateCurrentSignal(position)))
    })
    .then(positions => {
      return Promise.all(positions.map(position => fetchHistoricalSignal(position)))
    })
    .then(positions => {
      return positions.map(position => formatPosition(position))
    })
    .then(positions => {
      dispatch(fetchPositionsSuccess(positions))
    })
    .catch(error => {
      dispatch(fetchPositionsFailure(error))
    })
  }
}

export const VOTE_ON_POSITION_REQUEST = 'VOTE_ON_POSITION_REQUEST'
export const VOTE_ON_POSITION_SUCCESS = 'VOTE_ON_POSITION_SUCCESS'
export const VOTE_ON_POSITION_FAILURE = 'VOTE_ON_POSITION_FAILURE'

export function voteOnPositionRequest() {
  return {
    type: VOTE_ON_POSITION_REQUEST
  }
}

export function voteOnPositionSuccess(response) {
  return {
    type: VOTE_ON_POSITION_SUCCESS,
    response
  }
}

export function voteOnPositionFailure(error) {
  return {
    type: VOTE_ON_POSITION_FAILURE,
    error
  }
}

// Casts a a vote for against a given position for all accounts that are active.
export function voteOnPosition(positionSignalAddress, vote) {

  // If vote is true, it is a vote in favor of the given position.
  // Else, it is a vote against the position.
  const etherSignal = etherSignalContract.at(positionSignalAddress)

  return dispatch => {
    Promise.all(
      web3.eth.accounts.map(account => {
        return new Promise((resolve, reject) => {
          try {
            resolve(etherSignal.setSignal(vote, {from: account}))
          }
          catch (err) {
            reject(err)
          }
        })
      })
    )
    .then(response => {
      dispatch(addTimedAlert('Your vote was submitted!', 'success'))
      dispatch(voteOnPositionSuccess(response))
    })
    .catch(error => {
      dispatch(addTimedAlert(error.message, 'danger'))
      dispatch(voteOnPositionFailure(error))
    })
  }

}

export const SHOW_NEW_POSITION_MODAL = 'SHOW_NEW_POSITION_MODAL'
export const HIDE_NEW_POSITION_MODAL = 'HIDE_NEW_POSITION_MODAL'

export function showNewPositionModal() {
  return {
    type: SHOW_NEW_POSITION_MODAL
  }
}

export function hideNewPositionModal() {
  return {
    type: HIDE_NEW_POSITION_MODAL
  }
}

export const SET_NEW_POSITION_TITLE = 'SET_NEW_POSITION_TITLE'
export const SET_NEW_POSITION_DESCRIPTION = 'SET_NEW_POSITION_DESCRIPTION'
export const SET_NEW_POSITION_TITLE_VALIDATION_ERROR = 'SET_NEW_POSITION_TITLE_VALIDATION_ERROR'

export function setNewPositionTitle(title) {
  return {
    type: SET_NEW_POSITION_TITLE,
    title
  }
}

export function setNewPositionDescription(description) {
  return {
    type: SET_NEW_POSITION_DESCRIPTION,
    description
  }
}

export function setNewPositionTitleValidationError(error) {
  return {
    type: SET_NEW_POSITION_TITLE_VALIDATION_ERROR,
    error
  }
}

export const SUBMIT_NEW_POSITION_REQUEST = 'SUBMIT_NEW_POSITION_REQUEST'
export const SUBMIT_NEW_POSITION_SUCCESS = 'SUBMIT_NEW_POSITION_SUCCESS'
export const SUBMIT_NEW_POSITION_FAILURE = 'SUBMIT_NEW_POSITION_FAILURE'

export function submitNewPositionRequest() {
  return {
    type: SUBMIT_NEW_POSITION_REQUEST
  }
}

export function submitNewPositionSuccess(response) {
  return {
    type: SUBMIT_NEW_POSITION_SUCCESS,
    response
  }
}

export function submitNewPositionFailure(error) {
  return {
    type: SUBMIT_NEW_POSITION_FAILURE,
    error
  }
}

export function submitNewPosition(title, description, account) {

  // Todo: there should be an account selector
  const sender = account
  const data = positionRegistry.registerPosition.getData(title, description)
  const gas = web3.eth.estimateGas({from: sender, to: address, data: data})

  return dispatch => {
    dispatch(submitNewPositionRequest())
    try {
      const result = positionRegistry.registerPosition.sendTransaction(
        title,
        description,
        { from: sender, to: address, gas: gas }
      )
      dispatch(addTimedAlert('The position was submitted!', 'success'))
      dispatch(submitNewPositionSuccess(result))
    }
    catch (error) {
      dispatch(addTimedAlert(error.message, 'danger'))
      dispatch(submitNewPositionFailure(error))
    }
  }

}

export const SET_POSITION_ORDER_BY = 'SET_POSITION_ORDER_BY'
export const SET_POSITION_MINIMUM_VALUE_FILTER = 'SET_POSITION_MINIMUM_VALUE_FILTER'
export const SET_POSITION_MINIMUM_VALUE_DENOMINATION = 'SET_POSITION_MINIMUM_VALUE_DENOMINATION'
export const SET_POSITION_PAGINATION_ITEMS_TO_DISPLAY = 'SET_POSITION_PAGINATION_ITEMS_TO_DISPLAY'
export const SET_POSITION_PAGINATION_CURRENT_PAGE = 'SET_POSITION_PAGINATION_CURRENT_PAGE'
export const SET_POSITION_PAGINATION_NUMBER_OF_PAGES = 'SET_POSITION_PAGINATION_NUMBER_OF_PAGES'

export function setPositionOrderBy(orderBy, direction) {
  return {
    type: SET_POSITION_ORDER_BY,
    orderBy,
    direction
  }
}

export function setPositionMinimumValueFilter(minimumValue) {
  return {
    type: SET_POSITION_MINIMUM_VALUE_FILTER,
    minimumValue
  }
}

export function setPositionMiniumValueDenomination(denomination) {
  return {
    type: SET_POSITION_MINIMUM_VALUE_DENOMINATION,
    denomination
  }
}

export function setPositionPaginationItemsToDisplay(itemsToDisplay) {
  return {
    type: SET_POSITION_PAGINATION_ITEMS_TO_DISPLAY,
    itemsToDisplay
  }
}

export function setPositionPaginationCurrentPage(currentPage) {
  return {
    type: SET_POSITION_PAGINATION_CURRENT_PAGE,
    currentPage
  }
}

export function setPositionPaginationNumberOfPages(numberOfPages) {
  return {
    type: SET_POSITION_PAGINATION_NUMBER_OF_PAGES,
    numberOfPages
  }
}

export const DISPLAY_POSITION_DEPOSIT_MODAL = 'DISPLAY_POSITION_DEPOSIT_MODAL'
export const HIDE_POSITION_DEPOSIT_MODAL = 'HIDE_POSITION_DEPOSIT_MODAL'
export const SET_POSITION_DEPOSIT_VALUE = 'SET_POSITION_DEPOSIT_VALUE'
export const SET_POSITION_DEPOSIT_DENOMINATION = 'SET_POSITION_DEPOSIT_DENOMINATION'
export const SET_POSITION_DEPOSIT_VALIDATION_ERROR = 'SET_POSITION_DEPOSIT_VALIDATION_ERROR'
export const ADD_POSITION_DEPOSIT_REQUEST = 'ADD_POSITION_DEPOSIT_REQUEST'
export const ADD_POSITION_DEPOSIT_SUCCESS = 'ADD_POSITION_DEPOSIT_SUCCESS'
export const ADD_POSITION_DEPOSIT_FAILURE = 'ADD_POSITION_DEPOSIT_FAILURE'

export function displayPositionDepositModal(senderAddr, recipientAddr) {
  return {
    type: DISPLAY_POSITION_DEPOSIT_MODAL,
    senderAddr,
    recipientAddr
  }
}

export function hidePositionDepositModal() {
  return {
    type: HIDE_POSITION_DEPOSIT_MODAL
  }
}

export function setPositionDepositValue(value) {
  return {
    type: SET_POSITION_DEPOSIT_VALUE,
    value
  }
}

export function setPositionDepositDenomination(denomination) {
  return {
    type: SET_POSITION_DEPOSIT_DENOMINATION,
    denomination
  }
}

export function setPositionDepositValidationError(error) {
  return {
    type: SET_POSITION_DEPOSIT_VALIDATION_ERROR,
    error
  }
}

export function addPositionDepositRequest() {
  return {
    type: ADD_POSITION_DEPOSIT_REQUEST
  }
}

export function addPositionDepositSuccess(response) {
  return {
    type: ADD_POSITION_DEPOSIT_REQUEST,
    response
  }
}

export function addPositionDepositFailure(error) {
  return {
    type: ADD_POSITION_DEPOSIT_FAILURE,
    error
  }
}

function denominationToWeiConverter(value, denomination) {

  switch (denomination) {

  case 'Ether':
    return value * Math.pow(10, 18)
  case 'Finney':
    return value * Math.pow(10, 15)
  case 'Wei':
  default:
    return value

  }

}

export function addPositionDeposit(value, denomination, senderAddr, recipientAddr) {

  return dispatch => {
    dispatch(addPositionDepositRequest())
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction({
        value: denominationToWeiConverter(value, denomination),
        from: senderAddr,
        to: recipientAddr
      }, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
    .then(response => {
      dispatch(addTimedAlert('The deposit was submitted successfully', 'success'))
      dispatch(hidePositionDepositModal())
      dispatch(addPositionDepositSuccess(response))
    })
    .catch(error => {
      dispatch(addTimedAlert('The transaction was not confirmed', 'danger'))
      dispatch(hidePositionDepositModal())
      dispatch(addPositionDepositFailure(error))
    })
  }

}

export const GET_POSITION_SIGNAL_HISTORY_REQUEST = 'GET_POSITION_SIGNAL_HISTORY_REQUEST'
export const GET_POSITION_SIGNAL_HISTORY_SUCCESS = 'GET_POSITION_SIGNAL_HISTORY_SUCCESS'
export const GET_POSITION_SIGNAL_HISTORY_FAILURE = 'GET_POSITION_SIGNAL_HISTORY_FAILURE'

export function getPositionSignalHistoryRequest() {
  return {
    type: GET_POSITION_SIGNAL_HISTORY_REQUEST
  }
}

export function getPositionSignalHistorySuccess(response) {
  return {
    type: GET_POSITION_SIGNAL_HISTORY_SUCCESS,
    response
  }
}

export function getPositionSignalHistoryFailure(error) {
  return {
    type: GET_POSITION_SIGNAL_HISTORY_FAILURE,
    error
  }
}

export function fetchHistoricalSignal(position, opts) {

  const contractAddress = position.args.sigAddr

  const URL = `https://ethersignal-api.herokuapp.com/transaction/${contractAddress}`

  if (!opts) {
    opts = {}
  }

  const params = {
    startblock: opts.startblock || 0,
    endblock: opts.endblock || 99999999,
    sort: opts.sort || 'asc'
  }

  const query = querystring.stringify(params)

  return fetch(`${URL}?${query}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(response => {

    if (response.message === 'NOTOK') {
      throw 'There was an error with the testnet API.'
    }

    return Promise.all(

      response.result.map(transaction => {

        return new Promise((resolve, reject) => {

          web3.eth.getBalance(transaction.from, transaction.blockNumber, (err, balance) => {

            if (!balance) {
              console.log('No balance was returned for this transaction') // eslint-disable-line no-console
              console.log(transaction) // eslint-disable-line no-console
            }

            resolve({
              from: transaction.from,
              blockNumber: transaction.blockNumber,
              signal: balance,
              vote: transaction.input.slice(-1)
            })

          })
        })
      })
    )
  })
  .then(response => {
    return getSignalPerBlock(response)
  })
  .then(history => {
    return Object.assign({}, position, {history})
  })
  .catch(error => {
    // Recover from an error by passing an empty history
    return Object.assign({}, position, {history: []})
  })

}

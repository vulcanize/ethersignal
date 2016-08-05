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
    web3 = new Web3(new Web3.providers.HttpProvider('https://signal.ether.ai/proxy'))
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

export function fetchPositions() {

  function calcPercent(A, B) {
    const res = []
    res[0] = Math.round(A * 100.0 / (A + B))
    res[1] = Math.round(B * 100.0 / (A + B))
    return res
  }

  function calcSignal(proMap, againstMap, position, deposit, block) {

    let totalPro = 0
    let totalAgainst = 0
    let isMine = false
    let iHaveSignalled = false

    // Call getBalance once per address
    for (const address in proMap) {

      const balance = web3.fromWei(web3.eth.getBalance(address))
      proMap[address] = proMap[address] * balance
      againstMap[address] = againstMap[address] * balance

      totalPro += parseFloat(proMap[address])
      totalAgainst += parseFloat(againstMap[address])

      for (const index in web3.eth.accounts) {
        if (web3.eth.accounts[index] === address) {
          iHaveSignalled = true
        }
      }

    }

    for (const index in web3.eth.accounts) {
      if (web3.eth.accounts[index] === position.args.regAddr) {
        isMine = true
      }
    }

    return {
      title: position.args.title,
      desc: position.args.text,
      regAddr: position.args.regAddr,
      pro: Math.round(totalPro),
      against: Math.round(totalAgainst),
      percent: calcPercent(totalPro, totalAgainst),
      absoluteSignal: totalPro + Math.abs(totalAgainst),
      sigAddr: position.args.sigAddr,
      deposit: deposit,
      creationDate: block.timestamp,
      iHaveSignalled: iHaveSignalled,
      isMine: isMine
    }

  }

  function getSignalList(position, deposit, block) {

    const address = position.args.sigAddr
    const etherSignal = etherSignalContract.at(address)

    return new Promise((resolve, reject) => {
      etherSignal
      .LogSignal({}, {fromBlock: position.blockNumber})
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

        resolve(calcSignal(proMap, againstMap, position, deposit, block))

      })
    })

  }

  return dispatch => {
    dispatch(fetchPositionsRequest())

    return new Promise((resolve, reject) => {
      positionRegistry
      .LogPosition({}, { fromBlock: 1200000 }) // magic number?
      .get((err, positions) => {
        if (err) reject(err)
        resolve(positions)
      })
    })
    .then(positions => {
      return Promise.all(positions.map(position => {
        const block = web3.eth.getBlock(position.blockNumber)
        const deposit = Number(web3.fromWei(
          web3.eth.getBalance(position.args.sigAddr),
          'finney'
        ))
        return getSignalList(position, deposit, block)
      }))
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

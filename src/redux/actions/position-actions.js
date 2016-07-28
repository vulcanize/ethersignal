/*
 *
  connection to local blockchain node.
 */

/* global Web3 */

import etherSignalAbi from './abi/etherSignalAbi'
import positionRegistryAbi from './abi/positionRegistryAbi'

let web3, connected

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
}
else {
  // set the provider you want from Web3.providers
  const Web3 = require('web3')
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

  connected = web3.isConnected()

  if (!connected) {
    web3 = new Web3(new Web3.providers.HttpProvider('https://signal.ether.ai/proxy'))
  }
}

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
      if (web3.eth.accounts(index) === position.args.regAddr) {
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
      sigAddr: position.args.sigAddr,
      deposit: deposit,
      time: block.timestamp,
      iHaveSignalled: iHaveSignalled,
      isMine: isMine
    }

  }

  function getSignatureList(position, deposit, block) {

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
        return getSignatureList(position, deposit, block)
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

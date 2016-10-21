const _ = require('lodash')

module.exports = function getSignalPerBlock(input) {

  function removeUnclearVotes(input) {
    return input.filter(item => {
      return item.vote === '1' || item.vote === '0'
    })
  }

  function groupByBlockNumber(input) {
    return _.groupBy(input, 'blockNumber')
  }

  function backfillHistory(input) {
    const keys = Object.keys(input)
    // eslint-disable-next-line
    for (let blockNumber in input) {
      const index = keys.indexOf(blockNumber)
      if (index >= 1) {
        keys.slice(index - 1, index).forEach(lastBlock => {
          input[blockNumber] = dedupeTransactions(input[lastBlock].concat(input[blockNumber]))
        })
      }
    }
    return input
  }

  function dedupeTransactions(input) {
    let output = []
    const grouped = _.groupBy(input, 'from')
    // eslint-disable-next-line
    for (let address in grouped) {
      output = [
        ...output,
        ...grouped[address].slice(-1)
      ]
    }
    return output
  }

  function calculateSignal(input) {

    let output = []

    // eslint-disable-next-line
    for (let address in input) {
      input[address] = input[address].reduce((memo, current) => {
        if (current.vote === '1') memo.pro.push(current)
        if (current.vote === '0') memo.against.push(current)
        return memo
      }, {blockNumber: address, pro: [], against: []})
      output.push(input[address])
    }

    output = output.map(block => {
      block.pro = block.pro.reduce((memo, block) => {
        memo += Number(block.signal) / Math.pow(10, 18)
        return memo
      }, 0)
      block.against = block.against.reduce((memo, block) => {
        memo -= Number(block.signal) / Math.pow(10, 18)
        return memo
      }, 0)
      return block
    })

    return output

  }

  return calculateSignal(backfillHistory(groupByBlockNumber(removeUnclearVotes(input))))

}

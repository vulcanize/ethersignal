export default [
  {
    'constant': false,
    'inputs': [{
      'name': 'amount',
      'type': 'uint256'
    }],
    'name': 'withdraw',
    'outputs': [],
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [{
      'name': 'pro',
      'type': 'bool'
    }],
    'name': 'setSignal',
    'outputs': [],
    'type': 'function'
  }, {
    'constant': false,
    'inputs': [],
    'name': 'endSignal',
    'outputs': [],
    'type': 'function'
  }, {
    'inputs': [{
      'name': 'rAddr',
      'type': 'address'
    }],
    'type': 'constructor'
  }, {
    'anonymous': false,
    'inputs': [{
      'indexed': false,
      'name': 'pro',
      'type': 'bool'
    }, {
      'indexed': false,
      'name': 'addr',
      'type': 'address'
    }],
    'name': 'LogSignal',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [],
    'name': 'EndSignal',
    'type': 'event'
  }
]

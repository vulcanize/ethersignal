export default [
  {
    'constant': false,
    'inputs': [{
      'name': 'title',
      'type': 'string'
    }, {
      'name': 'text',
      'type': 'string'
    }],
    'name': 'registerPosition',
    'outputs': [],
    'type': 'function'
  }, {
    'anonymous': false,
    'inputs': [{
      'indexed': true,
      'name': 'regAddr',
      'type': 'address'
    }, {
      'indexed': true,
      'name': 'sigAddr',
      'type': 'address'
    }, {
      'indexed': false,
      'name': 'title',
      'type': 'string'
    }, {
      'indexed': false,
      'name': 'text',
      'type': 'string'
    }],
    'name': 'LogPosition',
    'type': 'event'
  }
]

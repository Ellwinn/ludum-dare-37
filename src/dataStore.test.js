const tap = require('tap')
const dataStore = require('./dataStore')

tap.test('dataStore', test => {
  test.equal(typeof dataStore, 'object', 'dataStore should be an object')
  test.equal(typeof dataStore.dispatch, 'function', 'should have a dispatch function')
  test.equal(typeof dataStore.subscribe, 'function', 'should have a subscribe function')
  test.equal(typeof dataStore.getState, 'function', 'should have a getState function')
  test.end()
})

const tap = require('tap')
const {
  reducerTypes,
  reducers
} = require('./reducers')

tap.test('reducerTypes', test => {
  test.equal(reducerTypes.PLAYER_MOVE, 'PLAYER_MOVE')

  test.end()
})

tap.test('reducers: default state', test => {
  const defaultState = {
    foo: 'bar'
  }
  const action = {}
  const state = reducers(defaultState, action)

  test.equal(state.foo, 'bar', 'should not change')
  test.equal(state === defaultState, false, 'should return a copy of the state')

  test.end()
})

const tap = require('tap')
const {
  playerMove
} = require('./actions')
const {reducerTypes} = require('./reducers')

tap.test('playerMove', test => {
  const action = playerMove({direction: 'north'})

  test.equal(action.type, reducerTypes.PLAYER_MOVE, 'should set correct type')
  test.equal(action.direction, 'north', 'should set the correct direction')

  test.end()
})

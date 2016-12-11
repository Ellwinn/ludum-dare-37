const tap = require('tap')
const {
  mobMove,
  update,
  worldCreateTile,
  worldUpdate,
  setGameState
} = require('./actions')
const {reducerTypes} = require('./reducers')

const errorMessage = (category, property) => `[${category}] The property "${property}" is required`

tap.test('mobMove', test => {
  try {
    mobMove()
  } catch (error) {
    test.equal(error.message, errorMessage('mobMove', 'id'))
  }

  const action = mobMove({direction: 'north', id: 'xyz'})

  test.equal(action.type, reducerTypes.MOB_MOVE, 'should set correct type')
  test.equal(action.direction, 'north', 'should set the correct direction')
  test.equal(action.id, 'xyz', 'should set the correct id')

  test.end()
})

tap.test('mobUpdate', test => {
  let action = update()

  test.equal(action.type, reducerTypes.UPDATE)
  test.equal(action.timePassed, 0)

  action = update({
    timePassed: 23
  })

  test.equal(action.type, reducerTypes.UPDATE)
  test.equal(action.timePassed, 23)

  test.end()
})

tap.test('worldCreateTile', test => {
  try {
    worldCreateTile()
    test.fail('should required x position')
  } catch (error) {
    test.equal(error.message, errorMessage('worldCreateTile', 'x'))
  }

  try {
    worldCreateTile({
      x: 0
    })
    test.fail('should required y position')
  } catch (error) {
    test.equal(error.message, errorMessage('worldCreateTile', 'y'))
  }

  const action = worldCreateTile({x: 5, y: 7})

  test.equal(action.type, reducerTypes.WORLD_CREATE_TILE)
  test.equal(action.x, 5)
  test.equal(action.y, 7)

  test.end()
})

tap.test('worldUpdate', test => {
  test.equal(worldUpdate().type, reducerTypes.WORLD_UPDATE)
  test.end()
})

tap.test('setGameState', test => {
  try {
    setGameState()
    test.fail('setGameState should require a status')
  } catch (error) {
    test.equal(error.message, '[setGameState] The property "state" is required')
  }

  const action = setGameState({
    state: 'foo'
  })

  test.equal(action.type, reducerTypes.SET_GAME_STATE)
  test.equal(action.state, 'foo')

  test.end()
})

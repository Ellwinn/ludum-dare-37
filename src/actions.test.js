const tap = require('tap')
const {
  mobMove,
  mobsUpdate
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
  let action = mobsUpdate()

  test.equal(action.type, reducerTypes.MOBS_UPDATE)
  test.equal(action.timePassed, 0)

  action = mobsUpdate({
    timePassed: 23
  })

  test.equal(action.type, reducerTypes.MOBS_UPDATE)
  test.equal(action.timePassed, 23)

  test.end()
})

const tap = require('tap')
const {createBus} = require('./bus')

const reducers = (state, action) => {
  switch (action.type) {
    case 'SET_FOO':
      return Object.assign({}, state, {
        foo: action.value
      })
    default:
      return Object.assign({}, state)
  }
}

tap.test('bus: create a new bus', test => {
  try {
    createBus()
    test.fail('bus should require a reducer to be passed in')
  } catch (error) {
    test.equal(error.message, '[createBus] The property "reducers" is required')
  }

  const bus = createBus({reducers})

  test.equal(typeof bus, 'object', 'should be an object')
  test.end()
})

tap.test('bus: should return a default state', test => {
  const bus = createBus({reducers})

  test.equal(typeof bus.getState(), 'object', 'getState should return an object')

  test.end()
})

tap.test('bus: create with a starting state', test => {
  const bus = createBus({
    reducers,
    defaultState: {
      foo: 'bar'
    }
  })
  const state = bus.getState()

  test.equal(state.foo, 'bar', 'state should match value passed in')
  test.end()
})

tap.test('bus: subscriptions', test => {
  const bus = createBus({reducers})
  const subscription1 = bus.subscribe(() => {})
  const subscription2 = bus.subscribe(() => {})

  test.equal(/[a-z0-9]{12}/.test(subscription1), true, 'should return a valid id')
  test.equal(subscription1 !== subscription2, true, 'subscription ids should be unique')

  test.end()
})

tap.test('bus: dispatching messages', test => {
  const bus = createBus({reducers})
  const action = 'bad action'
  const message = 'dispatch requires an object with a property of type set'

  try {
    bus.dispatch(action)
    test.fail(message)
  } catch (error) {
    test.equal(error.message, 'dispatch requires an object with a type property', message)
  }

  test.end()
})

tap.test('bus: subscription callback', test => {
  test.plan(1)

  const bus = createBus({
    reducers,
    defaultState: {
      foo: 'bar'
    }
  })
  const action = {
    type: 'SET_FOO',
    value: 'baz'
  }

  bus.subscribe(() => {
    test.equal(bus.getState().foo, 'baz', 'should return updated state')
  })

  bus.dispatch(action)
})

tap.test('bus: reset', test => {
  const initialState = {
    foo: 'bar'
  }

  const bus = createBus({
    reducers,
    defaultState: initialState
  })

  let stage = 'initial'

  const initialJSON = JSON.stringify(initialState)

  bus.subscribe(() => {
    const currentStateJSON = JSON.stringify(bus.getState())

    switch (stage) {
      case 'initial':
        test.equal(
          initialJSON !== currentStateJSON,
          true,
          'verify states are different'
        )

        stage = 'reset'
        return
      case 'reset':
        test.equal(
          initialJSON === currentStateJSON,
          true,
          'verify states are the same again'
        )
        test.end()
        return
    }
  })

  bus.dispatch({
    type: 'SET_FOO'
  })
  bus.reset()
})

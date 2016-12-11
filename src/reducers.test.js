const tap = require('tap')
// const mob = require('./mob')
// const createTile = require('./tile')

const {
  reducerTypes,
  reducers
} = require('./reducers')

const {
  mobMove,
  update,
  worldCreateTile,
  setGameState
} = require('./actions')

const {
  EAST,
  MOB_MOVE_STEPS
} = require('./constants')

tap.test('reducerTypes', test => {
  test.equal(reducerTypes.UPDATE, 'UPDATE')
  test.equal(reducerTypes.MOB_MOVE, 'MOB_MOVE')
  test.equal(reducerTypes.WORLD_CREATE_TILE, 'WORLD_CREATE_TILE')
  test.equal(reducerTypes.WORLD_UPDATE, 'WORLD_UPDATE')
  test.equal(reducerTypes.SET_GAME_STATE, 'SET_GAME_STATE')

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

tap.test('reducers: mob move', test => {
  const defaultState = {
    mobs: [
      {
        id: 'abc',
        active: true,
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: 'def',
        active: false,
        position: {
          x: 0,
          y: 0
        }
      }
    ]
  }
  const action = mobMove({
    direction: 'EAST',
    id: 'abc'
  })
  const state = reducers(defaultState, action)

  test.equal(state.mobs[0].position.x, 0, 'active mob should not move')
  test.equal(state.mobs[0].position.y, 0, 'active mob should not move')
  test.equal(state.mobs[1].position.x, 0, 'other mobs should not be affected')
  test.equal(state.mobs[1].position.y, 0, 'other mobs should not be affected')

  test.end()
})

tap.test('reducers: mob move', test => {
  const defaultState = {
    mobs: [
      {
        id: 'abc',
        active: false,
        position: {
          x: 0,
          y: 0
        },
        remainingSteps: 0,
        direction: null
      },
      {
        id: 'def',
        active: false,
        position: {
          x: 0,
          y: 0
        },
        remainingSteps: 0,
        direction: null
      }
    ]
  }
  const action = mobMove({
    direction: EAST,
    id: 'abc'
  })
  const state = reducers(defaultState, action)
  const [a, b] = state.mobs

  test.equal(a.position.x, 1, 'active mob should move +1')
  test.equal(a.position.y, 0, 'active mob should not move')
  test.equal(a.direction, EAST, 'direction should be set')
  test.equal(a.remainingSteps, MOB_MOVE_STEPS, 'steps should be set')

  test.equal(b.position.x, 0, 'other mobs should not be affected')
  test.equal(b.position.y, 0, 'other mobs should not be affected')
  test.equal(b.direction === null, true, 'direction should not be set')
  test.equal(b.remainingSteps, 0, 'steps should be changed')

  test.end()
})

tap.test('reducers: mobs update', test => {
  const defaultState = {
    world: [],
    mobs: [
      {
        id: 'a',
        active: true,
        remainingSteps: 24
      },
      {
        id: 'b',
        active: false,
        remainingSteps: 0
      },
      {
        id: 'c',
        active: true,
        remainingSteps: 0.5
      }
    ]
  }
  const action = update({
    timePassed: 1
  })
  const state = reducers(defaultState, action)
  const [a, b, c] = state.mobs

  test.equal(a.active, true)
  test.equal(a.remainingSteps, 23)

  test.equal(b.active, false)
  test.equal(b.remainingSteps, 0)

  test.equal(c.active, false)
  test.equal(c.remainingSteps, 0)
  test.end()
})

tap.test('reducers: worldCreateTile', test => {
  const defaultState = {
    world: [
      [null, null, null],
      [null, null, null]
    ]
  }
  const action = worldCreateTile({x: 1, y: 0})
  const state = reducers(defaultState, action)

  test.equal(state.world[0][1] !== null, true)
  test.equal(typeof state.world[0][1], 'number')

  test.end()
})

// TODO figure out a more dynamic way of testing this...
/*
tap.test('reducers: worldUpdate', test => {
  const defaultState = {
    world: [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null]
    ],
    mobs: [
      mob()
    ]
  }
  const action = worldUpdate()
  const state = reducers(defaultState, action)

  const tile = createTile()

  const expected = [
    [tile, tile, tile, tile, null],
    [tile, tile, tile, null, null],
    [tile, tile, null, null, null],
    [tile, null, null, null, null],
    [null, null, null, null, null]
  ]

  test.equal(JSON.stringify(state.world), JSON.stringify(expected))
  test.end()
})
*/

tap.test('set game type', test => {
  const defaultState = {
    gameState: 'main'
  }
  const action = setGameState({
    state: 'end'
  })
  const state = reducers(defaultState, action)

  test.equal(state.gameState, 'end')

  test.end()
})

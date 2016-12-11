const tap = require('tap')
const mob = require('./mob')

tap.test('mob', test => {
  const player = mob()

  test.equal(player.hasOwnProperty('id'), true, 'should have an id')
  test.equal(/[a-z0-9]+/.test(player.id), true, 'id should be valid')
  test.equal(player.hasOwnProperty('position'), true, 'should have a position')
  test.equal(player.position.x, 0, 'position.x should default to 0')
  test.equal(player.position.y, 0, 'position.y should default to 0')
  test.equal(player.active === false, true, 'should not be active to start')
  test.equal(player.remainingSteps, 0, 'should set remaining steps')
  test.equal(player.direction, null, 'should set non-moving direction')

  test.end()
})

tap.test('mob: position', test => {
  const player = mob({
    x: 10,
    y: 20
  })

  test.equal(player.hasOwnProperty('id'), true, 'should have an id')
  test.equal(/[a-z0-9]+/.test(player.id), true, 'id should be valid')
  test.equal(player.hasOwnProperty('position'), true, 'should have a position')
  test.equal(player.position.x, 10, 'position.x should be set correctly')
  test.equal(player.position.y, 20, 'position.y should be set correctly')
  test.equal(player.active === false, true, 'should not be active to start')
  test.equal(player.remainingSteps, 0, 'should set remaining steps')
  test.equal(player.direction, null, 'should set non-moving direction')

  test.end()
})

tap.test('mob: getSurroundingTiles', test => {
  const player = mob({
    x: 3,
    y: 3
  })

  const area = player.getSurroundingTiles()

  test.equal(area instanceof Array, true)

  /* 3 spaces around each item
   * ...x...
   * ..xxx..
   * .xxxxx.
   * xxxXxxx
   * .xxxxx.
   * ..xxx..
   * ...x...
  */

  const expected = [
    {x: 3, y: -2},
    {x: 2, y: -1},
    {x: 3, y: -1},
    {x: 4, y: -1},

    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},

    {x: 0, y: 1},
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 3, y: 1},
    {x: 4, y: 1},
    {x: 5, y: 1},
    {x: 6, y: 1},

    {x: -1, y: 2},
    {x: 0, y: 2},
    {x: 1, y: 2},
    {x: 2, y: 2},
    {x: 3, y: 2},
    {x: 4, y: 2},
    {x: 5, y: 2},
    {x: 6, y: 2},
    {x: 7, y: 2},

    {x: -2, y: 3},
    {x: -1, y: 3},
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},
    {x: 4, y: 3},
    {x: 5, y: 3},
    {x: 6, y: 3},
    {x: 7, y: 3},
    {x: 8, y: 3},

    {x: -1, y: 4},
    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},
    {x: 4, y: 4},
    {x: 5, y: 4},
    {x: 6, y: 4},
    {x: 7, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    {x: 4, y: 5},
    {x: 5, y: 5},
    {x: 6, y: 5},

    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},
    {x: 4, y: 6},
    {x: 5, y: 6},

    {x: 2, y: 7},
    {x: 3, y: 7},
    {x: 4, y: 7},

    {x: 3, y: 8}
  ]

  test.equal(JSON.stringify(area), JSON.stringify(expected))

  test.end()
})

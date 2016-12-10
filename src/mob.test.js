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

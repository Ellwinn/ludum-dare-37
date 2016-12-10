const tap = require('tap')
const mob = require('./mob')

tap.test('mob', test => {
  const player = mob()

  test.equal(player.hasOwnProperty('position'), true)

  test.end()
})

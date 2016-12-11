const tap = require('tap')
const battle = require('./battle')
const mob = require('./mob')

tap.test('battle', test => {
  try {
    battle()
    test.fail('Battle requires two mobs')
  } catch (error) {
    test.equal(error.message, '[battle] Missing required property')
  }

  const mobs = [
    mob({x: 0, y: 0}),
    mob({x: 1, y: 0})
  ]

  const [attacking, defending] = battle(mobs)

  test.equal(attacking.health < 10, true)
  test.equal(defending.health < 10, true)

  test.end()
})

const tap = require('tap')
const heal = require('./heal')

tap.test('heal', test => {
  try {
    heal()
    test.fail('Heal required a mob')
  } catch (error) {
    test.equal(error.message, '[heal] Missing required property')
  }

  test.end()
})

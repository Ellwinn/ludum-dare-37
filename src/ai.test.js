const tap = require('tap')
const ai = require('./ai')

tap.test('ai', test => {
  try {
    ai()
    test.fail('ai should required array of mobs')
  } catch (error) {
    test.equal(error.message, '[ai] Missing required property')
  }

  test.end()
})

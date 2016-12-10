const tap = require('tap')
const game = require('./game')

const message = (prop) => `[game] The property "${prop}" is required`

tap.test('game', test => {
  let tryCompleted = false

  try {
    game()
    tryCompleted = true
  } catch (error) {
    test.pass('game cannot be called without arguments')
  }

  try {
    game({canvas: 'test'})
    tryCompleted = true
  } catch (error) {
    test.equal(error.message, message('ctx'))
  }

  try {
    game({ctx: 'test'})
    tryCompleted = true
  } catch (error) {
    test.equal(error.message, message('canvas'))
  }

  test.equal(tryCompleted, false, 'None of the try statements should complete')
  test.end()
})

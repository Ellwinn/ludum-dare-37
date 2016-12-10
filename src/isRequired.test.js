const tap = require('tap')
const isRequired = require('./isRequired')

tap.test('isRequired', test => {
  let tryCompleted = false

  try {
    isRequired()
    tryCompleted = true
  } catch (error) {
    test.equal(error.message, 'Missing required property')
  }

  try {
    isRequired({
      category: 'foo'
    })
    tryCompleted = true
  } catch (error) {
    test.equal(error.message, '[foo] Missing required property')
  }

  try {
    isRequired({
      property: 'bar'
    })
    tryCompleted = true
  } catch (error) {
    test.equal(error.message, 'The property "bar" is required')
  }

  if (tryCompleted) {
    test.fail('isRequired should always throw an error')
  }

  test.end()
})

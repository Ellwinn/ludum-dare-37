const tap = require('tap')
const collision = require('./collision')
const mob = require('./mob')

tap.test('collision', test => {
  const mobs = [
    mob({x: 3, y: 4}),
    mob({x: 2, y: 7})
  ]
  const ids = mobs.map(mob => mob.id)

  try {
    collision()
    test.fail('collision requires position argument')
  } catch (error) {
    test.equal(error.message, '[collision] The property "id" is required')
  }

  try {
    collision({
      id: ids[0]
    })
    test.fail('collision requires array of elements')
  } catch (error) {
    test.equal(error.message, '[collision] The property "position" is required')
  }

  try {
    collision({
      id: ids[0],
      position: {x: 0, y: 0}
    })
    test.fail('collision requires an id')
  } catch (error) {
    test.equal(error.message, '[collision] The property "elements" is required')
  }

  const keys = collision({
    id: ids[0],
    position: {
      x: 2,
      y: 7
    },
    elements: mobs
  })

  test.equal(keys.length, 1, 'should return 1 item')
  test.equal(keys[0], ids[1], 'should match the id of item 1 (second in array)')

  test.end()
})

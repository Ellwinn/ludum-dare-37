const tap = require('tap')
const constants = require('./constants')

tap.test('constants', test => {
  test.equal(constants.TILE_SIZE, 32, 'Tile size is 32')
  test.equal(typeof constants.WORLD_WIDTH, 'number', 'World width is set')
  test.equal(typeof constants.WORLD_HEIGHT, 'number', 'World height is set')

  test.equal(constants.KEY_LEFT, 37)
  test.equal(constants.KEY_RIGHT, 39)
  test.equal(constants.KEY_UP, 38)
  test.equal(constants.KEY_DOWN, 40)
  test.equal(constants.KEY_ONE, 49)
  test.equal(constants.KEY_TWO, 50)
  test.equal(constants.KEY_THREE, 51)
  test.equal(constants.KEY_FOUR, 52)

  test.equal(constants.NORTH, 'NORTH')
  test.equal(constants.SOUTH, 'SOUTH')
  test.equal(constants.EAST, 'EAST')
  test.equal(constants.WEST, 'WEST')

  test.equal(typeof constants.MOB_MOVE_STEPS, 'number')

  test.end()
})
